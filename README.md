# MovieWorld

MovieWorld is a web application that allows users to search for movies, TV shows, and people, view detailed information about them, and manage a watchlist.  
The application uses the TMDb API to fetch data.  
The application uses Python Flask as backend to serve data to javascript with endpoints.

## Features

- Search for movies, TV shows, and people.
- View detailed information about movies, TV shows, and people.
- Manage a watchlist.
- User authentication (login and signup).

## Project Structure

```
movieSite/
├── static/
│   ├── css/
│   │   ├── infoPage.css
│   │   ├── loginPage.css
│   │   ├── search.css
│   │   └── style.css
│   ├── images/
│   └── js/
│       ├── auth.js
│       ├── eventHandlers.js
│       ├── genres.js
│       ├── main.js
│       ├── movieInfo.js
│       ├── pageCreators.js
│       ├── search.js
│       └── watchlist.js
├── templates/
│   ├── index.html
│   ├── info.html
│   ├── login.html
│   ├── search.html
│   └── signup.html
├── app/
│   ├── __init__.py
│   ├── api.py
│   ├── auth.py
│   ├── config.py
│   ├── models.py
│   └── routes.py
├── run.py
├── requirements.txt
└── README.md
```

#### 1. Installation

**Clone the repository:**  
`git clone https://github.com/aayanaqdas/movieSite.git`

**Change directory to movieSite**  
`cd movieSite`

#### 2. Create a virtual environment and activate it:

`python -m venv venv`  
`source venv/bin/activate`  
On Windows use `venv\Scripts\activate`

#### 3. Install the dependencies:

`pip install -r requirements.txt`

#### 4. Run the application:

`python run.py`  
Open your browser and navigate to `http://localhost:5000`

## Configuration

The application configuration is stored in `config.py`.  
You can modify the database URI and other settings if you need to.

## API Endpoints:

`/landingPage/<dataType>`  
Fetches data for the landing page based on the data type (trending, popular movies, top-rated TV shows, upcoming movies).

`/search/movie`  
Searches for movies based on a query.

`/search/tv`  
Searches for TV shows based on a query.

`/search/person`  
Searches for people based on a query.

`/info/<path:media_type>/<media_id>`  
Fetches detailed information about a movie, TV show, or person.

`/login`  
Handles user login.

`/signup`  
Handles user signup.

`/watchlist`  
Fetches the user's watchlist.

`/watchlist/add`  
Adds an item to the user's watchlist in the Database.

`/watchlist/remove`  
Removes an item from the user's watchlist in the Database.

