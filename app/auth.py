# auth.py
import json
from flask import Blueprint, request, jsonify
from app.models import db
from app.models import User

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username').lower()
    password = data.get('password')

    if username and password:
        user = User.query.filter_by(username=username, password=password).first()
        if user:
            return jsonify({'status': 'success', 'message': 'Login successful!', 'username': username})
        else:
            return jsonify({'status': 'error', 'message': 'Invalid username or password.'})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid username or password.'})
    

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username').lower()
    password = data.get('password')


    if username and password:
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Signup successful!', 'username': username})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid username or password.'})
    


@auth.route('/watchlist', methods=['POST'])
def get_watchlist():
    data = request.get_json()
    username = data.get('username').lower()

    user = User.query.filter_by(username=username).first()
    if user:
        watchlist = json.loads(user.watchlist or '[]')
        user.watchlist = json.dumps(watchlist)

        return jsonify({'status': 'success', 'watchlist': watchlist})
    else:
        return jsonify({'status': 'error', 'message': 'User watchlist not found.'})

@auth.route('/watchlist/add', methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    username = data.get('username').lower()
    media_item = data.get('media_item')

    user = User.query.filter_by(username=username).first()
    if user:
        watchlist = json.loads(user.watchlist or '[]')
        watchlist.append(media_item)
        user.watchlist = json.dumps(watchlist)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Item added to watchlist!', 'watchlist': watchlist})
    else:
        return jsonify({'status': 'error', 'message': 'User not found.'})

@auth.route('/watchlist/remove', methods=['POST'])
def remove_from_watchlist():
    data = request.get_json()
    username = data.get('username').lower()
    media_id = data.get('media_id')

    user = User.query.filter_by(username=username).first()
    if user:
        watchlist = json.loads(user.watchlist or '[]')
        watchlist = [item for item in watchlist if item['id'] != media_id]
        user.watchlist = json.dumps(watchlist)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Item removed from watchlist!', 'watchlist': watchlist})
    else:
        return jsonify({'status': 'error', 'message': 'User not found.'})