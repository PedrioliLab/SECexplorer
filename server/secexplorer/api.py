from __future__ import absolute_import

import json
import math

from flask import Blueprint, jsonify, request, make_response

from .feature import compute_complex_features, get_protein_traces_by_id


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
    ids = data.get('ids')
    id_type = data.get('id_type')
    try:
        features = compute_complex_features(ids, id_type)
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
               id: number,
               id_type: 'UNIPROTKB',
               intensity: Array<number>,
               sec: Array<number>
           },
           ...
        ]
    }

    """
    ids_str = request.args.get('ids')
    id_type = request.args.get('id_type')

    if ids_str is None:
        return 'Malformed request', 400

    proteins = []
    try:
        ids = ids_str.split(',')
        protein_traces, calibration_parameters, monomer_secs, monomer_intensities = get_protein_traces_by_id(ids, id_type)
        a, b = calibration_parameters
        sec_positions = map(int, protein_traces.columns)
        for uid, trace in protein_traces.iterrows():
            proteins.append({
                'id': uid,
                'id_type': id_type,
                'intensity': map(float, trace.tolist()),
                'sec': sec_positions,
                'a': a,
                'b': b,
                'monomer_sec': int(monomer_secs.get(uid)),
                'monomer_intensity': int(monomer_intensities.get(uid)),
            })
    except ValueError as err:
        make_response(jsonify(error=err.message), 404)

    return jsonify({
        'proteins': proteins,
        'calibration_parameters': list(calibration_parameters)
    })
