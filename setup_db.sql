-- setup_db.sql

-- Create database
CREATE DATABASE IF NOT EXISTS moviesite;

-- Use the new database
USE moviesite;

-- Create user
CREATE USER IF NOT EXISTS 'flaskuser'@'%' IDENTIFIED BY 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON moviesite.* TO 'flaskuser'@'%';
FLUSH PRIVILEGES;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    watchlist TEXT
);