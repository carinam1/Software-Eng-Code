CREATE DATABASE IF NOT EXISTS APIsDatabase;

USE APIsDatabase;

CREATE TABLE IF NOT EXISTS user_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    user_name VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    birth_date DATE,
    gender ENUM('Male', 'Female', 'Other'),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    energy_level_id INT
);

CREATE TABLE IF NOT EXISTS social_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_name VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    platform_name VARCHAR(50),
    verified BOOLEAN,
    follower_count INT,
    following_count INT
);

CREATE TABLE IF NOT EXISTS user_macro_nutrition (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE,
    calories INT,
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fat DECIMAL(5,2)
);

CREATE TABLE IF NOT EXISTS user_workout_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    workout_name VARCHAR(100),
    description TEXT,
    frequency INT
);
