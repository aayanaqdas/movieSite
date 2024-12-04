# MovieWorld

MovieWorld is a web application that allows users to search for movies, TV shows, and people, view detailed information about them, and manage a watchlist.  
The application uses the TMDb API to fetch data.  
The application uses Python Flask as backend to serve data to javascript with endpoints.  
Languages and tools used: Python Flask, JavaScript, MariaDB, SQL, HTML and CSS.

## Features

- Search for movies, TV shows, and people.
- View detailed information about movies, TV shows, and people.
- Manage a watchlist.
- User authentication (login and signup).

## Project Structure

```
movieWorld/
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
│   └── routes.py
├── run.py
├── movieWorld.wsgi 
├── .gitignore 
├── requirements.txt 
├── README.md 
└── setup_db.sql
```


## Setup Instructions

#### 1. Installation

**Clone the repository:**
```sh
git clone https://github.com/aayanaqdas/movieWorld.git
```
**Change directory to movieSite**  
```sh
cd movieWorld
```
#### 2. Create a virtual environment and activate it:
```sh
python -m venv venv
source venv/bin/activate 
#On Windows use 
venv\Scripts\activate
```
#### 3. Install the dependencies:

```sh
pip install -r requirements.txt
```

### Database Setup:

1. **Install MariaDB on your Raspberry Pi:**
   ```sh
   sudo apt update
   sudo apt install mariadb-server
2. **Start MariaDB Service:**
    ```sh
    sudo systemctl start mariadb
    sudo systemctl enable mariadb
3. **Secure MariaDB Installation:**
    ```sh
    sudo mysql_secure_installation
4. **Run the SQL Script**
    ```sh
    sudo mysql -u root -p < setup_db.sql

#### Run the application:
```sh
python run.py
```
Open your browser and navigate to `http://localhost:5000`

## Configuration

The database configuration is stored in `config.py`.  
You can modify the database configuration for your own need.  
The database SQL commands are stored in `setup_db.sql`  
Configuration for WSGI webserver is stored in `movieWorld.wsgi`

## API Endpoints:

`/home/<dataType>`  
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

`/check_session`  
Checks if user still exists

`/watchlist`  
Fetches the user's watchlist.

`/watchlist/add`  
Adds an item to the user's watchlist in the Database.

`/watchlist/remove`  
Removes an item from the user's watchlist in the Database

