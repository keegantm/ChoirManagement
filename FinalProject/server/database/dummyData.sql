USE ChoirDatabase;

INSERT INTO Member (first_name, last_name, email, join_date, is_active, address_line_1, address_line_2, city, state, postal_code)
VALUES
    ('John', 'Doe', 'john.doe@example.com', '2023-01-15', TRUE, '123 Elm St', NULL, 'Portland', 'ME', '04101'),
    ('Jane', 'Smith', 'jane.smith@example.com', '2022-07-22', TRUE, '456 Oak St', 'Apt 2B', 'Bangor', 'ME', '04401'),
    ('Alice', 'Johnson', 'alice.johnson@example.com', '2021-10-30', FALSE, '789 Pine Ave', NULL, 'Augusta', 'ME', '04330'),
    ('Bob', 'Brown', 'bob.brown@example.com', '2020-03-12', TRUE, '321 Maple Rd', NULL, 'Lewiston', 'ME', '04240'),
    ('Emily', 'Davis', 'emily.davis@example.com', '2023-05-17', TRUE, '654 Birch Ln', 'Suite 5', 'Bar Harbor', 'ME', '04609'),
    ('Michael', 'Wilson', 'michael.wilson@example.com', '2019-09-05', FALSE, '101 Cedar St', NULL, 'Rockland', 'ME', '04841'),
    ('Sophia', 'Garcia', 'sophia.garcia@example.com', '2021-02-14', TRUE, '213 Spruce Blvd', NULL, 'South Portland', 'ME', '04106'),
    ('Daniel', 'Martinez', 'daniel.martinez@example.com', '2022-11-09', TRUE, '909 Willow Way', 'Unit 10', 'Brunswick', 'ME', '04011'),
    ('Olivia', 'Lee', 'olivia.lee@example.com', '2020-08-27', TRUE, '789 Fir St', NULL, 'York', 'ME', '03909'),
    ('James', 'Miller', 'james.miller@example.com', '2023-04-10', FALSE, '147 Palm Dr', 'Bldg 3', 'Waterville', 'ME', '04901');


/* Sample Role Data */
INSERT INTO Role (member_id, role_type, salary_amount, role_start_date, role_end_date)
VALUES
    (1, 'President', 5000.00, '2023-01-20', NULL),
    (1, 'TenorSectionLeader', 2000.00, '2023-01-20', NULL),
    (2, 'Treasurer', 4000.00, '2022-08-01', NULL),
    (4, 'BassSectionLeader', 3000.00, '2020-04-01', '2023-04-01'),
    (5, 'SopranoSectionLeader', 2500.00, '2023-06-01', NULL),
    (7, 'Accompanist', 3500.00, '2021-03-01', NULL),
    (8, 'BoardMember', 1500.00, '2022-12-01', NULL),
    (9, 'Director', 6000.00, '2021-01-01', NULL),
    (9, 'BoardMember', 1500.00, '2020-09-01', '2021-09-01'),
    (10, 'AltoSectionLeader', 2500.00, '2023-04-15', NULL);    

INSERT INTO VoiceParts (member_id, voice_part)
VALUES
    (1, 'Tenor'),
    (2, 'Alto'),
    (4, 'Bass'),
    (5, 'Soprano'),
    (7, 'Alto'),
    (8, 'Tenor'),
    (9, 'Bass'),
    (10, 'Soprano');


