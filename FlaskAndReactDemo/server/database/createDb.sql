-- Drop the database if it exists, then create a new one
DROP DATABASE IF EXISTS my_database;
CREATE DATABASE my_database;
USE my_database;

CREATE TABLE members (
    memberId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE absence (
    absenceId INT PRIMARY KEY AUTO_INCREMENT,
    is_excused BOOLEAN NOT NULL,
    reason ENUM('sick', 'missing') NOT NULL
);

CREATE TABLE attendance (
    attendanceId INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    memberId INT,
    attended BOOLEAN NOT NULL,
    absenceId INT,
    FOREIGN KEY (memberId) REFERENCES members(memberId),
    FOREIGN KEY (absenceId) REFERENCES absence(absenceId)
);

