-- setup_db.sql

-- Create the database if it does not already exist
CREATE DATABASE IF NOT EXISTS movieWorld;

-- Select the newly created database for use
USE movieWorld;

-- Create a new user for the database with the specified username and password
CREATE USER IF NOT EXISTS 'flaskuser'@'%' IDENTIFIED BY 'password'; --% means any host can connect to the database

-- Grant all privileges on the movieWorld database to the newly created user
GRANT ALL PRIVILEGES ON movieWorld.* TO 'flaskuser'@'%';
-- Apply the changes made to the privileges
FLUSH PRIVILEGES;

-- Create the users table if it does not already exist
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each user, auto-incremented
    username VARCHAR(80) NOT NULL UNIQUE,  -- Username for the user, must be unique and not null
    password VARCHAR(120) NOT NULL,  -- Password for the user, stored as a hashed string
    watchlist TEXT  -- Watchlist for the user, stored as a JSON string
);