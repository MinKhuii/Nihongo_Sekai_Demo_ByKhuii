-- Nihongo Sekai Database Schema and Seed Data
-- MySQL Database Setup for Japanese Learning Platform

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- Drop existing database if exists and create new one
DROP DATABASE IF EXISTS nihongo_sekai;
CREATE DATABASE nihongo_sekai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nihongo_sekai;

-- ==================================================
-- ACCOUNTS TABLE (Users with roles)
-- ==================================================
CREATE TABLE accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('Learner', 'Teacher', 'Admin') NOT NULL DEFAULT 'Learner',
    status ENUM('Active', 'Pending', 'Suspended', 'Rejected') NOT NULL DEFAULT 'Active',
    avatar_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR(6) DEFAULT NULL,
    reset_token_expires TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- ==================================================
-- TEACHERS TABLE (Extended info for teacher accounts)
-- ==================================================
CREATE TABLE teachers (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    bio TEXT,
    qualifications JSON,
    years_experience INT DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    specializations JSON,
    id_document_url VARCHAR(500),
    approved_at TIMESTAMP NULL,
    approved_by INT NULL,
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES accounts(account_id) ON DELETE SET NULL,
    INDEX idx_account_id (account_id)
);

-- ==================================================
-- CATEGORIES TABLE
-- ==================================================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color_code VARCHAR(7) DEFAULT '#dc2626',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- COURSES TABLE
-- ==================================================
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    teacher_id INT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cover_image_url VARCHAR(500),
    level ENUM('Beginner', 'Elementary', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    duration_hours INT DEFAULT 0,
    status ENUM('Draft', 'Published', 'Archived') DEFAULT 'Published',
    rating DECIMAL(3,2) DEFAULT 0.00,
    students_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_teacher (teacher_id),
    INDEX idx_status (status)
);

-- ==================================================
-- COURSE LESSONS TABLE
-- ==================================================
CREATE TABLE course_lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    video_duration INT DEFAULT 0, -- in seconds
    lesson_order INT NOT NULL,
    is_free BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id),
    INDEX idx_lesson_order (lesson_order)
);

-- ==================================================
-- QUIZZES TABLE
-- ==================================================
CREATE TABLE quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score INT DEFAULT 70,
    time_limit INT DEFAULT 30, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id)
);

-- ==================================================
-- QUIZ QUESTIONS TABLE
-- ==================================================
CREATE TABLE quiz_questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'fill_blank') DEFAULT 'multiple_choice',
    options JSON, -- Store multiple choice options
    correct_answer VARCHAR(500) NOT NULL,
    points INT DEFAULT 1,
    question_order INT NOT NULL,
    
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id)
);

-- ==================================================
-- CLASSROOMS TABLE
-- ==================================================
CREATE TABLE classrooms (
    classroom_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id INT NOT NULL,
    max_students INT DEFAULT 20,
    current_students INT DEFAULT 0,
    schedule JSON, -- Store recurring schedule
    video_call_url VARCHAR(500),
    status ENUM('Active', 'Inactive', 'Full') DEFAULT 'Active',
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_status (status)
);

-- ==================================================
-- CLASSROOM POSTS TABLE (Announcements)
-- ==================================================
CREATE TABLE classroom_posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id INT NOT NULL,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    attachment_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    INDEX idx_classroom_id (classroom_id),
    INDEX idx_created_at (created_at)
);

-- ==================================================
-- ASSIGNMENTS TABLE
-- ==================================================
CREATE TABLE assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id INT NOT NULL,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    max_points INT DEFAULT 100,
    attachment_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    INDEX idx_classroom_id (classroom_id),
    INDEX idx_due_date (due_date)
);

-- ==================================================
-- ORDERS TABLE (Course purchases)
-- ==================================================
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
    payment_method VARCHAR(50) DEFAULT 'PayPal',
    paypal_transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    INDEX idx_account_id (account_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
);

-- ==================================================
-- ORDER ITEMS TABLE
-- ==================================================
CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    course_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
);

-- ==================================================
-- ENROLLMENTS TABLE (Course access)
-- ==================================================
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress DECIMAL(5,2) DEFAULT 0.00, -- percentage
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (account_id, course_id),
    INDEX idx_account_id (account_id),
    INDEX idx_course_id (course_id)
);

-- ==================================================
-- CLASSROOM ENROLLMENTS TABLE
-- ==================================================
CREATE TABLE classroom_enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    classroom_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Active', 'Dropped') DEFAULT 'Active',
    
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    UNIQUE KEY unique_classroom_enrollment (account_id, classroom_id),
    INDEX idx_account_id (account_id),
    INDEX idx_classroom_id (classroom_id)
);

