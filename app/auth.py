# auth.py
import json #provides functions for converting (dumps) and parsing (loads) JSON data
from flask import Blueprint, request, jsonify, current_app # jsonify is specifically used in Flask to create JSON response objects for HTTP requests.
# from app.models import db
# from app.models import User

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username').lower()
    password = data.get('password')

    # if username and password:
    #     user = User.query.filter_by(username=username, password=password).first()

    db = current_app.config['db']
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username=%s AND password=%s", (username, password))
    user = cursor.fetchone()

    if user:
        return jsonify({'status': 'success', 'message': 'Login successful!', 'username': username})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid username or password.'})
    

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username').lower()
    password = data.get('password')

    db = current_app.config['db']
    cursor = db.cursor(dictionary=True)

    # Check if user exists
    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()

    if user:
        return jsonify({'status': 'error', 'message': 'Username taken.'})
    
    cursor.execute("INSERT INTO users (username, password, watchlist) VALUES (%s, %s, %s)", (username, password, json.dumps([])))
    db.commit()
    return jsonify({'status': 'success', 'message': 'Signup successful!', 'username': username})

    


@auth.route('/watchlist', methods=['POST'])
def get_watchlist():
    data = request.get_json()
    username = data.get('username').lower()

    db = current_app.config['db']
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()

    if user:
        watchlist = json.loads(user['watchlist'] or '[]')
        return jsonify({'status': 'success', 'watchlist': watchlist})
    else:
        return jsonify({'status': 'error', 'message': 'User watchlist not found.'})
    

@auth.route('/watchlist/add', methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    username = data.get('username').lower()
    media_item = data.get('media_item')

    db = current_app.config['db']
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT watchlist FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()
    if user:
        watchlist = json.loads(user['watchlist'] or '[]')
        watchlist.append(media_item)
        cursor.execute("UPDATE users SET watchlist=%s WHERE username=%s", (json.dumps(watchlist), username))
        db.commit()

        return jsonify({'status': 'success', 'message': 'Item added to watchlist!', 'watchlist': watchlist})
    else:
        return jsonify({'status': 'error', 'message': 'User not found.'})


@auth.route('/watchlist/remove', methods=['POST'])
def remove_from_watchlist():
    data = request.get_json()
    username = data.get('username').lower()
    media_id = data.get('media_id')

    # user = User.query.filter_by(username=username).first()
    # if user:
    #     watchlist = json.loads(user.watchlist or '[]')
    #     watchlist = [item for item in watchlist if item['id'] != media_id]
    #     user.watchlist = json.dumps(watchlist)
    #     db.session.commit()

    db = current_app.config['db']
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT watchlist FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()

    if user:
        watchlist = json.loads(user['watchlist'] or '[]')
        watchlist = [item for item in watchlist if item['id'] != media_id]
        cursor.execute("UPDATE users SET watchlist=%s WHERE username=%s", (json.dumps(watchlist), username))
        db.commit()
        return jsonify({'status': 'success', 'message': 'Item removed from watchlist!', 'watchlist': watchlist})
    else:
        return jsonify({'status': 'error', 'message': 'User not found.'})