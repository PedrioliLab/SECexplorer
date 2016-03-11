import json

from flask import Blueprint, jsonify, request
from protein import get_protein_traces_by_id


api = Blueprint('api', __name__)


# from rpy2 import robjects
# @api.route('/reval', methods=['POST'])
# def reval():
#     data = json.loads(request.data)
#     rcode = data.get('rcode', '')

#     response = ''
#     try:
#         res = robjects.r(rcode)
#         response = str(res)
#     except:
#         response = 'ERROR'

#     return jsonify({
#         'message': response
#     })

@api.route('/complexfeatures', methods=['PUT'])
def compute_complex_features():
    data = json.loads(request.data)
    uniprot_ids = data.get('uniprot_ids')
    import ipdb; ipdb.set_trace()
    traces = get_protein_traces_by_id(uniprot_ids)


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
