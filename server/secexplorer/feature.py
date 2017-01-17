# encoding: utf-8
from collections import OrderedDict

import math

import pandas as pd

from rpy2 import robjects
from rpy2.robjects.packages import importr
from rpy2.robjects import pandas2ri
from rpy2.robjects import numpy2ri
from rpy2.rinterface import RRuntimeError, NULL


base = importr('base')

pandas2ri.activate()
numpy2ri.activate()

robjects.numpy2ri.activate()

secprofiler = importr('SECprofiler')

backend_cache = OrderedDict()


def cached_run_secexploerer(protein_ids, id_type):
    key = (tuple(sorted(protein_ids)), id_type)
    if key in backend_cache:
        return backend_cache[key]
    try:
        result = secprofiler.runSECexplorer(protein_ids, id_type)
    except RRuntimeError as err:
        raise ValueError(err.message)
    while len(backend_cache) > 1000:
        first_key = backend_cache.keys()[0]
        del backend_cache[first_key]
    backend_cache[key] = result
    return result


def get_protein_traces_by_id(protein_ids, id_type):
    result = cached_run_secexploerer(protein_ids, id_type)
    if result is None or result[1] == NULL:
        return pd.DataFrame(), [], [0, 0], {}, {}

    traces = pandas2ri.ri2py_dataframe(result[1][0][0])
    traces = traces.set_index(["id"])
    traces.index.name = "protein_id"

    mapping_table = pandas2ri.ri2py_dataframe(result[0][3])
    if len(mapping_table.columns) == 3:
        mapping = dict(zip(mapping_table.iloc[:, 0],
                           mapping_table.iloc[:, 2]))
        mapping_back = dict(zip(mapping_table.iloc[:, 2],
                                mapping_table.iloc[:, 0]))
    else:
        mapping = {}
        mapping_back = {}

    labels = []
    for uniprot_id in traces.index:
        extra_label = mapping.get(uniprot_id)
        if extra_label is not None:
            label = "%s (%s)" % (extra_label, uniprot_id)
            label = extra_label
        else:
            label = uniprot_id
        labels.append(label)
    calibration_parameters = result[1][2]

    df_protein_info = pandas2ri.ri2py_dataframe(result[1][0][2])
    df_protein_info = df_protein_info.set_index(["id"])
    df_protein_info.index.name = "protein_id"
    lookup = lambda id: mapping.get(id, id)
    df_protein_info.index = map(lookup, df_protein_info.index)
    monomer_secs = {}
    monomer_intensities = {}
    for protein_id in protein_ids:
        if protein_id not in df_protein_info.index:
            continue
        mw = df_protein_info.loc[protein_id, "protein_mw"]
        sec = (math.log(mw) - calibration_parameters[0]) / calibration_parameters[1]
        sec = int(round(sec))
        if sec <= 0:
            sec = 1
        uniprot_id = mapping_back.get(protein_id, protein_id)

        # look for local peak:
        if 1 < sec < 85:
            i1 = traces.loc[uniprot_id, str(sec - 1)]
            i2 = traces.loc[uniprot_id, str(sec)]
            i3 = traces.loc[uniprot_id, str(sec + 1)]
            if i1 >= i2 and i1 >= i3:
                intensity = i1
                sec = sec - 1
            elif i2 >= i1 and i2 >= i3:
                intensity = i2
            else:
                intensity = i3
                sec = sec + 1
        else:
            intensity = traces.loc[uniprot_id, str(sec)]

        monomer_secs[uniprot_id] = sec
        monomer_intensities[uniprot_id] = intensity

    return traces, labels, calibration_parameters, monomer_secs, monomer_intensities


def compute_complex_features(protein_ids, id_type):
    result = cached_run_secexploerer(protein_ids, id_type)
    if result is None or result[1] == NULL:
        header = [id_type, "name"]
        return [], [], header, protein_ids, []
    if result[1][1] == NULL:
        header = [id_type, "name"]
        return [], [], header, [], []

    features_table = pandas2ri.ri2py_dataframe(result[1][1])

    failed_conversion = [cell[0] for cell in pandas2ri.ri2py_listvector(result[0][0])]
    no_ms_signal = list(pandas2ri.ri2py_listvector(result[0][1]))

    mapping_table = pandas2ri.ri2py_dataframe(result[0][3])

    if len(mapping_table.columns) == 3:
        mapping = dict(zip(mapping_table.iloc[:, 0],
                           mapping_table.iloc[:, 2]))
    else:
        mapping = {}

    mapping_table.name = [name.split("|")[1] for name in mapping_table.name]
    header = list(map(str, mapping_table.columns))
    rows = [list(row) for idx, row in mapping_table.iterrows()]

    features = [row.to_dict() for idx, row in features_table.iterrows()]

    def fix(txt):
        return "; ".join(mapping.get(w.strip(), w.strip()) for w in txt.split(";"))

    for row in features:
        row["subunits_detected"] = fix(row["subunits_detected"])

    return features, rows, header, failed_conversion, no_ms_signal