-- ==================================================
-- ADMIN LOGS TABLE
-- ==================================================
CREATE TABLE admin_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_table VARCHAR(100),
    target_id INT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_created_at (created_at)
);

-- ==================================================
-- SEED DATA
-- ==================================================

-- Insert Categories
INSERT INTO categories (name, description, color_code) VALUES
('Grammar', 'Japanese grammar patterns and structures', '#dc2626'),
('Vocabulary', 'Essential Japanese words and phrases', '#059669'),
('Conversation', 'Speaking and listening practice', '#7c3aed'),
('Reading', 'Japanese reading comprehension', '#ea580c'),
('Writing', 'Hiragana, Katakana, and Kanji practice', '#0891b2'),
('Culture', 'Japanese culture and traditions', '#be185d'),
('Business', 'Business Japanese and formal language', '#374151'),
('JLPT', 'Japanese Language Proficiency Test preparation', '#f59e0b');

-- Insert Admin Account
INSERT INTO accounts (email, password_hash, full_name, role, status, email_verified) VALUES
('admin@nihongosekai.com', '$2b$10$vM3R8QwOkK3jGk8lXnYFc.Y/TJ8YBJJnRr1mW6QgJ4ZOXf3Q8vK6.', 'System Administrator', 'Admin', 'Active', TRUE);

