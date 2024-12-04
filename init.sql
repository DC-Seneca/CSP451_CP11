CREATE DATABASE IF NOT EXISTS sampledb;
USE sampledb;

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL
);

INSERT INTO announcements (message) VALUES
    ('Welcome to the sample web application!'),
    ('This is your first announcement!'),
    ('Enjoy working on this project!');
