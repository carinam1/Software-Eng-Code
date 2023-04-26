CREATE DATABASE IF NOT EXISTS APIsDatabase;

USE APIsDatabase;

CREATE TABLE IF NOT EXISTS user_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    user_name VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    birth_date DATE,
    gender ENUM('Male', 'Female', 'Other'),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    energy_level_id INT
    CREATE INDEX idx_email ON user_metrics(email);
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
    ALTER TABLE social_media
    ADD FOREIGN KEY (user_id) REFERENCES user_metrics(id);
);

CREATE TABLE IF NOT EXISTS user_macro_nutrition (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    timestamp TIMESTAMP,
    calories INT,
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fat DECIMAL(5,2)
    ALTER TABLE user_macro_nutrition
    ADD FOREIGN KEY (user_id) REFERENCES user_metrics(id);
);

CREATE TABLE IF NOT EXISTS user_workout_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    workout_name VARCHAR(100),
    description TEXT,
    frequency INT
    ALTER TABLE user_workout_plans
    ADD FOREIGN KEY (user_id) REFERENCES user_metrics(id);
);
