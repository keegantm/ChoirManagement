USE my_database;

-- Members
INSERT INTO members (memberId, name) VALUES
(1, 'Alice'),
(2, 'Bob'),
(3, 'Charlie'),
(4, 'Dana'),
(5, 'Eli');

-- Absences
INSERT INTO absence (absenceId, is_excused, reason) VALUES
(1, TRUE, 'sick'),
(2, FALSE, 'missing');

-- Attendance
INSERT INTO attendance (attendanceId, date, memberId, attended, absenceId) VALUES
(1, '2024-11-01', 1, TRUE, NULL),
(2, '2024-11-01', 2, TRUE, NULL),
(3, '2024-11-01', 3, TRUE, NULL),
(4, '2024-11-01', 4, FALSE, 1), -- Dana was absent (excused, sick)
(5, '2024-11-01', 5, TRUE, NULL),

(6, '2024-11-02', 1, TRUE, NULL),
(7, '2024-11-02', 2, TRUE, NULL),
(8, '2024-11-02', 3, TRUE, NULL),
(9, '2024-11-02', 4, TRUE, NULL),
(10, '2024-11-02', 5, FALSE, 2), -- Eli was absent (unexcused, missing)

(11, '2024-11-03', 1, TRUE, NULL),
(12, '2024-11-03', 2, FALSE, 1), -- Bob was absent (excused, sick)
(13, '2024-11-03', 3, TRUE, NULL),
(14, '2024-11-03', 4, TRUE, NULL),
(15, '2024-11-03', 5, TRUE, NULL);
