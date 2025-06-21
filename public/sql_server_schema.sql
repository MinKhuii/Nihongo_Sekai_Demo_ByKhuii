-- Nihongo Sekai Database Schema for SQL Server
-- Migration from MySQL to SQL Server

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'nihongo_sekai')
CREATE DATABASE nihongo_sekai;
GO

USE nihongo_sekai;
GO

-- Drop existing tables if they exist (for clean migration)
IF OBJECT_ID('classroom_enrollments', 'U') IS NOT NULL DROP TABLE classroom_enrollments;
IF OBJECT_ID('course_purchases', 'U') IS NOT NULL DROP TABLE course_purchases;
IF OBJECT_ID('course_reviews', 'U') IS NOT NULL DROP TABLE course_reviews;
IF OBJECT_ID('classroom_reviews', 'U') IS NOT NULL DROP TABLE classroom_reviews;
IF OBJECT_ID('video_call_sessions', 'U') IS NOT NULL DROP TABLE video_call_sessions;
IF OBJECT_ID('activity_logs', 'U') IS NOT NULL DROP TABLE activity_logs;
IF OBJECT_ID('course_lessons', 'U') IS NOT NULL DROP TABLE course_lessons;
IF OBJECT_ID('user_progress', 'U') IS NOT NULL DROP TABLE user_progress;
IF OBJECT_ID('classrooms', 'U') IS NOT NULL DROP TABLE classrooms;
IF OBJECT_ID('courses', 'U') IS NOT NULL DROP TABLE courses;
IF OBJECT_ID('teachers', 'U') IS NOT NULL DROP TABLE teachers;
IF OBJECT_ID('categories', 'U') IS NOT NULL DROP TABLE categories;
IF OBJECT_ID('accounts', 'U') IS NOT NULL DROP TABLE accounts;
GO

-- ==================================================
-- ACCOUNTS TABLE (Users with roles)
-- ==================================================
CREATE TABLE accounts (
    account_id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'Learner' CHECK (role IN ('Learner', 'Teacher', 'Admin')),
    status NVARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Suspended', 'Rejected')),
    avatar_url NVARCHAR(500) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    last_login DATETIME2 NULL,
    email_verified BIT DEFAULT 0,
    reset_token NVARCHAR(6) NULL,
    reset_token_expires DATETIME2 NULL
);

CREATE INDEX IX_accounts_email ON accounts(email);
CREATE INDEX IX_accounts_role ON accounts(role);
CREATE INDEX IX_accounts_status ON accounts(status);
GO

-- ==================================================
-- TEACHERS TABLE (Extended info for teacher accounts)
-- ==================================================
CREATE TABLE teachers (
    teacher_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    bio NTEXT,
    qualifications NVARCHAR(MAX), -- JSON data as string
    years_experience INT DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    specializations NVARCHAR(MAX), -- JSON data as string
    id_document_url NVARCHAR(500),
    approved_at DATETIME2 NULL,
    approved_by INT NULL,
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES accounts(account_id)
);

CREATE INDEX IX_teachers_account_id ON teachers(account_id);
GO

-- ==================================================
-- CATEGORIES TABLE
-- ==================================================
CREATE TABLE categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NTEXT,
    color_code NVARCHAR(7) DEFAULT '#dc2626',
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- ==================================================
-- COURSES TABLE
-- ==================================================
CREATE TABLE courses (
    course_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    description NTEXT,
    category_id INT,
    teacher_id INT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cover_image_url NVARCHAR(500),
    level NVARCHAR(20) DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Elementary', 'Intermediate', 'Advanced')),
    duration_hours INT DEFAULT 0,
    status NVARCHAR(20) DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Archived')),
    rating DECIMAL(3,2) DEFAULT 0.00,
    students_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL
);

CREATE INDEX IX_courses_category ON courses(category_id);
CREATE INDEX IX_courses_teacher ON courses(teacher_id);
CREATE INDEX IX_courses_status ON courses(status);
GO

