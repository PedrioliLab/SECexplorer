import json

from flask import Blueprint, jsonify, request

from data import get_protein_traces_by_id
from feature import compute_complex_features


api = Blueprint('api', __name__)



@api.route('/complexfeatures', methods=['PUT'])
def get_complex_features():
    data = json.loads(request.data)
    uniprot_ids = data.get('uniprot_ids')
    features = compute_complex_features(uniprot_ids)
    return jsonify({
        'features': features
    })


@api.route('/proteins', methods=['GET'])
def get_proteins():
    uniprot_ids_str = request.args.get('uniprot_ids')

    if uniprot_ids_str is None:
        return 'Malformed request', 400

    try:
        uniprot_ids = uniprot_ids_str.split(',')
        protein_traces = get_protein_traces_by_id(uniprot_ids)
        sec_positions = map(int, protein_traces.columns)
        proteins = []
        for uid, trace in protein_traces.iterrows():
            proteins.append({
                'uniprot_id': uid,
                'intensity': trace.tolist(),
                'sec': sec_positions
            })
    except ValueError as err:
        return err.message, 404

    return jsonify({
        'proteins': proteins
    })
