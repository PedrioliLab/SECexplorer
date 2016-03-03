from flask import Blueprint, jsonify

api = Blueprint('api', __name__)

@api.route('/echo/<message>')
def echo(message):
    return jsonify({
        'message': 'You said: ' + message
    })
