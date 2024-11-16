from flask import Flask
from app.auth import auth as auth_blueprint
from app.routes import main as main_blueprint
from app.api import api as api_blueprint
from app.models import db


def create_app():
    app = Flask(__name__, template_folder='../templates', static_folder='../static')

    app.config.from_pyfile('config.py')
    db.init_app(app)

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)
    app.register_blueprint(api_blueprint)

    with app.app_context():
        db.create_all()

    return app