DROP DATABASE IF EXISTS ChoirDatabase;
CREATE DATABASE ChoirDatabase;
USE ChoirDatabase;

/* Member Table */
CREATE TABLE Member (
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    join_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    address_line_1 VARCHAR(50) NOT NULL,
    address_line_2 VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    postal_code VARCHAR(5) NOT NULL
);




/* AbsenceReason Table */
CREATE TABLE AbsenceReason (
    absence_reason_id INT PRIMARY KEY AUTO_INCREMENT,
    reason_category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    is_excused BOOLEAN DEFAULT FALSE
);

/* CancellationReason Table */
CREATE TABLE CancellationReason (
    cancellation_reason_id INT PRIMARY KEY AUTO_INCREMENT,
    description TEXT NOT NULL
);

/* MembershipHistory Table */
CREATE TABLE MembershipHistory (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    end_date DATE,
    cancellation_reason_id INT NOT NULL,
    specific_reason TEXT,
    exit_feedback TEXT,
    is_eligible_for_return BOOLEAN DEFAULT TRUE,
    notes TEXT,
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (cancellation_reason_id) REFERENCES CancellationReason(cancellation_reason_id)
);

/* Role Table */
CREATE TABLE Role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    role_type VARCHAR(50) NOT NULL,
    salary_amount DECIMAL(10, 2) DEFAULT 0.00,
    role_start_date DATE NOT NULL,
    role_end_date DATE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);

/* PracticeAttendance Table */
CREATE TABLE PracticeAttendance (
    practice_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    practice_date DATE NOT NULL,
    present BOOLEAN NOT NULL,
    absence_reason_id INT,
    specific_reason TEXT,
    record_time TIMESTAMP NOT NULL,
    notified_in_advance BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (absence_reason_id) REFERENCES AbsenceReason(absence_reason_id)
);

/* Payment Table */
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    payment_date DATETIME NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);

/* NotificationLog Table */
CREATE TABLE NotificationLog (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    notification_time TIMESTAMP NOT NULL,
    message TEXT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);

/* VoiceParts Table */
CREATE TABLE VoiceParts (
    voice_part_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    voice_part ENUM('Soprano', 'Alto', 'Tenor', 'Bass'),
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);

/* Budget Table */
CREATE TABLE Budget (
    budget_id INT PRIMARY KEY AUTO_INCREMENT,
    budget_date_set DATE NOT NULL,
    budget_amount DECIMAL(12, 2) NOT NULL
);

/* Insert Absence Reasons */
INSERT INTO AbsenceReason (reason_category, description, is_excused)
VALUES 
    ('Sick', 'Absent due to illness', TRUE),
    ('Personal', 'Absent due to personal reasons', FALSE),
    ('Family Emergency', 'Absent due to a family emergency', TRUE),
    ('Vacation', 'Absent due to planned vacation', FALSE),
    ('Weather', 'Absent due to severe weather conditions', TRUE),
    ('Unknown', 'Absent without any specific reason provided', FALSE);

/* added by milad */
CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,      -- Unique identifier for each user
    username VARCHAR(50) UNIQUE NOT NULL,        -- Unique username for authentication
    password_hash VARCHAR(255) NOT NULL,         -- Hashed password for security
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for account creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp for updates
);

-- Insert an admin member into the Member table
INSERT INTO Member (
    first_name, 
    last_name, 
    email, 
    join_date, 
    is_active, 
    address_line_1, 
    address_line_2, 
    city, 
    state, 
    postal_code
) VALUES (
    'AdminFirst', 
    'AdminLast', 
    'admin@choir.com', 
    '2024-01-01', 
    TRUE, 
    '123 Admin Lane', 
    NULL, 
    'Portland', 
    'ME', 
    '04101'
);

-- Get the member_id of the admin member
SET @admin_member_id = LAST_INSERT_ID();

-- Insert roles for the admin member in the Role table
INSERT INTO Role (
    member_id, 
    role_type, 
    salary_amount, 
    role_start_date
) VALUES 
    (@admin_member_id, 'President', 0.00, '2024-01-01'),
    (@admin_member_id, 'Director', 0.00, '2024-01-01');