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

@app.route('/get_movie_details/<dataType>', methods=['GET'])
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
    response = requests.get(url)

    if response.status_code == 200:
        # Return the movie/TV show details as JSON
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch data from TMDB API'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)