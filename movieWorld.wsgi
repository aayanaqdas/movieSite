import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, "/home/pi/projects/movieWorld")

from run import app as application

application = create_app()