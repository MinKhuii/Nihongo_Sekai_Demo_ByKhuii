-- =====================================================
-- Nihongo Sekai - MySQL Database Schema & Seed Data
-- Production-ready DDL script for Japanese Learning Platform
-- =====================================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS SWRT_NihongoSekai;
CREATE DATABASE SWRT_NihongoSekai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE SWRT_NihongoSekai;

-- =====================================================
-- TABLES
-- =====================================================

-- Accounts table (Main user accounts)
CREATE TABLE accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin','Learner','Teacher') NOT NULL,
    status ENUM('Active','Pending','Suspended') DEFAULT 'Pending',
    avatar_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Learners table (Student profiles)
CREATE TABLE learners (
    learner_id INT PRIMARY KEY,
    level VARCHAR(50) DEFAULT 'Beginner',
    interests TEXT,
    FOREIGN KEY (learner_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- Teachers table (Instructor profiles)
CREATE TABLE teachers (
    teacher_id INT PRIMARY KEY,
    bio TEXT,
    short_bio VARCHAR(255),
    teaching_experience INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    is_approved BOOLEAN DEFAULT FALSE,
    specializations TEXT, -- JSON array of specializations
    languages TEXT, -- JSON array of languages
    FOREIGN KEY (teacher_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- Partner documents table (Teacher application documents)
CREATE TABLE partner_documents (
    document_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    document_type ENUM('Certificate','Resume','Photo','Other') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE
);

-- Admins table (Administrator profiles)
CREATE TABLE admins (
    admin_id INT PRIMARY KEY,
    department VARCHAR(100) DEFAULT 'General',
    FOREIGN KEY (admin_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- Courses table (Learning courses)
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    created_by INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(255),
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0,
    level ENUM('Beginner','Elementary','Intermediate','Advanced') NOT NULL,
    duration INT DEFAULT 0, -- Duration in hours
    students_count INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

-- Course videos/lessons table
CREATE TABLE course_videos (
    video_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    video_url VARCHAR(255),
    sequence INT NOT NULL,
    duration INT DEFAULT 0, -- Duration in minutes
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Course learning outcomes table
CREATE TABLE course_outcomes (
    outcome_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Purchases table (Course purchases by learners)
CREATE TABLE purchases (
    learner_id INT,
    course_id INT,
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    progress INT DEFAULT 0, -- Progress percentage 0-100
    PRIMARY KEY(learner_id, course_id),
    FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Watched videos table (Video completion tracking)
CREATE TABLE watched_videos (
    learner_id INT,
    video_id INT,
    watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(learner_id, video_id),
    FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES course_videos(video_id) ON DELETE CASCADE
);

-- Classrooms table (Live learning sessions)
CREATE TABLE classrooms (
    classroom_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(255),
    video_call_link VARCHAR(255),
    max_students INT DEFAULT 10,
    current_students INT DEFAULT 0,
    schedule_text VARCHAR(255), -- Human readable schedule
    schedule_json JSON, -- Structured schedule data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE
);

-- Enrollments table (Classroom enrollments)
CREATE TABLE enrollments (
    learner_id INT,
    classroom_id INT,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(learner_id, classroom_id),
    FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id) ON DELETE CASCADE
);

-- Ratings table (Course ratings and reviews)
CREATE TABLE ratings (
    learner_id INT,
    course_id INT,
    stars TINYINT CHECK (stars BETWEEN 1 AND 5),
    review TEXT,
    rated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(learner_id, course_id),
    FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Teacher certifications table
CREATE TABLE teacher_certifications (
    certification_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    issuer VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    credential_id VARCHAR(100),
    verification_url VARCHAR(255),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Foreign key indexes
CREATE INDEX idx_learners_account ON learners(learner_id);
CREATE INDEX idx_teachers_account ON teachers(teacher_id);
CREATE INDEX idx_admins_account ON admins(admin_id);
CREATE INDEX idx_partner_docs_teacher ON partner_documents(teacher_id);
CREATE INDEX idx_courses_creator ON courses(created_by);
CREATE INDEX idx_videos_course ON course_videos(course_id);
CREATE INDEX idx_outcomes_course ON course_outcomes(course_id);
CREATE INDEX idx_purchases_learner ON purchases(learner_id);
CREATE INDEX idx_purchases_course ON purchases(course_id);
CREATE INDEX idx_watched_learner ON watched_videos(learner_id);
CREATE INDEX idx_watched_video ON watched_videos(video_id);
CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX idx_enrollments_learner ON enrollments(learner_id);
CREATE INDEX idx_enrollments_classroom ON enrollments(classroom_id);
CREATE INDEX idx_ratings_learner ON ratings(learner_id);
CREATE INDEX idx_ratings_course ON ratings(course_id);
CREATE INDEX idx_certifications_teacher ON teacher_certifications(teacher_id);

-- Search indexes
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_courses_title ON courses(title);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_rating ON courses(rating);
CREATE INDEX idx_courses_price ON courses(price);
CREATE INDEX idx_classrooms_title ON classrooms(title);
CREATE INDEX idx_teachers_approved ON teachers(is_approved);
CREATE INDEX idx_teachers_rating ON teachers(average_rating);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Admin account
INSERT INTO accounts (account_id, name, email, password_hash, role, status, created_at) VALUES
(1, 'Super Admin', 'admin@nihongosekai.com', '$2b$10$rQJ8YhKk.hF5aF5XoHKGK.vYjYhKk5aF5XoHKGK.vYjYhKk5aF5X', 'Admin', 'Active', '2023-01-01 00:00:00');

INSERT INTO admins (admin_id, department) VALUES
(1, 'Platform Management');

-- Teacher accounts
INSERT INTO accounts (account_id, name, email, password_hash, role, status, avatar_url, created_at) VALUES
(2, 'Yuki Tanaka', 'yuki.tanaka@nihongosekai.com', '$2b$10$rQJ8YhKk.hF5aF5XoHKGK.vYjYhKk5aF5XoHKGK.vYjYhKk5aF5X', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki Tanaka', '2023-01-15 00:00:00'),
(3, 'Hiroshi Sato', 'hiroshi.sato@nihongosekai.com', '$2b$10$rQJ8YhKk.hF5aF5XoHKGK.vYjYhKk5aF5XoHKGK.vYjYhKk5aF5X', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hiroshi Sato', '2023-03-20 00:00:00');

INSERT INTO teachers (teacher_id, bio, short_bio, teaching_experience, average_rating, is_approved, specializations, languages) VALUES
(2, 'Native Japanese speaker with 8 years of teaching experience. I specialize in conversational Japanese and business communication, helping students build confidence in real-world situations.', 'Native speaker specializing in conversation and business Japanese. 8+ years experience.', 8, 4.9, TRUE, '["Conversational Japanese", "Business Japanese", "Cultural Communication", "JLPT N3-N1"]', '["Japanese (Native)", "English (Fluent)", "Korean (Intermediate)"]'),
(3, 'Certified JLPT instructor with expertise in grammar and exam preparation. I have been teaching Japanese for 5 years and have helped hundreds of students pass their JLPT exams.', 'JLPT specialist with 5+ years experience. 95% student pass rate.', 5, 4.8, TRUE, '["JLPT Preparation", "Grammar", "Exam Techniques", "Vocabulary Building"]', '["Japanese (Native)", "English (Advanced)", "Chinese (Basic)"]');

-- Learner accounts
INSERT INTO accounts (account_id, name, email, password_hash, role, status, avatar_url, created_at) VALUES
(4, 'Emily Johnson', 'emily.johnson@email.com', '$2b$10$rQJ8YhKk.hF5aF5XoHKGK.vYjYhKk5aF5XoHKGK.vYjYhKk5aF5X', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily Johnson', '2024-01-10 00:00:00'),
(5, 'Michael Chen', 'michael.chen@email.com', '$2b$10$rQJ8YhKk.hF5aF5XoHKGK.vYjYhKk5aF5XoHKGK.vYjYhKk5aF5X', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael Chen', '2024-01-15 00:00:00'),
(6, 'Sarah Williams', 'sarah.williams@email.com', '$2b$10$rQJ8YhKk.hF5aF5XoHKGK.vYjYhKk5aF5XoHKGK.vYjYhKk5aF5X', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah Williams', '2024-02-01 00:00:00');

INSERT INTO learners (learner_id, level, interests) VALUES
(4, 'Beginner', 'Anime, Travel, Culture'),
(5, 'Elementary', 'Business, Technology, History'),
(6, 'Intermediate', 'Literature, Art, Traditional Culture');

-- Teacher certifications
INSERT INTO teacher_certifications (teacher_id, title, issuer, issue_date, credential_id, verification_url) VALUES
(2, 'Japanese Language Teaching Competency Test', 'Japan Foundation', '2018-03-15', 'JF-JLTCT-2018-001234', 'https://www.jpf.go.jp/verify'),
(2, 'Certified Business Japanese Instructor', 'Association for Business Japanese Education', '2019-07-20', 'ABJE-CBI-2019-5678', 'https://www.abje.org/verify'),
(3, 'Japanese Language Teaching Certificate', 'Tokyo University of Foreign Studies', '2019-03-25', 'TUFS-JLTC-2019-4567', 'https://www.tufs.ac.jp/verify'),
(3, 'JLPT Examiner Certification', 'Japan Educational Exchanges and Services', '2020-08-12', 'JEES-JEC-2020-8901', 'https://www.jees.or.jp/verify');

-- Courses
INSERT INTO courses (course_id, created_by, title, description, cover_image_url, price, rating, level, duration, students_count, created_at) VALUES
(1, 1, 'Japanese for Beginners: Hiragana & Katakana', 'Master the fundamentals of Japanese writing systems. Learn hiragana and katakana with interactive exercises, pronunciation guides, and cultural context.', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&h=300&fit=crop', 49.99, 4.7, 'Beginner', 20, 1247, '2024-01-15 00:00:00'),
(2, 1, 'Conversational Japanese: Daily Life', 'Learn practical Japanese for everyday situations. Practice greetings, shopping, dining, and social interactions with native speakers.', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&h=300&fit=crop', 79.99, 4.8, 'Elementary', 35, 892, '2024-01-20 00:00:00'),
(3, 1, 'Business Japanese: Professional Communication', 'Advanced course for professionals working with Japanese companies. Learn keigo (honorific language), business etiquette, and formal communication.', 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=500&h=300&fit=crop', 129.99, 4.9, 'Advanced', 50, 456, '2024-02-01 00:00:00'),
(4, 1, 'JLPT N5 Preparation Course', 'Comprehensive preparation for the Japanese Language Proficiency Test N5 level. Includes grammar, vocabulary, reading, and listening practice.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop', 99.99, 4.6, 'Beginner', 40, 723, '2024-01-25 00:00:00'),
(5, 1, 'Japanese Culture and Traditions', 'Explore Japanese culture, traditions, and social customs. Learn about festivals, tea ceremony, art, and modern Japanese society.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&h=300&fit=crop', 69.99, 4.5, 'Intermediate', 30, 634, '2024-02-05 00:00:00');

-- Course videos
INSERT INTO course_videos (course_id, title, video_url, sequence, duration) VALUES
-- Course 1 videos
(1, 'Introduction to Japanese Writing', 'https://example.com/videos/1-1', 1, 45),
(1, 'Hiragana: A-ka-sa-ta-na', 'https://example.com/videos/1-2', 2, 60),
-- Course 2 videos
(2, 'Greetings and Introductions', 'https://example.com/videos/2-1', 1, 40),
(2, 'Shopping and Numbers', 'https://example.com/videos/2-2', 2, 50),
-- Course 3 videos
(3, 'Keigo and Formal Language', 'https://example.com/videos/3-1', 1, 70),
(3, 'Business Meeting Etiquette', 'https://example.com/videos/3-2', 2, 60),
-- Course 4 videos
(4, 'N5 Grammar Fundamentals', 'https://example.com/videos/4-1', 1, 55),
(4, 'N5 Vocabulary Building', 'https://example.com/videos/4-2', 2, 45),
-- Course 5 videos
(5, 'Japanese Festivals and Traditions', 'https://example.com/videos/5-1', 1, 50),
(5, 'Modern Japanese Society', 'https://example.com/videos/5-2', 2, 55);

-- Course outcomes
INSERT INTO course_outcomes (course_id, description) VALUES
-- Course 1 outcomes
(1, 'Read and write all hiragana characters'),
(1, 'Read and write all katakana characters'),
-- Course 2 outcomes
(2, 'Engage in basic daily conversations'),
(2, 'Navigate shopping and dining situations'),
-- Course 3 outcomes
(3, 'Use appropriate keigo in business settings'),
(3, 'Navigate Japanese business culture confidently'),
-- Course 4 outcomes
(4, 'Pass JLPT N5 with confidence'),
(4, 'Master N5 level grammar and vocabulary'),
-- Course 5 outcomes
(5, 'Understand Japanese cultural contexts'),
(5, 'Appreciate traditional and modern Japanese culture');

-- Classrooms
INSERT INTO classrooms (classroom_id, teacher_id, title, description, thumbnail_url, video_call_link, max_students, current_students, schedule_text, schedule_json, created_at) VALUES
(1, 2, 'Morning Conversation Practice', 'Join our morning conversation circle to practice speaking Japanese in a supportive environment. Perfect for beginners to intermediate learners.', 'https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?w=400&h=300&fit=crop', 'https://meet.google.com/abc-def-ghi', 8, 5, 'Mon, Wed, Fri 9:00 AM JST', '[{"start":"2025-07-10T10:00:00","end":"2025-07-10T11:00:00","joinUrl":"https://meet.google.com/abc-def-ghi"}]', '2024-01-10 00:00:00'),
(2, 3, 'JLPT Study Group', 'Intensive study sessions focused on JLPT preparation. We cover grammar, vocabulary, and practice tests together.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop', 'https://meet.google.com/jkl-mno-pqr', 10, 7, 'Tue, Thu 7:00 PM JST', '[{"start":"2025-07-15T19:00:00","end":"2025-07-15T21:00:00","joinUrl":"https://meet.google.com/jkl-mno-pqr"}]', '2024-01-15 00:00:00'),
(3, 2, 'Business Japanese Workshop', 'Advanced workshop for professionals. Practice business presentations, meetings, and formal communication in Japanese.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop', 'https://meet.google.com/stu-vwx-yzd', 6, 4, 'Sat 2:00 PM JST', '[{"start":"2025-07-20T14:00:00","end":"2025-07-20T16:00:00","joinUrl":"https://meet.google.com/stu-vwx-yzd"}]', '2024-01-20 00:00:00');

-- Purchases (Sample purchases by learners)
INSERT INTO purchases (learner_id, course_id, purchased_at, progress) VALUES
(4, 1, '2024-01-20 10:00:00', 75),
(4, 4, '2024-02-01 14:30:00', 45),
(5, 2, '2024-01-25 09:15:00', 60),
(5, 3, '2024-02-10 16:45:00', 25),
(6, 2, '2024-02-05 11:20:00', 90),
(6, 5, '2024-02-15 13:10:00', 35);

-- Watched videos (Sample video completion)
INSERT INTO watched_videos (learner_id, video_id, watched_at) VALUES
(4, 1, '2024-01-21 10:30:00'),
(4, 2, '2024-01-22 15:20:00'),
(4, 7, '2024-02-02 09:45:00'),
(5, 3, '2024-01-26 11:15:00'),
(5, 4, '2024-01-28 14:30:00'),
(5, 5, '2024-02-11 16:20:00'),
(6, 3, '2024-02-06 12:40:00'),
(6, 4, '2024-02-07 10:15:00'),
(6, 9, '2024-02-16 13:50:00');

-- Enrollments (Sample classroom enrollments)
INSERT INTO enrollments (learner_id, classroom_id, enrolled_at) VALUES
(4, 1, '2024-01-15 12:00:00'),
(4, 2, '2024-02-01 15:30:00'),
(5, 1, '2024-01-18 09:45:00'),
(5, 3, '2024-02-05 14:20:00'),
(6, 2, '2024-01-22 11:10:00'),
(6, 3, '2024-02-08 16:15:00');

-- Ratings (Sample course ratings)
INSERT INTO ratings (learner_id, course_id, stars, review, rated_at) VALUES
(4, 1, 5, 'Excellent course for beginners! The hiragana and katakana lessons were very well structured.', '2024-02-15 10:30:00'),
(5, 2, 4, 'Great conversational practice. Would love to see more real-world scenarios.', '2024-02-20 14:45:00'),
(6, 2, 5, 'Perfect for daily conversation practice. Yuki-sensei is an amazing teacher!', '2024-02-25 11:20:00'),
(5, 3, 5, 'Essential for anyone working with Japanese companies. The keigo lessons are invaluable.', '2024-03-01 09:15:00'),
(6, 5, 4, 'Beautiful introduction to Japanese culture. Learned so much about traditions.', '2024-03-05 15:30:00');

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Trigger to update course rating when new rating is added
DELIMITER //
CREATE TRIGGER update_course_rating 
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE courses 
    SET rating = (
        SELECT AVG(stars) 
        FROM ratings 
        WHERE course_id = NEW.course_id
    )
    WHERE course_id = NEW.course_id;
END//

-- Trigger to update teacher average rating
CREATE TRIGGER update_teacher_rating 
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE teachers 
    SET average_rating = (
        SELECT AVG(r.stars) 
        FROM ratings r 
        JOIN courses c ON r.course_id = c.course_id 
        JOIN teachers t ON c.created_by = t.teacher_id 
        WHERE t.teacher_id = (
            SELECT created_by FROM courses WHERE course_id = NEW.course_id
        )
    )
    WHERE teacher_id = (
        SELECT created_by FROM courses WHERE course_id = NEW.course_id
    );
END//

-- Trigger to update students count when purchase is made
CREATE TRIGGER update_course_students 
AFTER INSERT ON purchases
FOR EACH ROW
BEGIN
    UPDATE courses 
    SET students_count = (
        SELECT COUNT(*) 
        FROM purchases 
        WHERE course_id = NEW.course_id
    )
    WHERE course_id = NEW.course_id;
END//

-- Trigger to update classroom current students when enrollment happens
CREATE TRIGGER update_classroom_students 
AFTER INSERT ON enrollments
FOR EACH ROW
BEGIN
    UPDATE classrooms 
    SET current_students = (
        SELECT COUNT(*) 
        FROM enrollments 
        WHERE classroom_id = NEW.classroom_id
    )
    WHERE classroom_id = NEW.classroom_id;
END//

DELIMITER ;

-- =====================================================
-- FINAL VALIDATION QUERIES
-- =====================================================

-- Display summary of created data
SELECT 'Database Setup Complete!' as Status;

SELECT 
    'Total Accounts' as Metric, 
    COUNT(*) as Count 
FROM accounts
UNION ALL
SELECT 
    'Total Courses', 
    COUNT(*) 
FROM courses
UNION ALL
SELECT 
    'Total Classrooms', 
    COUNT(*) 
FROM classrooms
UNION ALL
SELECT 
    'Total Purchases', 
    COUNT(*) 
FROM purchases;

-- Show course enrollment statistics
SELECT 
    c.title as Course,
    c.students_count as Students,
    c.rating as Rating,
    CONCAT('$', c.price) as Price
FROM courses c
ORDER BY c.students_count DESC;

-- Show classroom enrollment statistics
SELECT 
    cl.title as Classroom,
    CONCAT(a.name) as Teacher,
    cl.current_students as Students,
    cl.max_students as Max_Students
FROM classrooms cl
JOIN teachers t ON cl.teacher_id = t.teacher_id
JOIN accounts a ON t.teacher_id = a.account_id
ORDER BY cl.current_students DESC;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
