import sys
import logging

# Set up logging for debugging
logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

# Add the project directory to the Python path
sys.path.insert(0, "/home/pi/projects/movieWorld")

from run import app as application  # Import the Flask app object

#gunicorn --bind 0.0.0.0:8000 run:app --log-level debug