from datetime import date
import requests
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

# TMDB API Key (kept in server-side code)
API_KEY = '37d7e055234a0531d45416a1d56745eb'
PAGE = 1
LANGUAGE = 'en-US'
DATE_TODAY = date.today()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/landingPage/<dataType>', methods=['GET'])
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

@app.route('/search.html')
def search():
    return render_template('search.html')

@app.route('/search/movie', methods=['GET'])
def getSearchDataMovie():
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

@app.route('/search/tv', methods=['GET'])
def getSearchDataTv():
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


@app.route('/search/person', methods=['GET'])
def getSearchDataPerson():
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

@app.route('/info.html/<path:mediaType>/<mediaId>')
def renderInfoPage(mediaType, mediaId):
    return render_template('info.html')

@app.route('/info/<path:mediaType>/<mediaId>', methods=['GET'])
def getInfo(mediaType, mediaId):
    # Set the correct endpoint depending on id and mediatype
    if mediaType and mediaId:
        if mediaType == 'tv':
            url = f'https://api.themoviedb.org/3/tv/{mediaId}?api_key={API_KEY}&append_to_response=aggregate_credits,videos,recommendations,watch/providers'
        elif mediaType == 'movie':
            url = f'https://api.themoviedb.org/3/movie/{mediaId}?api_key={API_KEY}&append_to_response=credits,videos,recommendations,watch/providers'
        elif mediaType == 'person':
            url = f'https://api.themoviedb.org/3/person/{mediaId}?api_key={API_KEY}&append_to_response=combined_credits'
        elif mediaType == 'movie-credits':
            url = f'https://api.themoviedb.org/3/movie/{mediaId}/credits?api_key={API_KEY}'
        elif mediaType == 'tv-credits':
            url = f'https://api.themoviedb.org/3/tv/{mediaId}/aggregate_credits?api_key={API_KEY}'
        else:
            return jsonify({'error': 'Invalid media type'}), 400
    
    # Fetch the data from TMDB API
        response = requests.get(url, timeout=15)

        if response.status_code == 200:
            # Return the movie/TV show details as JSON
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to fetch data from TMDB API'}), response.status_code


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")