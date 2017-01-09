import json
import math

from flask import Blueprint, jsonify, request, make_response

from feature import compute_complex_features, get_protein_traces_by_id


api = Blueprint('api', __name__)


@api.route('/complexfeatures', methods=['PUT'])
def get_complex_features():
    """Compute potential complex features for subcomplexes consisting of a subset
    of the queried proteins.
    """
    data = json.loads(request.data)
    ids = data.get('ids')
    id_type = data.get('id_type')
    try:
        features, rows, header, failed_conversion, no_ms_signal = compute_complex_features(ids, id_type)
        result = {
            'features': features,
            'mappings': rows,
            'mapping_names': header,
            'failed_conversion': failed_conversion,
            'no_ms_signal': no_ms_signal,
        }
        # print(json.dumps(result, indent=4))
        return jsonify(result)
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
        protein_traces, labels, calibration_parameters, monomer_secs, monomer_intensities = get_protein_traces_by_id(ids, id_type)
        sec_positions = map(int, protein_traces.columns)
        for (uid, trace), label in zip(protein_traces.iterrows(), labels):
            print(uid, label)
            if uid in monomer_secs:
                proteins.append({
                    'id': label,
                    'id_type': id_type,
                    'intensity': map(float, trace.tolist()),
                    'label': label if uid == label else "%s (%s)" % (label, uid),
                    'sec': sec_positions,
                    'monomer_sec': int(monomer_secs.get(uid)),
                    'monomer_intensity': int(monomer_intensities.get(uid)),
                })
        result = {
            'proteins': proteins,
            'calibration_parameters': list(calibration_parameters)
        }
        # print(json.dumps(result, indent=4))
        return jsonify(result)
    except Exception as err:
        return make_response(jsonify(error=err.message), 500)
