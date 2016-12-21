# encoding: utf-8
from collections import OrderedDict

import numpy as np
import pandas as pd

from rpy2 import robjects
from rpy2.robjects.packages import importr
from rpy2.robjects import pandas2ri
from rpy2.robjects import numpy2ri
from rpy2.rinterface import RRuntimeError


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
        backend_cache[key] = None
        return None
    while len(backend_cache) > 1000:
        first_key = backend_cache.keys()[0]
        del backend_cache[first_key]
    backend_cache[key] = result
    return result


def get_protein_traces_by_id(protein_ids, id_type):
    result = cached_run_secexploerer(protein_ids, id_type)
    if result is None:
        return pd.DataFrame(), [], [0, 0], {}, {}

    traces = pandas2ri.ri2py_dataframe(result[1][0][0])
    traces = traces.set_index(["id"])
    traces.index.name = "protein_id"


    mapping_table = pandas2ri.ri2py_dataframe(result[0][3])
    if len(mapping_table.columns) == 3:
        mapping = dict(zip(mapping_table.iloc[:, 0],
                           mapping_table.iloc[:, 2]))
    else:
        mapping = {}

    labels = []
    for uniprot_id in traces.index:
        extra_label = mapping.get(uniprot_id)
        if extra_label is not None:
            label = "%s (%s)"% (uniprot_id, extra_label)
        else:
            label = uniprot_id
        labels.append(label)

    features = pandas2ri.ri2py_dataframe(result[1][1])

    monomer_secs = {}
    monomer_intensities = {}
    for subunits, monomer_sec in zip(features.subunits_detected, features.monomer_sec):
        subunits = subunits.split(";")
        monomer_sec = monomer_sec.split(";")
        for (su, sec) in zip(subunits, monomer_sec):
            monomer_secs[su] = sec
            intensity = traces.loc[su, sec]
            monomer_intensities[su] = intensity

    calibration_parameters = result[1][2]
    return traces, labels, calibration_parameters, monomer_secs, monomer_intensities


def compute_complex_features(protein_ids, id_type):
    result = cached_run_secexploerer(protein_ids, id_type)
    if result is None:
        header = [id_type, "name"]
        return [], [], header, protein_ids, []

    features_table = pandas2ri.ri2py_dataframe(result[1][1])
    # remove rows with inf or nan values:
    features_table = features_table.replace([np.inf, -np.inf], np.nan).dropna(axis=0, how="any")

    failed_conversion = [cell[0] for cell in pandas2ri.ri2py_listvector(result[0][0])]
    no_ms_signal = list(pandas2ri.ri2py_listvector(result[0][1]))

    mapping_table = pandas2ri.ri2py_dataframe(result[0][3])
    mapping_table.name = [name.split("|")[1] for name in mapping_table.name]
    header = list(map(str, mapping_table.columns))
    rows = [list(row) for idx, row in mapping_table.iterrows()]

    features = [row.to_dict() for idx, row in features_table.iterrows()]

    def fix(txt):
        return "; ".join(w.strip() for w in txt.split(";"))

    for row in features:
        row["subunits_detected"] = fix(row["subunits_detected"])

    return features, rows, header, failed_conversion, no_ms_signal