-- ==================================================
-- COURSE LESSONS TABLE
-- ==================================================
CREATE TABLE course_lessons (
    lesson_id INT IDENTITY(1,1) PRIMARY KEY,
    course_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NTEXT,
    video_url NVARCHAR(500),
    materials_url NVARCHAR(500),
    duration_minutes INT DEFAULT 0,
    lesson_order INT NOT NULL,
    status NVARCHAR(20) DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Archived')),
    created_at DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE INDEX IX_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX IX_course_lessons_order ON course_lessons(course_id, lesson_order);
GO

-- ==================================================
-- USER PROGRESS TABLE
-- ==================================================
CREATE TABLE user_progress (
    progress_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    course_id INT NOT NULL,
    lesson_id INT,
    completed BIT DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_accessed DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(lesson_id) ON DELETE CASCADE,
    
    UNIQUE(account_id, lesson_id)
);

CREATE INDEX IX_user_progress_account ON user_progress(account_id);
CREATE INDEX IX_user_progress_course ON user_progress(course_id);
GO

-- ==================================================
-- CLASSROOMS TABLE (Live classes)
-- ==================================================
CREATE TABLE classrooms (
    classroom_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    description NTEXT,
    teacher_id INT,
    max_students INT DEFAULT 10,
    current_students INT DEFAULT 0,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    level NVARCHAR(20) DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Elementary', 'Intermediate', 'Advanced')),
    schedule NVARCHAR(MAX), -- JSON data for recurring schedule
    video_call_url NVARCHAR(500),
    room_id NVARCHAR(100), -- For video call API
    status NVARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Full')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL
);

CREATE INDEX IX_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX IX_classrooms_status ON classrooms(status);
GO

-- ==================================================
-- COURSE PURCHASES TABLE
-- ==================================================
CREATE TABLE course_purchases (
    purchase_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    course_id INT NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    payment_method NVARCHAR(50),
    transaction_id NVARCHAR(100),
    purchased_at DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    
    UNIQUE(account_id, course_id)
);

CREATE INDEX IX_course_purchases_account ON course_purchases(account_id);
CREATE INDEX IX_course_purchases_course ON course_purchases(course_id);
GO

-- ==================================================
-- CLASSROOM ENROLLMENTS TABLE
-- ==================================================
CREATE TABLE classroom_enrollments (
    enrollment_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    classroom_id INT NOT NULL,
    enrollment_price DECIMAL(10,2) NOT NULL,
    payment_method NVARCHAR(50),
    transaction_id NVARCHAR(100),
    enrolled_at DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    
    UNIQUE(account_id, classroom_id)
);

CREATE INDEX IX_classroom_enrollments_account ON classroom_enrollments(account_id);
CREATE INDEX IX_classroom_enrollments_classroom ON classroom_enrollments(classroom_id);
GO

-- ==================================================
-- COURSE REVIEWS TABLE
-- ==================================================
CREATE TABLE course_reviews (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    course_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text NTEXT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    
    UNIQUE(account_id, course_id)
);

CREATE INDEX IX_course_reviews_course ON course_reviews(course_id);
CREATE INDEX IX_course_reviews_rating ON course_reviews(rating);
GO

-- ==================================================
-- CLASSROOM REVIEWS TABLE
-- ==================================================
CREATE TABLE classroom_reviews (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    classroom_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text NTEXT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    
    UNIQUE(account_id, classroom_id)
);

CREATE INDEX IX_classroom_reviews_classroom ON classroom_reviews(classroom_id);
CREATE INDEX IX_classroom_reviews_rating ON classroom_reviews(rating);
GO

-- ==================================================
-- VIDEO CALL SESSIONS TABLE
-- ==================================================
CREATE TABLE video_call_sessions (
    session_id INT IDENTITY(1,1) PRIMARY KEY,
    classroom_id INT NOT NULL,
    room_id NVARCHAR(100) NOT NULL,
    host_account_id INT NOT NULL,
    session_name NVARCHAR(255),
    start_time DATETIME2 DEFAULT GETDATE(),
    end_time DATETIME2 NULL,
    max_participants INT DEFAULT 20,
    current_participants INT DEFAULT 0,
    recording_url NVARCHAR(500) NULL,
    session_data NVARCHAR(MAX), -- JSON for additional session metadata
    
    FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    FOREIGN KEY (host_account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

CREATE INDEX IX_video_call_sessions_classroom ON video_call_sessions(classroom_id);
CREATE INDEX IX_video_call_sessions_room ON video_call_sessions(room_id);
CREATE INDEX IX_video_call_sessions_host ON video_call_sessions(host_account_id);
GO

-- ==================================================
-- ACTIVITY LOGS TABLE
-- ==================================================
CREATE TABLE activity_logs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    activity_type NVARCHAR(50) NOT NULL,
    entity_type NVARCHAR(50), -- 'course', 'classroom', 'account', etc.
    entity_id INT,
    description NVARCHAR(500),
    metadata NVARCHAR(MAX), -- JSON data
    created_at DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

CREATE INDEX IX_activity_logs_account ON activity_logs(account_id);
CREATE INDEX IX_activity_logs_type ON activity_logs(activity_type);
CREATE INDEX IX_activity_logs_created ON activity_logs(created_at);
GO

-- ==================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ==================================================

-- Update accounts.updated_at when modified
CREATE TRIGGER tr_accounts_updated
ON accounts
AFTER UPDATE
AS
BEGIN
    UPDATE accounts 
    SET updated_at = GETDATE()
    WHERE account_id IN (SELECT account_id FROM inserted);
END;
GO

-- Update courses.updated_at when modified
CREATE TRIGGER tr_courses_updated
ON courses
AFTER UPDATE
AS
BEGIN
    UPDATE courses 
    SET updated_at = GETDATE()
    WHERE course_id IN (SELECT course_id FROM inserted);
END;
GO

-- Update classrooms.updated_at when modified
CREATE TRIGGER tr_classrooms_updated
ON classrooms
AFTER UPDATE
AS
BEGIN
    UPDATE classrooms 
    SET updated_at = GETDATE()
    WHERE classroom_id IN (SELECT classroom_id FROM inserted);
END;
GO

-- ==================================================
-- VIEWS FOR ANALYTICS AND REPORTING
-- ==================================================

-- View for course analytics
CREATE VIEW vw_course_analytics AS
SELECT 
    c.course_id,
    c.title,
    c.price,
    c.rating,
    c.students_count,
    COUNT(cp.purchase_id) as actual_purchases,
    AVG(CAST(cr.rating AS FLOAT)) as avg_rating,
    COUNT(cr.review_id) as review_count,
    t.full_name as teacher_name
FROM courses c
LEFT JOIN course_purchases cp ON c.course_id = cp.course_id
LEFT JOIN course_reviews cr ON c.course_id = cr.course_id
LEFT JOIN teachers te ON c.teacher_id = te.teacher_id
LEFT JOIN accounts t ON te.account_id = t.account_id
GROUP BY c.course_id, c.title, c.price, c.rating, c.students_count, t.full_name;
GO

-- View for classroom analytics
CREATE VIEW vw_classroom_analytics AS
SELECT 
    cl.classroom_id,
    cl.title,
    cl.price,
    cl.max_students,
    cl.current_students,
    COUNT(ce.enrollment_id) as actual_enrollments,
    AVG(CAST(cr.rating AS FLOAT)) as avg_rating,
    COUNT(cr.review_id) as review_count,
    t.full_name as teacher_name
FROM classrooms cl
LEFT JOIN classroom_enrollments ce ON cl.classroom_id = ce.classroom_id
LEFT JOIN classroom_reviews cr ON cl.classroom_id = cr.classroom_id
LEFT JOIN teachers te ON cl.teacher_id = te.teacher_id
LEFT JOIN accounts t ON te.account_id = t.account_id
GROUP BY cl.classroom_id, cl.title, cl.price, cl.max_students, cl.current_students, t.full_name;
GO

-- View for user progress summary
CREATE VIEW vw_user_progress_summary AS
SELECT 
    up.account_id,
    a.full_name,
    up.course_id,
    c.title as course_title,
    COUNT(up.lesson_id) as lessons_accessed,
    SUM(CASE WHEN up.completed = 1 THEN 1 ELSE 0 END) as lessons_completed,
    AVG(up.completion_percentage) as avg_completion_percentage,
    MAX(up.last_accessed) as last_accessed
FROM user_progress up
JOIN accounts a ON up.account_id = a.account_id
JOIN courses c ON up.course_id = c.course_id
GROUP BY up.account_id, a.full_name, up.course_id, c.title;
GO

PRINT 'SQL Server database schema created successfully!';
