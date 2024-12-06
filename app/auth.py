# auth.py
import json #provides functions for converting (dumps) and parsing (loads) JSON data
import bcrypt #Password hashing
from flask import Blueprint, request, jsonify, current_app # jsonify is specifically used in Flask to create JSON response objects for HTTP requests.

auth = Blueprint('auth', __name__)

def validate_user(username, password):
    try:
        db = current_app.config['db']
        cursor = db.cursor(dictionary=True)

        query = "SELECT password FROM users WHERE username=%s"
        cursor.execute(query, (username,))

        result = cursor.fetchone()
        if result:
            db_password = result['password']
            if bcrypt.checkpw(password.encode('utf-8'), db_password.encode('utf-8')):
                return True
        return False
    except Exception as e:
        print(f"Error validating user: {e}")
        return False
    
def user_exists(username):
    try:
        db = current_app.config['db']
        cursor = db.cursor(dictionary=True)

        query = "SELECT username FROM users WHERE username=%s"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        return result is not None
    except Exception as e:
        print(f"Error checking if user exists: {e}")
        return False
    

@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username').lower()
        password = data.get('password')

        if validate_user(username, password):
            return jsonify({'status': 'success', 'message': 'Login successful!', 'username': username})
        else:
            return jsonify({'status': 'error', 'message': 'Invalid username or password.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'An error occurred during login.', 'error': str(e)})


@auth.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username').lower()
        password = data.get('password')

        if user_exists(username):
            return jsonify({'status': 'error', 'message': 'Username taken.'})
        else:
            db = current_app.config['db']
            cursor = db.cursor(dictionary=True)
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute("INSERT INTO users (username, password, watchlist) VALUES (%s, %s, %s)", (username, hashed_password, json.dumps([])))
            db.commit()
            return jsonify({'status': 'success', 'message': 'Signup successful!', 'username': username})
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'An error occurred during signup.', 'error': str(e)})


@auth.route('/delete_account', methods=['POST'])
def delete_account():
    try:
        data = request.get_json()
        username = data.get('username').lower()
        password = data.get('password')

        if validate_user(username, password):
            db = current_app.config['db']
            cursor = db.cursor(dictionary=True)

            query = "DELETE FROM users WHERE username=%s"
            cursor.execute(query, (username,))
            db.commit()
            return jsonify({'status': 'success', 'message': 'Account deleted!'})
        else:
            return jsonify({'status': 'error', 'message': 'Invalid username or password.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'An error occurred during account deletion.', 'error': str(e)})


@auth.route('/check_session', methods=['POST'])
def check_session():
    try:
        data = request.get_json()
        username = data.get('username').lower()

        if user_exists(username):
            return jsonify({'status': 'success', 'message': 'User session is valid.'})
        else:
            return jsonify({'status': 'error', 'message': 'Invalid session.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'An error occurred during session check.', 'error': str(e)})


@auth.route('/watchlist', methods=['POST'])
def get_watchlist():
    try:
        data = request.get_json()
        username = data.get('username').lower()

        db = current_app.config['db']
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT watchlist FROM users WHERE username=%s", (username,))
        user = cursor.fetchone()

        if user:
            watchlist = json.loads(user['watchlist'] or '[]')
            return jsonify({'status': 'success', 'message': 'Watchlist found', 'watchlist': watchlist})
        else:
            return jsonify({'status': 'error', 'message': 'Database error, watchlist not found.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'An error occurred during watchlist retrieval.', 'error': str(e)})



@auth.route('/watchlist/add', methods=['POST'])
def add_to_watchlist():
    try:
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
            return jsonify({'status': 'success', 'message': 'Added to watchlist!', 'watchlist': watchlist})
        else:
            return jsonify({'status': 'error', 'message': 'An error occurred.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'An error occurred during watchlist update.', 'error': str(e)})


@auth.route('/watchlist/remove', methods=['POST'])
def remove_from_watchlist():
    try:
        data = request.get_json()
        username = data.get('username').lower()
        media_id = data.get('media_id')

        db = current_app.config['db']
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT watchlist FROM users WHERE username=%s", (username,))
        user = cursor.fetchone()

        if user:
            watchlist = json.loads(user['watchlist'] or '[]')
            watchlist = [item for item in watchlist if item['id'] != media_id]
            cursor.execute("UPDATE users SET watchlist=%s WHERE username=%s", (json.dumps(watchlist), username))
            db.commit()
            return jsonify({'status': 'success', 'message': 'Removed from watchlist!', 'watchlist': watchlist})
        else:
            return jsonify({'status': 'error', 'message': 'An error occurred.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'An error occurred', 'error': str(e)})