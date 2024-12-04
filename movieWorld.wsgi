import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, "/home/pi/movieWorld")

from app import create_app
application = create_app()