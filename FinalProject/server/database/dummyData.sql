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