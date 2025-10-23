-- Consolidated migration file: Create all tables
-- This replaces all previous migration files

-- Drop all tables if they exist (for clean setup)
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table (legacy)
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    user_id SERIAL NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    is_public INTEGER NOT NULL DEFAULT 0,  -- 0 = private, 1 = public
    created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'multiple-choice',
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer TEXT[] NOT NULL DEFAULT '{}',
    explanation TEXT,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User progress table (uses UUID for Supabase auth)
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed TIMESTAMP,
    score INTEGER,
    completed_at TIMESTAMP,
    UNIQUE (user_id, lesson_id)
);

-- Test results table (uses UUID for Supabase auth)
CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    is_correct INTEGER NOT NULL,
    answered_at TIMESTAMP DEFAULT NOW()
);
