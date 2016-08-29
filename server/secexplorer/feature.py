#encoding: utf-8

from rpy2 import robjects
from rpy2.robjects.packages import importr
from rpy2.robjects import pandas2ri
from rpy2.robjects import numpy2ri

import sys

pandas2ri.activate()
numpy2ri.activate()

robjects.numpy2ri.activate()

secprofiler = importr('SECprofiler')

from data import get_protein_traces_by_id



def _compute_complex_features(protein_ids):
    traces = get_protein_traces_by_id(protein_ids)
    result = secprofiler.findComplexFeatures(traces, traces.index, 0.99)
    features = pandas2ri.ri2py(result[1])
    print(features)
    features['n_subunits'] = [len(r) for r in features.subgroup.str.split(';')]
    features_dicts = []
    for idx, row in features.iterrows():
        print >> sys.stderr, row
        features_dicts.append(row.to_dict())
    return features_dicts


def compute_complex_features(protein_ids):
    result = secprofiler.runSECexplorer(protein_ids, "UNIPROTKB")

    features = pandas2ri.ri2py_dataframe(result[1][1])
    # traces = pandas2ri.ri2py_dataframe(result[1][0][0])
    # traces = traces.set_index(["id"])
    # traces.index.name = "protein_id"

    left_pp = features.left_pp   # war: Start SEC
    right_pp = features.right_pp   # war: End SEC
    apex = features.apex
    number_of_subunits = features.n_subunits_detected  # #subunits spalte
    number_of_subunits = features.n_subunits_detected  # #subunits spalte
    cluster_score = features.sw_score  # cluster_score spalte
    intensity_based_stoc = features.stoichiometry_estimated
    complex_mw_estimated = features.complex_mw_estimated
    #complex_sec_estimated
    #complex_sec_estimated

    """
    gui: choose uniprotkb, uniprotkb_name, gene_names, ensembl, hgnc
    gui: felder für fehler
    gui: plotte left / right boundaries / apex
    x gui: highlight color of activated row
    gui: traces plotten
    """

    failed_conversion = pandas2ri.ri2py_listvector(result[0][0])
    no_ms_signal = pandas2ri.ri2py_listvector(result[0][1])
    successfull = pandas2ri.ri2py_listvector(result[0][2])
    mapping_table = pandas2ri.ri2py_listvector(result[0][3])

    features['n_subunits'] = [len(r) for r in features.subunits_detected.str.split(';')]
    features_dicts = []
    for idx, row in features.iterrows():
        features_dicts.append(row.to_dict())
    return features_dicts

