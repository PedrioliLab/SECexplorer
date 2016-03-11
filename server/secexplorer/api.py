# from rpy2 import robjects

# import json
# from secexplorer import Blueprint, jsonify, request

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
