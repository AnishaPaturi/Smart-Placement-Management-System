-- Clear existing data if needed (optional, depends on if we drop tables, but schema.sql uses IF NOT EXISTS, so let's just insert ignore or delete first. But for simple h2/mysql it's better to just INSERT IGNORE).
-- The easiest way is to use INSERT IGNORE to prevent duplicate key errors on multiple restarts.

-- Admins
INSERT IGNORE INTO admins (id, name, email, password) VALUES (1, 'Placement Officer', 'admin@placement.com', 'admin123');
INSERT IGNORE INTO admins (id, name, email, password) VALUES (2, 'Anisha Paturi', 'anisha.admin@placement.com', 'admin123');

-- Students
INSERT IGNORE INTO students (id, name, email, password, cgpa, branch, active_backlogs, skills, certifications, resume_url, education, experience, projects, summary)
VALUES (1, 'Anisha Paturi', 'anisha@college.edu', 'student123', 9.2, 'CSE', 0, 'Java, Spring Boot, React, SQL', 'AWS Cloud Practitioner', 'resume_anisha.pdf', 'B.Tech CSE - XYZ University', 'Intern at ABC Tech', 'Smart Placement System', 'Final year student');

INSERT IGNORE INTO students (id, name, email, password, cgpa, branch, active_backlogs, skills, certifications, resume_url, education, experience, projects, summary)
VALUES (2, 'John Doe', 'john@college.edu', 'student123', 8.5, 'IT', 0, 'Python, Django, React', 'Google Data Analytics', 'resume_john.pdf', 'B.Tech IT - ABC College', 'Junior Developer at XYZ', 'E-commerce Platform', 'IT graduate');

INSERT IGNORE INTO students (id, name, email, password, cgpa, branch, active_backlogs, skills, certifications, resume_url, education, experience, projects, summary)
VALUES (3, 'Jane Smith', 'jane@college.edu', 'student123', 7.8, 'ECE', 1, 'C++, Embedded Systems', 'IoT Certification', 'resume_jane.pdf', 'B.Tech ECE - DEF Institute', 'Trainee at IoT Corp', 'Smart Home System', 'ECE student');

INSERT IGNORE INTO students (id, name, email, password, cgpa, branch, active_backlogs, skills, certifications, resume_url, education, experience, projects, summary)
VALUES (4, 'Michael Brown', 'michael@college.edu', 'student123', 6.5, 'MECH', 2, 'AutoCAD, SolidWorks', 'None', 'resume_michael.pdf', 'B.Tech Mechanical - GHI University', 'Apprentice at Auto Corp', 'Robotics Project', 'Mechanical student');

-- Companies
INSERT IGNORE INTO companies (id, name, description, website) 
VALUES (1, 'Goldman Sachs', 'Global investment banking, securities and investment management firm.', 'https://www.goldmansachs.com');

INSERT IGNORE INTO companies (id, name, description, website) 
VALUES (2, 'Google', 'Technology company that focuses on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics.', 'https://www.google.com');

INSERT IGNORE INTO companies (id, name, description, website) 
VALUES (3, 'Microsoft', 'American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.', 'https://www.microsoft.com');

INSERT IGNORE INTO companies (id, name, description, website) 
VALUES (4, 'Amazon', 'American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.', 'https://www.amazon.com');

-- Drives
INSERT IGNORE INTO drives (id, company_id, role, package_lpa, min_cgpa, allowed_branches, drive_date) 
VALUES (1, 1, 'Software Engineer', 24.00, 8.5, 'CSE,IT', '2026-08-15');

INSERT IGNORE INTO drives (id, company_id, role, package_lpa, min_cgpa, allowed_branches, drive_date) 
VALUES (2, 2, 'SDE-1', 32.00, 8.0, 'CSE,IT,ECE', '2026-09-01');

INSERT IGNORE INTO drives (id, company_id, role, package_lpa, min_cgpa, allowed_branches, drive_date) 
VALUES (3, 3, 'Data Scientist', 20.00, 7.5, 'CSE,IT,ECE', '2026-09-10');

INSERT IGNORE INTO drives (id, company_id, role, package_lpa, min_cgpa, allowed_branches, drive_date) 
VALUES (4, 4, 'Cloud Support Associate', 12.00, 7.0, 'CSE,IT,ECE,MECH', '2026-09-20');

-- Applications
INSERT IGNORE INTO applications (id, student_id, drive_id, status, applied_on) 
VALUES (1, 1, 1, 'INTERVIEW', '2026-08-01 10:00:00');

INSERT IGNORE INTO applications (id, student_id, drive_id, status, applied_on) 
VALUES (2, 1, 2, 'TEST', '2026-08-05 14:30:00');

INSERT IGNORE INTO applications (id, student_id, drive_id, status, applied_on) 
VALUES (3, 2, 4, 'APPLIED', '2026-08-10 09:15:00');

INSERT IGNORE INTO applications (id, student_id, drive_id, status, applied_on) 
VALUES (4, 3, 3, 'SHORTLISTED', '2026-08-12 11:45:00');
