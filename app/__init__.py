from flask import Flask
import mysql.connector
from app.auth import auth as auth_blueprint
from app.routes import main as main_blueprint
from app.api import api as api_blueprint
# from app.models import db
from app.config import DATABASE_CONFIG


def create_app():
    app = Flask(__name__, template_folder='../templates', static_folder='../static')

    app.config['db'] = mysql.connector.connect(**DATABASE_CONFIG)

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)
    app.register_blueprint(api_blueprint)

    return app