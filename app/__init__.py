from flask import Flask, g
import mysql.connector
from app.auth import auth as auth_blueprint
from app.routes import main as main_blueprint
from app.api import api as api_blueprint
# from app.models import db
from app.config import DATABASE_CONFIG


def create_app():
    app = Flask(__name__, template_folder='../templates', static_folder='../static')

    # app.config['db'] = mysql.connector.connect(**DATABASE_CONFIG)
    def get_db():
        if 'db' not in g:
            g.db = mysql.connector.connect(**DATABASE_CONFIG)
        return g.db

    @app.teardown_appcontext
    def close_db(exception):
        db = g.pop('db', None)
        if db is not None:
            db.close()

    app.get_db = get_db

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)
    app.register_blueprint(api_blueprint)

    return app