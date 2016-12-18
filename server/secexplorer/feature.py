# encoding: utf-8
from collections import OrderedDict

from rpy2 import robjects
from rpy2.robjects.packages import importr
from rpy2.robjects import pandas2ri
from rpy2.robjects import numpy2ri


pandas2ri.activate()
numpy2ri.activate()

robjects.numpy2ri.activate()

secprofiler = importr('SECprofiler')

backend_cache = OrderedDict()


def cached_run_secexploerer(protein_ids, id_type):
    key = (tuple(sorted(protein_ids)), id_type)
    if key in backend_cache:
        return backend_cache[key]
    result = secprofiler.runSECexplorer(protein_ids, id_type)
    while len(backend_cache) > 1000:
        first_key = backend_cache.keys()[0]
        del backend_cache[first_key]
    backend_cache[key] = result
    return result


def get_protein_traces_by_id(protein_ids, id_type):
    result = cached_run_secexploerer(protein_ids, id_type)
    traces = pandas2ri.ri2py_dataframe(result[1][0][0])
    traces = traces.set_index(["id"])
    traces.index.name = "protein_id"

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
    return traces, calibration_parameters, monomer_secs, monomer_intensities


def compute_complex_features(protein_ids, id_type):
    result = cached_run_secexploerer(protein_ids, id_type)

    features = pandas2ri.ri2py_dataframe(result[1][1])
    print(features)

    failed_conversion = pandas2ri.ri2py_listvector(result[0][0])
    no_ms_signal = pandas2ri.ri2py_listvector(result[0][1])
    successfull = pandas2ri.ri2py_listvector(result[0][2])
    mapping_table = pandas2ri.ri2py_listvector(result[0][3])

    features_dicts = []
    for idx, row in features.iterrows():
        features_dicts.append(row.to_dict())

    return features_dicts
