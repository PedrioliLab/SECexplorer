import os.path as p

import pandas as pd
import numpy as np
from flask import jsonify, request

from secexplorer import api

_protein_traces_fpath = \
    p.join(p.dirname(__file__), 'data', 'protein_traces_filtered_wide.tsv')
_protein_traces = pd.read_csv(_protein_traces_fpath, sep='\t')
_protein_traces = _protein_traces.set_index('protein_id')


def get_protein_traces_by_id(ids):
    traces = _protein_traces.loc[ids]
    protein_does_exist = \
        np.array([uid in _protein_traces.index for uid in ids])
    if not all(protein_does_exist):
        raise ValueError(
            'There are protein in the query that do not exist in the data set. '
            'These proteins are: %s.' % ', '.join(
                np.array(ids)[~protein_does_exist]))
    proteins = []
    for uid, trace in traces.iterrows():
        proteins.append({
            'uniprot_id': uid,
            'trace': trace.tolist()
        })
    return proteins


@api.route('/proteins', methods=['GET'])
def get_proteins():
    uniprot_ids_str = request.args.get('uniprot_ids')

    try:
        if uniprot_ids_str is not None:
            uniprot_ids = uniprot_ids_str.split(',')
            proteins = get_protein_traces_by_id(uniprot_ids)
            print proteins
        else:
            return 'Malformed request', 400
    except ValueError as err:
        return err.message, 404
    else:
        return jsonify({
            'proteins': proteins
        })
