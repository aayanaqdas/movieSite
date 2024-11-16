from flask import Blueprint, render_template

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/search.html')
def search():
    return render_template('search.html')

@main.route('/info.html/<path:mediaType>/<mediaId>')
def render_info_page(mediaType, mediaId):
    return render_template('info.html')

@main.route('/login')
def login_page():
    return render_template('login.html')

@main.route('/signup')
def signup_page():
    return render_template('signup.html')

