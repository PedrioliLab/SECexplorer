import logging

from flask import Flask

from natel.config import default as default_config


def create_app(config):
    """Create a Flask application object that registers all the blueprints on
    which the actual routes are defined.

    The default settings for this app are contained in 'config/default.py'.
    Additional can be supplied to this method as a dict-like config argument.

    """

    app = Flask('wsgi')

    # Load the default settings
    app.config.from_object(default_config)
    app.config.update(config)

    # Add log handlers
    # TODO: Consider adding mail and file handlers if being in a production
    # environment (i.e. app.config.DEBUG == False).
    stream_handler = logging.StreamHandler()
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    stream_handler.setFormatter(formatter)
    app.logger.addHandler(stream_handler)

    if app.config['DEBUG']:
        app.logger.info("Starting in __DEBUG__ mode")
    elif app.config['TESTING']:
        app.logger.info("Starting in __TESTING__ mode")
    else:
        app.logger.info("Starting in __PRODUCTION__ mode")

    # Import and register blueprints
    from api import api
    app.register_blueprint(api, url_prefix='/api')

    return app
