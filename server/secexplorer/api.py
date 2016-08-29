import json

from flask import Blueprint, jsonify, request, make_response

from feature import compute_complex_features, get_protein_traces_by_id


api = Blueprint('api', __name__)


@api.route('/complexfeatures', methods=['PUT'])
def get_complex_features():
    """Compute potential complex features for subcomplexes consisting of a subset
    of the queried proteins.

    Response:
    {
        features: [
           {
               left_sec: number,
               right_sec: number,
               subgroup: Array<string>,
               score: number
           },
           ...
        ]
    }

    """
    data = json.loads(request.data)
    uniprot_ids = data.get('uniprot_ids')
    try:
        features = compute_complex_features(uniprot_ids)
        return jsonify({
            'features': features
        })
    except Exception as err:
        return make_response(jsonify(error=err.message), 500)


@api.route('/proteins', methods=['GET'])
def get_proteins():
    """Get a list of protein chromatograms.

    Response:
    {
        proteins: [
           {
               uniprot_id: number,
               intensity: Array<number>,
               sec: Array<number>
           },
           ...
        ]
    }

    """
    uniprot_ids_str = request.args.get('uniprot_ids')

    if uniprot_ids_str is None:
        return 'Malformed request', 400

    proteins = []
    try:
        uniprot_ids = uniprot_ids_str.split(',')
        protein_traces = get_protein_traces_by_id(uniprot_ids)
        sec_positions = map(int, protein_traces.columns)
        for uid, trace in protein_traces.iterrows():
            proteins.append({
                'uniprot_id': uid,
                'intensity': map(float, trace.tolist()),
                'sec': sec_positions
            })
    except ValueError as err:
        make_response(jsonify(error=err.message), 404)

    return jsonify({
        'proteins': proteins
    })