-- Insert Teacher Accounts
INSERT INTO accounts (email, password_hash, full_name, role, status, avatar_url, email_verified) VALUES
('hiroshi.tanaka@nihongosekai.com', '$2b$10$2kJ8m9PqR5xVtG7N4wE8fO.L3M6P9qR2s5V8xA1B4c7D0G3J6k9N', 'Hiroshi Tanaka', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HiroshiTanaka&backgroundColor=b6e3f4', TRUE),
('yuki.nakamura@nihongosekai.com', '$2b$10$3lK9n0QrS6yWuH8O5xF9gP.M4N7Q0rS3t6W9yB2C5d8E1H4K7l0O', 'Yuki Nakamura', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=YukiNakamura&backgroundColor=ffd93d', TRUE),
('akiko.sato@nihongosekai.com', '$2b$10$4mL0o1RtT7zXvI9P6yG0hQ.N5O8R1sT4u7X0zC3D6e9F2I5L8m1P', 'Akiko Sato', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AkikoSato&backgroundColor=ffdfbf', TRUE),
('kenji.yamamoto@nihongosekai.com', '$2b$10$5nM1p2SuU8aYwJ0Q7zH1iR.O6P9S2tU5v8Y1zD4E7f0G3J6M9n2Q', 'Kenji Yamamoto', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=KenjiYamamoto&backgroundColor=c0aede', TRUE),
('mai.suzuki@nihongosekai.com', '$2b$10$6oN2q3TvV9bZxK1R8aI2jS.P7Q0T3uV6w9Z2aE5F8g1H4K7N0o3R', 'Mai Suzuki', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=MaiSuzuki&backgroundColor=ddd6fe', TRUE),
('takeshi.kato@nihongosekai.com', '$2b$10$7pO3r4UwW0cAyL2S9bJ3kT.Q8R1U4vW7x0A3bF6G9h2I5L8O1p4S', 'Takeshi Kato', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=TakeshiKato&backgroundColor=fed7d7', TRUE),
('sakura.hayashi@nihongosekai.com', '$2b$10$8qP4s5VxX1dBzM3T0cK4lU.R9S2V5wX8y1B4cG7H0i3J6M9P2q5T', 'Sakura Hayashi', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SakuraHayashi&backgroundColor=fef3c7', TRUE),
('daisuke.ito@nihongosekai.com', '$2b$10$9rQ5t6WyY2eCaN4U1dL5mV.S0T3W6xY9z2C5dH8I1j4K7N0Q3r6U', 'Daisuke Ito', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=DaisukeIto&backgroundColor=d1fae5', TRUE),
('michiko.abe@nihongosekai.com', '$2b$10$0sR6u7XzZ3fDbO5V2eM6nW.T1U4X7yZ0a3D6eI9J2k5L8O1R4s7V', 'Michiko Abe', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichikoAbe&backgroundColor=e0e7ff', TRUE),
('ryo.matsuda@nihongosekai.com', '$2b$10$1tS7v8YaA4gEcP6W3fN7oX.U2V5Y8zA1b4E7fJ0K3l6M9P2S5t8W', 'Ryo Matsuda', 'Teacher', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=RyoMatsuda&backgroundColor=fce7f3', TRUE);

-- Insert Teacher Details
INSERT INTO teachers (account_id, bio, qualifications, years_experience, hourly_rate, specializations) VALUES
(2, 'Native Japanese speaker with extensive experience teaching Japanese as a foreign language. Specializes in grammar and conversation practice.', 
   '["JLPT N1 Certified", "Teaching Japanese as Foreign Language Certificate", "Masters in Japanese Literature"]', 
   8, 45.00, '["Grammar", "Conversation", "JLPT Preparation"]'),
(3, 'Experienced Japanese teacher focusing on cultural immersion and practical conversation skills for daily life situations.', 
   '["PhD in Applied Linguistics", "TESOL Certificate", "Cultural Studies Certification"]', 
   6, 40.00, '["Conversation", "Culture", "Daily Life Japanese"]'),
(4, 'Former university professor specializing in Japanese writing systems and reading comprehension techniques.', 
   '["University Teaching License", "Japanese Calligraphy Master", "Literature PhD"]', 
   12, 50.00, '["Reading", "Writing", "Kanji"]'),
(5, 'Business Japanese specialist with corporate training experience. Helps professionals communicate effectively in Japanese workplace.', 
   '["Business Japanese Certificate", "Corporate Training License", "MBA"]', 
   5, 55.00, '["Business Japanese", "Professional Communication"]'),
(6, 'JLPT preparation expert with high student success rates. Specializes in test strategies and comprehensive review.', 
   '["JLPT Instructor Certification", "Test Preparation Specialist", "Educational Psychology"]', 
   7, 42.00, '["JLPT Preparation", "Test Strategies", "Vocabulary"]'),
(7, 'Young and energetic teacher focusing on modern Japanese and pop culture integration in language learning.', 
   '["Modern Japanese Teaching Certificate", "Pop Culture Studies", "Youth Education"]', 
   3, 35.00, '["Modern Japanese", "Pop Culture", "Youth Learning"]'),
(8, 'Traditional Japanese culture expert combining language learning with cultural education and practices.', 
   '["Traditional Arts Certificate", "Cultural Heritage Teaching", "Tea Ceremony Master"]', 
   10, 48.00, '["Traditional Culture", "Formal Japanese", "Cultural Practices"]'),
(9, 'Technology-enhanced learning specialist using innovative methods to teach Japanese through digital platforms.', 
   '["EdTech Certification", "Digital Learning Specialist", "Computer Science Background"]', 
   4, 38.00, '["Digital Learning", "Technology Integration", "Interactive Methods"]'),
(10, 'Children and beginner specialist with patient teaching approach and creative learning methods.', 
   '["Child Education Certificate", "Beginner Teaching Specialist", "Creative Learning Methods"]', 
   6, 40.00, '["Beginner Japanese", "Children Teaching", "Creative Methods"]'),
(11, 'Advanced conversation and pronunciation coach helping students achieve natural Japanese speaking abilities.', 
   '["Pronunciation Coach Certificate", "Advanced Conversation Training", "Phonetics Studies"]', 
   9, 47.00, '["Advanced Conversation", "Pronunciation", "Speaking Fluency"]');

-- Insert Learner Accounts (20 learners)
INSERT INTO accounts (email, password_hash, full_name, role, status, avatar_url, email_verified) VALUES
('emma.johnson@email.com', '$2b$10$learner1hash', 'Emma Johnson', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=b6e3f4', TRUE),
('carlos.garcia@email.com', '$2b$10$learner2hash', 'Carlos Garcia', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=ffd93d', TRUE),
('sophie.martin@email.com', '$2b$10$learner3hash', 'Sophie Martin', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=ffdfbf', TRUE),
('david.kim@email.com', '$2b$10$learner4hash', 'David Kim', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=c0aede', TRUE),
('maria.silva@email.com', '$2b$10$learner5hash', 'Maria Silva', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=ddd6fe', TRUE),
('ahmed.hassan@email.com', '$2b$10$learner6hash', 'Ahmed Hassan', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&backgroundColor=fed7d7', TRUE),
('anna.kowalski@email.com', '$2b$10$learner7hash', 'Anna Kowalski', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna&backgroundColor=fef3c7', TRUE),
('raj.patel@email.com', '$2b$10$learner8hash', 'Raj Patel', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj&backgroundColor=d1fae5', TRUE),
('lisa.anderson@email.com', '$2b$10$learner9hash', 'Lisa Anderson', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=e0e7ff', TRUE),
('pierre.dubois@email.com', '$2b$10$learner10hash', 'Pierre Dubois', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre&backgroundColor=fce7f3', TRUE),
('elena.rossi@email.com', '$2b$10$learner11hash', 'Elena Rossi', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=b6e3f4', TRUE),
('chen.wei@email.com', '$2b$10$learner12hash', 'Chen Wei', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen&backgroundColor=ffd93d', TRUE),
('isabelle.brown@email.com', '$2b$10$learner13hash', 'Isabelle Brown', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabelle&backgroundColor=ffdfbf', TRUE),
('miguel.rodriguez@email.com', '$2b$10$learner14hash', 'Miguel Rodriguez', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel&backgroundColor=c0aede', TRUE),
('sarah.wilson@email.com', '$2b$10$learner15hash', 'Sarah Wilson', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ddd6fe', TRUE),
('antonio.lopez@email.com', '$2b$10$learner16hash', 'Antonio Lopez', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Antonio&backgroundColor=fed7d7', TRUE),
('jenny.lee@email.com', '$2b$10$learner17hash', 'Jenny Lee', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jenny&backgroundColor=fef3c7', TRUE),
('thomas.mueller@email.com', '$2b$10$learner18hash', 'Thomas Mueller', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas&backgroundColor=d1fae5', TRUE),
('natasha.petrov@email.com', '$2b$10$learner19hash', 'Natasha Petrov', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natasha&backgroundColor=e0e7ff', TRUE),
('james.taylor@email.com', '$2b$10$learner20hash', 'James Taylor', 'Learner', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=fce7f3', TRUE);

-- Insert Courses (12 sample courses)
INSERT INTO courses (title, description, category_id, teacher_id, price, cover_image_url, level, duration_hours, rating, students_count) VALUES
('Japanese for Beginners: Hiragana & Katakana', 'Master the fundamentals of Japanese writing systems with interactive exercises and cultural context. Perfect for complete beginners starting their Japanese journey.', 5, 1, 49.99, 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=250&fit=crop', 'Beginner', 20, 4.7, 1247),
('Conversational Japanese: Daily Life', 'Learn practical Japanese for everyday situations and social interactions. Focus on speaking and listening skills for real-world communication.', 3, 2, 79.99, 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=250&fit=crop', 'Elementary', 35, 4.8, 892),
('Business Japanese: Professional Communication', 'Advanced course for professionals working with Japanese companies. Learn formal language, business etiquette, and workplace communication.', 7, 4, 129.99, 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=250&fit=crop', 'Advanced', 50, 4.9, 456),
('JLPT N5 Preparation Course', 'Comprehensive preparation for the Japanese Language Proficiency Test N5 level. Includes practice tests and study strategies.', 8, 5, 89.99, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop', 'Beginner', 40, 4.6, 723),
('Japanese Grammar Mastery', 'Deep dive into Japanese grammar patterns from basic to intermediate level. Structured approach with plenty of practice exercises.', 1, 1, 99.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop', 'Intermediate', 45, 4.8, 634),
('Kanji Learning Made Easy', 'Systematic approach to learning Kanji characters with mnemonics, stroke order, and practical usage examples.', 5, 3, 69.99, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', 'Elementary', 30, 4.5, 521),
('Japanese Culture Through Language', 'Explore Japanese culture while learning the language. Covers traditions, festivals, social customs, and modern culture.', 6, 7, 59.99, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop', 'Elementary', 25, 4.7, 398),
('Advanced Reading Comprehension', 'Improve your Japanese reading skills with authentic materials including news articles, novels, and academic texts.', 4, 3, 109.99, 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop', 'Advanced', 35, 4.6, 287),
('Anime Japanese: Learn Through Entertainment', 'Learn Japanese through popular anime and manga. Understand colloquial expressions and youth language.', 6, 6, 39.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop', 'Elementary', 20, 4.4, 912),
('Japanese Pronunciation and Accent', 'Perfect your Japanese pronunciation with native speaker guidance. Focus on accent patterns and natural intonation.', 3, 10, 54.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop', 'Intermediate', 15, 4.8, 345),
('Essential Japanese Vocabulary', 'Build your Japanese vocabulary systematically with the most commonly used words and phrases in daily life.', 2, 2, 44.99, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop', 'Beginner', 25, 4.5, 876),
('Japanese for Travel and Tourism', 'Learn practical Japanese for traveling in Japan. Covers transportation, accommodation, dining, and tourist situations.', 2, 8, 34.99, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop', 'Beginner', 18, 4.3, 567);

-- Insert Course Lessons
INSERT INTO course_lessons (course_id, title, description, video_url, video_duration, lesson_order, is_free) VALUES
-- Course 1: Japanese for Beginners
(1, 'Introduction to Japanese Writing Systems', 'Overview of Hiragana, Katakana, and Kanji writing systems', 'https://www.youtube.com/embed/6p9Il_j0zjc', 900, 1, TRUE),
(1, 'Hiragana Characters A-N', 'Learn the first set of Hiragana characters with proper stroke order', 'https://www.youtube.com/embed/UJtRl9EaBWM', 1200, 2, TRUE),
(1, 'Hiragana Characters H-Y', 'Complete your Hiragana learning with the remaining characters', 'https://www.youtube.com/embed/RDXFOSvhJmY', 1200, 3, FALSE),
(1, 'Katakana Basics', 'Introduction to Katakana and when to use it', 'https://www.youtube.com/embed/s6DKRgtVLGA', 1000, 4, FALSE),

-- Course 2: Conversational Japanese
(2, 'Basic Greetings and Introductions', 'Essential phrases for meeting people and basic conversations', 'https://www.youtube.com/embed/pBgRpdAe4P8', 800, 1, TRUE),
(2, 'Asking for Directions', 'How to ask for and understand directions in Japanese', 'https://www.youtube.com/embed/3VFjQWw2cMg', 900, 2, FALSE),
(2, 'Shopping and Ordering Food', 'Practical conversation for daily shopping and restaurant visits', 'https://www.youtube.com/embed/kx9XjWP1VgM', 1100, 3, FALSE),
(2, 'Making Plans and Invitations', 'How to make plans with friends and accept or decline invitations', 'https://www.youtube.com/embed/4x3lXpMgcDk', 950, 4, FALSE),

-- Course 3: Business Japanese
(3, 'Business Card Exchange Etiquette', 'Proper business card exchange and formal introductions', 'https://www.youtube.com/embed/SRNaI7fOdhg', 700, 1, TRUE),
(3, 'Meeting Participation and Presentations', 'How to participate effectively in Japanese business meetings', 'https://www.youtube.com/embed/7FYuZkqP4lM', 1300, 2, FALSE),
(3, 'Email Communication in Japanese', 'Writing professional emails and formal correspondence', 'https://www.youtube.com/embed/QjgXh6z8zTY', 1000, 3, FALSE),
(3, 'Negotiation and Decision Making', 'Advanced business communication for negotiations', 'https://www.youtube.com/embed/RjPGsXzB8zY', 1400, 4, FALSE);

-- Add more lessons for other courses (abbreviated for space)
INSERT INTO course_lessons (course_id, title, description, video_url, video_duration, lesson_order, is_free) VALUES
-- Course 4: JLPT N5 Preparation
(4, 'JLPT N5 Overview and Strategy', 'Understanding the test format and preparation strategies', 'https://www.youtube.com/embed/N5TestOverview', 1000, 1, TRUE),
(4, 'N5 Grammar Patterns Part 1', 'Essential grammar patterns for JLPT N5', 'https://www.youtube.com/embed/N5Grammar1', 1200, 2, FALSE),
(4, 'N5 Vocabulary Building', 'Core vocabulary needed for JLPT N5 success', 'https://www.youtube.com/embed/N5Vocab', 900, 3, FALSE),

-- Course 5: Grammar Mastery
(5, 'Basic Sentence Structure', 'Understanding Japanese sentence patterns', 'https://www.youtube.com/embed/GrammarBasics', 800, 1, TRUE),
(5, 'Verb Conjugations', 'Mastering Japanese verb forms and tenses', 'https://www.youtube.com/embed/VerbConj', 1500, 2, FALSE),
(5, 'Particles Deep Dive', 'Complete guide to Japanese particles', 'https://www.youtube.com/embed/Particles', 1100, 3, FALSE);

-- Insert Quizzes
INSERT INTO quizzes (course_id, title, description, passing_score, time_limit) VALUES
(1, 'Hiragana Recognition Quiz', 'Test your knowledge of Hiragana characters', 70, 15),
(1, 'Katakana Practice Test', 'Quiz on Katakana characters and usage', 75, 20),
(2, 'Daily Conversation Quiz', 'Test your conversational Japanese skills', 70, 25),
(3, 'Business Japanese Assessment', 'Evaluate your business Japanese proficiency', 80, 30),
(4, 'JLPT N5 Mock Test', 'Practice test similar to actual JLPT N5', 70, 45),
(5, 'Grammar Patterns Quiz', 'Test your understanding of Japanese grammar', 75, 20);

-- Insert Quiz Questions
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, question_order) VALUES
-- Hiragana Quiz
(1, 'What does the character あ represent?', 'multiple_choice', '["a", "i", "u", "e"]', 'a', 1, 1),
(1, 'How do you write "ka" in Hiragana?', 'multiple_choice', '["か", "き", "く", "け"]', 'か', 1, 2),
(1, 'The character さ is pronounced as:', 'multiple_choice', '["sa", "shi", "su", "se"]', 'sa', 1, 3),
(1, 'What sound does ん make?', 'multiple_choice', '["n", "m", "ng", "silent"]', 'n', 1, 4),
(1, 'Which character represents "to"?', 'multiple_choice', '["と", "た", "て", "つ"]', 'と', 1, 5),

-- Conversation Quiz
(3, 'How do you say "Nice to meet you" in Japanese?', 'multiple_choice', 
   '["はじめまして", "ありがとう", "すみません", "おはよう"]', 'はじめまして', 2, 1),
(3, 'What is the polite way to ask "Where is the station?"', 'multiple_choice',
   '["駅はどこですか？", "駅はどこ？", "駅は？", "どこ駅？"]', '駅はどこですか？', 2, 2),
(3, '"Excuse me" in Japanese is:', 'multiple_choice',
   '["すみません", "ごめん", "ちょっと", "あの"]', 'すみません', 2, 3);

-- Insert Classrooms (16 classrooms)
INSERT INTO classrooms (title, description, teacher_id, max_students, current_students, schedule, video_call_url, price) VALUES
('Morning Conversation Circle', 'Start your day with Japanese conversation practice in a friendly, supportive environment', 1, 8, 5, '{"days": ["Monday", "Wednesday", "Friday"], "time": "09:00", "timezone": "JST", "duration": 60}', 'https://meet.jit.si/nihongo-morning-1', 25.00),
('Evening Grammar Workshop', 'Intensive grammar practice sessions focusing on common patterns and usage', 2, 12, 8, '{"days": ["Tuesday", "Thursday"], "time": "19:00", "timezone": "JST", "duration": 90}', 'https://meet.jit.si/nihongo-grammar-1', 30.00),
('JLPT N3 Study Group', 'Collaborative study sessions for JLPT N3 preparation with practice tests', 5, 15, 12, '{"days": ["Saturday"], "time": "14:00", "timezone": "JST", "duration": 120}', 'https://meet.jit.si/nihongo-jlpt-n3', 40.00),
('Business Japanese Bootcamp', 'Professional Japanese communication skills for workplace success', 4, 10, 7, '{"days": ["Monday", "Wednesday"], "time": "18:00", "timezone": "JST", "duration": 75}', 'https://meet.jit.si/nihongo-business', 50.00),
('Cultural Immersion Class', 'Learn Japanese through cultural activities and traditional practices', 7, 15, 11, '{"days": ["Sunday"], "time": "10:00", "timezone": "JST", "duration": 90}', 'https://meet.jit.si/nihongo-culture', 35.00),
('Beginner Friendly Sessions', 'Patient and encouraging environment for absolute beginners', 9, 10, 6, '{"days": ["Tuesday", "Saturday"], "time": "16:00", "timezone": "JST", "duration": 60}', 'https://meet.jit.si/nihongo-beginner', 20.00),
('Advanced Reading Club', 'Discuss Japanese literature and practice advanced reading skills', 3, 8, 4, '{"days": ["Thursday"], "time": "20:00", "timezone": "JST", "duration": 90}', 'https://meet.jit.si/nihongo-reading', 45.00),
('Anime Japanese Decoded', 'Learn contemporary Japanese through popular anime and manga', 6, 20, 16, '{"days": ["Friday"], "time": "17:00", "timezone": "JST", "duration": 75}', 'https://meet.jit.si/nihongo-anime', 25.00),
('Pronunciation Mastery', 'Perfect your Japanese pronunciation with native speaker feedback', 10, 6, 3, '{"days": ["Wednesday"], "time": "15:00", "timezone": "JST", "duration": 45}', 'https://meet.jit.si/nihongo-pronunciation', 35.00),
('Kanji Study Circle', 'Systematic Kanji learning with mnemonics and practice', 3, 12, 9, '{"days": ["Monday", "Friday"], "time": "11:00", "timezone": "JST", "duration": 60}', 'https://meet.jit.si/nihongo-kanji', 30.00),
('Travel Japanese Essentials', 'Practical Japanese for tourists and travelers to Japan', 8, 15, 10, '{"days": ["Saturday"], "time": "09:00", "timezone": "JST", "duration": 75}', 'https://meet.jit.si/nihongo-travel', 28.00),
('Japanese Tea Ceremony Language', 'Learn Japanese through traditional tea ceremony practices', 7, 8, 5, '{"days": ["Sunday"], "time": "15:00", "timezone": "JST", "duration": 120}', 'https://meet.jit.si/nihongo-tea', 55.00),
('Kids Japanese Fun Time', 'Interactive Japanese lessons designed specifically for children', 9, 10, 7, '{"days": ["Saturday"], "time": "11:00", "timezone": "JST", "duration": 45}', 'https://meet.jit.si/nihongo-kids', 22.00),
('JLPT N2 Intensive', 'Intensive preparation course for JLPT N2 level students', 1, 12, 8, '{"days": ["Tuesday", "Friday"], "time": "20:00", "timezone": "JST", "duration": 100}', 'https://meet.jit.si/nihongo-jlpt-n2', 48.00),
('Modern Japanese Slang', 'Stay current with contemporary Japanese expressions and slang', 6, 15, 12, '{"days": ["Thursday"], "time": "19:30", "timezone": "JST", "duration": 60}', 'https://meet.jit.si/nihongo-modern', 26.00),
('Japanese Calligraphy & Language', 'Combine language learning with traditional Japanese calligraphy', 3, 8, 4, '{"days": ["Sunday"], "time": "13:00", "timezone": "JST", "duration": 90}', 'https://meet.jit.si/nihongo-calligraphy', 42.00);

-- Update current students in classrooms
UPDATE classrooms SET current_students = FLOOR(RAND() * (max_students - 2)) + 1;

-- Insert Classroom Posts
INSERT INTO classroom_posts (classroom_id, teacher_id, title, content, created_at) VALUES
(1, 1, 'Welcome to Morning Conversation Circle!', 'こんにちは！Welcome to our morning conversation practice. Please introduce yourself in Japanese during our first session. Don\'t worry about making mistakes - that\'s how we learn!', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 1, 'This Week\'s Topic: Spring in Japan', 'This week we\'ll discuss spring season in Japan, including cherry blossoms (桜), Golden Week holidays, and spring foods. Please prepare to share your thoughts about your favorite season!', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 2, 'Grammar Focus: Te-form Verbs', 'Next class we\'ll focus on te-form verb conjugations. Please review the handout I shared and come prepared with questions. Remember: practice makes perfect!', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 5, 'JLPT N3 Mock Test Results', 'Great job everyone on last week\'s mock test! Average score was 78%. We\'ll review the most challenging questions this Saturday. Keep up the excellent work!', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 4, 'Business Card Exchange Practice', 'Remember to bring business cards (or create mock ones) for our next session. We\'ll practice proper exchange etiquette and formal introductions.', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(5, 7, 'Cultural Activity: Virtual Tea Ceremony', 'Next Sunday we\'ll have a virtual tea ceremony experience! Please prepare green tea if you have it. I\'ll guide you through the basic steps and related vocabulary.', DATE_SUB(NOW(), INTERVAL 6 DAY));

-- Insert Assignments
INSERT INTO assignments (classroom_id, teacher_id, title, description, due_date, max_points) VALUES
(1, 1, 'Self Introduction Speech', 'Prepare a 2-minute self-introduction in Japanese. Include your name, hometown, hobbies, and reason for learning Japanese. Focus on natural pronunciation and clear delivery.', DATE_ADD(NOW(), INTERVAL 3 DAY), 100),
(2, 2, 'Te-form Conjugation Exercise', 'Complete the te-form conjugation worksheet for all 50 verbs. Include both positive and negative forms. Submit handwritten or typed answers.', DATE_ADD(NOW(), INTERVAL 5 DAY), 50),
(3, 5, 'JLPT N3 Reading Comprehension', 'Complete the reading comprehension passage about Japanese work culture. Answer all 10 questions and provide explanations for your choices.', DATE_ADD(NOW(), INTERVAL 7 DAY), 100),
(4, 4, 'Business Email Writing', 'Write a formal business email in Japanese requesting a meeting with a client. Use appropriate keigo (honorific language) and business expressions.', DATE_ADD(NOW(), INTERVAL 4 DAY), 75),
(5, 7, 'Cultural Research Project', 'Research one traditional Japanese festival and prepare a 5-minute presentation. Include history, customs, and vocabulary related to the festival.', DATE_ADD(NOW(), INTERVAL 10 DAY), 100),
(6, 9, 'Hiragana Writing Practice', 'Practice writing all 46 hiragana characters with proper stroke order. Submit photos of your handwritten practice sheets.', DATE_ADD(NOW(), INTERVAL 2 DAY), 25);

-- Insert Sample Orders (30 orders)
INSERT INTO orders (account_id, total_amount, payment_status, payment_method, paypal_transaction_id, created_at, completed_at) VALUES
(12, 49.99, 'Completed', 'PayPal', 'PAY-1A123456789', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
(13, 79.99, 'Completed', 'PayPal', 'PAY-2B234567890', DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY)),
(14, 129.99, 'Completed', 'PayPal', 'PAY-3C345678901', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
(15, 89.99, 'Completed', 'PayPal', 'PAY-4D456789012', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
(16, 99.99, 'Completed', 'PayPal', 'PAY-5E567890123', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(17, 69.99, 'Completed', 'PayPal', 'PAY-6F678901234', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(18, 59.99, 'Completed', 'PayPal', 'PAY-7G789012345', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(19, 109.99, 'Completed', 'PayPal', 'PAY-8H890123456', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(20, 39.99, 'Completed', 'PayPal', 'PAY-9I901234567', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(21, 54.99, 'Completed', 'PayPal', 'PAY-0J012345678', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Insert Order Items
INSERT INTO order_items (order_id, course_id, price) VALUES
(1, 1, 49.99),
(2, 2, 79.99),
(3, 3, 129.99),
(4, 4, 89.99),
(5, 5, 99.99),
(6, 6, 69.99),
(7, 7, 59.99),
(8, 8, 109.99),
(9, 9, 39.99),
(10, 10, 54.99);

-- Insert Enrollments
INSERT INTO enrollments (account_id, course_id, progress, enrolled_at) VALUES
(12, 1, 75.50, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(13, 2, 45.25, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(14, 3, 20.00, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(15, 4, 88.75, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(16, 5, 55.30, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(17, 6, 92.10, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(18, 7, 67.80, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(19, 8, 15.50, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(20, 9, 100.00, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(21, 10, 25.75, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Insert Classroom Enrollments
INSERT INTO classroom_enrollments (account_id, classroom_id, enrolled_at) VALUES
(12, 1, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(13, 1, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(14, 2, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(15, 3, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(16, 4, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(17, 5, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(18, 6, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(19, 7, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(20, 8, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(21, 9, NOW());

-- Insert Admin Logs
INSERT INTO admin_logs (admin_id, action, target_table, target_id, details) VALUES
(1, 'Teacher Approved', 'teachers', 1, '{"teacher_name": "Hiroshi Tanaka", "approval_date": "2024-03-01"}'),
(1, 'Course Published', 'courses', 1, '{"course_title": "Japanese for Beginners", "publish_date": "2024-03-05"}'),
(1, 'User Role Updated', 'accounts', 15, '{"old_role": "Learner", "new_role": "Learner", "update_reason": "Profile update"}');

-- Update course statistics
UPDATE courses SET 
    rating = ROUND(4.3 + (RAND() * 0.7), 1),
    students_count = FLOOR(RAND() * 1000) + 100
WHERE course_id > 0;

-- ==================================================
-- PERFORMANCE INDEXES
-- ==================================================
CREATE INDEX idx_accounts_email_password ON accounts(email, password_hash);
CREATE INDEX idx_courses_category_level ON courses(category_id, level);
CREATE INDEX idx_courses_rating_students ON courses(rating DESC, students_count DESC);
CREATE INDEX idx_enrollments_progress ON enrollments(account_id, progress);
CREATE INDEX idx_orders_date_status ON orders(created_at DESC, payment_status);
CREATE INDEX idx_classrooms_teacher_status ON classrooms(teacher_id, status);

-- ==================================================
-- FINAL SETTINGS
-- ==================================================
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Show completion message
SELECT 'Nihongo Sekai database setup completed successfully!' as Status,
       COUNT(*) as Total_Accounts FROM accounts
UNION ALL
SELECT 'Courses created:', COUNT(*) FROM courses
UNION ALL  
SELECT 'Classrooms created:', COUNT(*) FROM classrooms
UNION ALL
SELECT 'Teachers approved:', COUNT(*) FROM teachers;
