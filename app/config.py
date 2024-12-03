
# app/config.py
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

DATABASE_CONFIG = {
    'user': 'flaskuser',
    'password': 'password',
    'host': os.getenv('DB_host_ip'),  # Replace with the IP address of your server 
    'database': 'moviesite'
}
