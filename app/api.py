from datetime import date
import requests
from flask import Blueprint, jsonify, request, render_template
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

api = Blueprint('api', __name__)

# TMDB API Key
API_KEY = os.getenv('API_KEY') #replace with your own TMDB API key
PAGE = 1
LANGUAGE = 'en-US'
DATE_TODAY = date.today()

@api.route('/home/<dataType>', methods=['GET'])
def get_movie_details(dataType):
    # Set the correct endpoint depending on media type (movie or TV show)
    if dataType == 'trendingData':
        url = f'https://api.themoviedb.org/3/trending/all/day?language={LANGUAGE}&api_key={API_KEY}&page={PAGE}'
    elif dataType == 'popularMoviesData':
        url = f'https://api.themoviedb.org/3/movie/popular?language={LANGUAGE}&api_key={API_KEY}&page={PAGE}'
    elif dataType == 'topRatedTvData':
        url = f'https://api.themoviedb.org/3/tv/top_rated?language={LANGUAGE}&api_key={API_KEY}&page={PAGE}'
    elif dataType == 'upcomingMoviesData':
        url = f'https://api.themoviedb.org/3/discover/movie?language={LANGUAGE}&api_key={API_KEY}&page={PAGE}&primary_release_date.gte={DATE_TODAY}&sort_by=popularity.desc'
    else:
        return jsonify({'error': 'Invalid media type'}), 400

    # Fetch the data from TMDB API
    response = requests.get(url, timeout=15)

    if response.status_code == 200:
        # Return the movie/TV show details as JSON
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch data from TMDB API'}), response.status_code

@api.route('/search/movie', methods=['GET'])
def get_search_data_movie():
    query = request.args.get('query')
    page = request.args.get('page')
    if query:
        movie_url = f'https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&query={query}&page={page}'
    else:
        return jsonify({'error': 'Invalid query parameter'}), 400

    # Fetch the data from TMDB API
    response = requests.get(movie_url, timeout=15)

    if response.status_code == 200:
        # Return the movie/TV show details as JSON
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch data from TMDB API'}), response.status_code

@api.route('/search/tv', methods=['GET'])
def get_search_data_tv():
    query = request.args.get('query')
    page = request.args.get('page')
    if query:
        tv_url = f'https://api.themoviedb.org/3/search/tv?api_key={API_KEY}&query={query}&page={page}'
    else:
        return jsonify({'error': 'Invalid query parameter'}), 400

    # Fetch the data from TMDB API
    response = requests.get(tv_url, timeout=15)

    if response.status_code == 200:
        # Return the movie/TV show details as JSON
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch data from TMDB API'}), response.status_code

@api.route('/search/person', methods=['GET'])
def get_search_data_person():
    query = request.args.get('query')
    page = request.args.get('page')
    if query:
        person_url = f'https://api.themoviedb.org/3/search/person?api_key={API_KEY}&query={query}&page={page}'
    else:
        return jsonify({'error': 'Invalid query parameter'}), 400

    # Fetch the data from TMDB API
    response = requests.get(person_url, timeout=15)

    if response.status_code == 200:
        # Return the movie/TV show details as JSON
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch data from TMDB API'}), response.status_code

@api.route('/info/<path:media_type>/<media_id>', methods=['GET'])
def get_info(media_type, media_id):
    # Set the correct endpoint depending on id and mediatype
    if media_type and media_id:
        if media_type == 'tv':
            url = f'https://api.themoviedb.org/3/tv/{media_id}?api_key={API_KEY}&append_to_response=aggregate_credits,videos,recommendations,watch/providers'
        elif media_type == 'movie':
            url = f'https://api.themoviedb.org/3/movie/{media_id}?api_key={API_KEY}&append_to_response=credits,videos,recommendations,watch/providers'
        elif media_type == 'person':
            url = f'https://api.themoviedb.org/3/person/{media_id}?api_key={API_KEY}&append_to_response=combined_credits'
        elif media_type == 'movie-credits':
            url = f'https://api.themoviedb.org/3/movie/{media_id}/credits?api_key={API_KEY}'
        elif media_type == 'tv-credits':
            url = f'https://api.themoviedb.org/3/tv/{media_id}/aggregate_credits?api_key={API_KEY}'
        else:
            return jsonify({'error': 'Invalid media type'}), 400
    
    # Fetch the data from TMDB API
        response = requests.get(url, timeout=15)

        if response.status_code == 200:
            # Return the movie/TV show details as JSON
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to fetch data from TMDB API'}), response.status_code