-- Practice 1: Most recent practice (2024-11-12)
INSERT INTO PracticeAttendance (member_id, practice_date, present, absence_reason_id, specific_reason, record_time, notified_in_advance, notes)
VALUES
    (1, '2024-11-12', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (2, '2024-11-12', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (4, '2024-11-12', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (5, '2024-11-12', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (7, '2024-11-12', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (8, '2024-11-12', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (9, '2024-11-12', TRUE, NULL, NULL, NOW(), FALSE, 'Present');

-- Practice 2 (2024-11-10)
INSERT INTO PracticeAttendance (member_id, practice_date, present, absence_reason_id, specific_reason, record_time, notified_in_advance, notes)
VALUES
    (1, '2024-11-10', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (2, '2024-11-10', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (4, '2024-11-10', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (5, '2024-11-10', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (7, '2024-11-10', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (8, '2024-11-10', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (9, '2024-11-10', TRUE, NULL, NULL, NOW(), FALSE, 'Present');

-- Practice 3 (2024-11-08)
INSERT INTO PracticeAttendance (member_id, practice_date, present, absence_reason_id, specific_reason, record_time, notified_in_advance, notes)
VALUES
    (1, '2024-11-08', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (2, '2024-11-08', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (4, '2024-11-08', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (5, '2024-11-08', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (7, '2024-11-08', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (8, '2024-11-08', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (9, '2024-11-08', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice');

-- Practice 4 (2024-11-05)
INSERT INTO PracticeAttendance (member_id, practice_date, present, absence_reason_id, specific_reason, record_time, notified_in_advance, notes)
VALUES
    (1, '2024-11-05', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (2, '2024-11-05', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (4, '2024-11-05', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (5, '2024-11-05', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (7, '2024-11-05', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (8, '2024-11-05', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (9, '2024-11-05', TRUE, NULL, NULL, NOW(), FALSE, 'Present');

-- Practice 5 (2024-11-02)
INSERT INTO PracticeAttendance (member_id, practice_date, present, absence_reason_id, specific_reason, record_time, notified_in_advance, notes)
VALUES
    (1, '2024-11-02', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (2, '2024-11-02', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (4, '2024-11-02', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (5, '2024-11-02', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (7, '2024-11-02', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice'),
    (8, '2024-11-02', TRUE, NULL, NULL, NOW(), FALSE, 'Present'),
    (9, '2024-11-02', FALSE, NULL, 'No reason provided', NOW(), FALSE, 'Missed practice');

INSERT INTO Member (first_name, last_name, email, join_date, is_active, address_line_1, city, state, postal_code)
VALUES
    ('Tom', 'Holland', 'tom.holland@example.com', '2023-06-10', TRUE, '111 Main St', 'Portland', 'ME', '04101'),
    ('Mary', 'Johnson', 'mary.johnson@example.com', '2023-08-15', TRUE, '222 Maple Dr', 'Bangor', 'ME', '04401');

INSERT INTO PracticeAttendance (member_id, practice_date, present, record_time)
VALUES
    (11, '2024-11-02', FALSE, NOW()),   -- Tom Holland missed the first practice
    (11, '2024-11-05', FALSE, NOW()),   -- Tom missed the second practice
    (11, '2024-11-08', FALSE, NOW()),   -- Tom missed the third practice
    (11, '2024-11-10', FALSE, NOW()),   -- Tom missed the fourth practice
    (11, '2024-11-12', FALSE, NOW()),   -- Tom missed the fifth practice

    (12, '2024-11-02', FALSE, NOW()),   -- Mary Johnson missed the first practice
    (12, '2024-11-05', FALSE, NOW()),   -- Mary missed the second practice
    (12, '2024-11-08', FALSE, NOW()),   -- Mary missed the third practice
    (12, '2024-11-10', FALSE, NOW()),   -- Mary missed the fourth practice
    (12, '2024-11-12', FALSE, NOW());   -- Mary missed the fifth practice

INSERT INTO Budget (budget_date_set, budget_amount)
VALUES
    ('2024-01-15', 1500.00),
    ('2024-04-10', 2000.00),
    ('2024-07-20', 1750.00),
    ('2024-10-05', 2100.00),
    ('2024-11-01', 2500.00);

-- Insert dummy data into Payment table

-- Payments before 2024-11-01 (total of 1000)
INSERT INTO Payment (member_id, payment_date, payment_amount, payment_method)
VALUES
    (1, '2024-10-15 14:00:00', 150.00, 'Credit Card'),
    (2, '2024-10-20 09:30:00', 120.00, 'Cash'),
    (3, '2024-10-22 16:45:00', 200.00, 'Bank Transfer'),
    (4, '2024-10-25 11:00:00', 80.00, 'Credit Card'),
    (5, '2024-10-30 18:15:00', 100.00, 'Cash'),
    (6, '2024-10-28 20:00:00', 180.00, 'Debit Card'),
    (7, '2024-10-17 13:00:00', 170.00, 'Bank Transfer'),
    (8, '2024-10-12 08:30:00', 50.00, 'Cash'),
    (9, '2024-10-14 15:30:00', 50.00, 'Credit Card'),
    (10, '2024-10-29 10:00:00', 40.00, 'Debit Card');

-- Payments after 2024-11-01 (total of 1800)
INSERT INTO Payment (member_id, payment_date, payment_amount, payment_method)
VALUES
    (1, '2024-11-05 14:00:00', 300.00, 'Credit Card'),
    (2, '2024-11-06 09:30:00', 200.00, 'Cash'),
    (3, '2024-11-07 16:45:00', 150.00, 'Bank Transfer'),
    (4, '2024-11-08 11:00:00', 100.00, 'Credit Card'),
    (5, '2024-11-09 18:15:00', 250.00, 'Cash'),
    (6, '2024-11-10 20:00:00', 80.00, 'Debit Card'),
    (7, '2024-11-11 13:00:00', 100.00, 'Bank Transfer'),
    (8, '2024-11-12 08:30:00', 70.00, 'Cash'),
    (9, '2024-11-13 15:30:00', 120.00, 'Credit Card'),
    (10, '2024-11-14 10:00:00', 100.00, 'Debit Card');
