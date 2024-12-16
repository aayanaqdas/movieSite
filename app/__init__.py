from flask import Flask, g
import mysql.connector
from app.auth import auth as auth_blueprint
from app.routes import main as main_blueprint
from app.api import api as api_blueprint
# from app.models import db
from app.config import DATABASE_CONFIG

# Function to create and configure the Flask application
def create_app():
    app = Flask(__name__, template_folder='../templates', static_folder='../static')

    # app.config['db'] = mysql.connector.connect(**DATABASE_CONFIG)

    # Function to get the database connection
    def get_db():
        # Check if the database connection is already stored in the application context
        if 'db' not in g:
            # If not, create a new database connection and store it in the application context
            g.db = mysql.connector.connect(**DATABASE_CONFIG)
        # Return the database connection
        return g.db

    # Function to close the database connection at the end of the request
    @app.teardown_appcontext
    def close_db(exception):
        # Remove the database connection from the application context
        db = g.pop('db', None)
        # If the database connection exists, close it
        if db is not None:
            db.close()

    # Attach the get_db function to the app
    app.get_db = get_db

    # Register blueprints for different parts of the application
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)
    app.register_blueprint(api_blueprint)

    return app