# -*- coding: utf-8 -*-
"""
This module holds an application instance that is passed to a server such as
gunicorn or uWSGI.

If this module is executed directly, the application is executed by a flask
development server.

"""

from werkzeug.contrib.profiler import ProfilerMiddleware
from secexplorer.appfactory import create_app


# NOTE: If additional location-specific configuration is needed at some point
# cfg = flask.Config(p.realpath(p.dirname(__file__)))
# Will throw a RuntimeError if not provided
# cfg.from_envvar('SECEXPLORER_SETTINGS')
cfg = {}

app = create_app(cfg)

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='SECexplorer server')
    parser.add_argument(
        '--port', action='store', type=int, default=8020,
        help='the port on which the server should listen')
    parser.add_argument(
        '--threaded', action='store_true', default=False,
        help='if the dev server should run in multi-threaded mode')
    parser.add_argument(
        '--profile', action='store_true', default=False,
        help='if application should be profiled')
    args = parser.parse_args()

    if args.profile:
        app.config['PROFILE'] = True
        app.wsgi_app = ProfilerMiddleware(app.wsgi_app, restrictions=[30])

    app.run(port=args.port, debug=True, threaded=args.threaded)
