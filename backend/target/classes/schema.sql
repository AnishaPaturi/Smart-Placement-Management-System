CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    cgpa DECIMAL(3,2) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    active_backlogs INT DEFAULT 0,
    skills TEXT, -- comma separated skills
    certifications TEXT, -- comma separated certifications
    resume_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    website VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS drives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    role VARCHAR(100) NOT NULL,
    package_lpa DECIMAL(5,2) NOT NULL,
    min_cgpa DECIMAL(3,2) NOT NULL,
    allowed_branches VARCHAR(255) NOT NULL, -- comma separated like 'CSE,IT'
    drive_date DATE,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    drive_id INT NOT NULL,
    status VARCHAR(50) NOT NULL, -- e.g., APPLIED, SHORTLISTED, TEST, INTERVIEW, SELECTED, REJECTED
    applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (drive_id) REFERENCES drives(id)
);

CREATE TABLE IF NOT EXISTS rounds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drive_id INT NOT NULL,
    round_name VARCHAR(100) NOT NULL, -- e.g., Online Test, Technical Interview
    round_date DATE,
    FOREIGN KEY (drive_id) REFERENCES drives(id)
);

-- Insert a default admin if none exists
INSERT IGNORE INTO admins (id, name, email, password) VALUES (1, 'System Admin', 'admin@placement.com', 'admin123');
