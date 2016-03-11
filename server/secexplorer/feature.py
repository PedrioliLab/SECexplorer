from rpy2 import robjects
from rpy2.robjects.packages import importr
from rpy2.robjects import pandas2ri
from rpy2.robjects import numpy2ri

pandas2ri.activate()
numpy2ri.activate()

robjects.numpy2ri.activate()

secprofiler = importr('SECprofiler')

from data import get_protein_traces_by_id


def compute_complex_features(protein_ids):
    traces = get_protein_traces_by_id(protein_ids)
    result = secprofiler.findComplexFeatures(traces, traces.index, 0.99)
    features = pandas2ri.ri2py(result[1])
    features['n_subunits'] = [len(r) for r in features.subgroup.str.split(';')]
    features_dicts = []
    for idx, row in features.iterrows():
        features_dicts.append(row.to_dict())
    return features_dicts
    

