# auth.py
from flask import Blueprint, request, jsonify, render_template

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username and password:

        return jsonify({'status': 'success', 'message': 'Login successful!'})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid username or password.'})

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')


    if username and password:
        return jsonify({'status': 'success', 'message': 'Signup successful!'})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid username or password.'})
    
