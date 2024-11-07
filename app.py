from flask import Flask
from main import main as main_blueprint
from api import api as api_blueprint
from auth import auth as auth_blueprint

app = Flask(__name__)

# Register the blueprints
app.register_blueprint(main_blueprint)
app.register_blueprint(api_blueprint)
app.register_blueprint(auth_blueprint)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
