USE my_database;

-- Members
INSERT INTO members (name) VALUES
('Alice'),
('Bob'),
('Charlie'),
('Dana'),
('Eli');

-- Absences
INSERT INTO absence (is_excused, reason) VALUES
(TRUE, 'sick'),
(FALSE, 'missing');

-- Attendance
INSERT INTO attendance (date, memberId, attended, absenceId) VALUES
('2024-11-01', 1, TRUE, NULL),
('2024-11-01', 2, TRUE, NULL),
('2024-11-01', 3, TRUE, NULL),
('2024-11-01', 4, FALSE, 1), -- Dana was absent (excused, sick)
('2024-11-01', 5, TRUE, NULL),

('2024-11-02', 1, TRUE, NULL),
('2024-11-02', 2, TRUE, NULL),
('2024-11-02', 3, TRUE, NULL),
('2024-11-02', 4, TRUE, NULL),
('2024-11-02', 5, FALSE, 2), -- Eli was absent (unexcused, missing)

('2024-11-03', 1, TRUE, NULL),
('2024-11-03', 2, FALSE, 1), -- Bob was absent (excused, sick)
('2024-11-03', 3, TRUE, NULL),
('2024-11-03', 4, TRUE, NULL),
('2024-11-03', 5, TRUE, NULL);

