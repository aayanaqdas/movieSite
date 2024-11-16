import sys
import os

# Add the app directory to the PYTHONPATH
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")