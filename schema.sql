-- =============================================
-- MentorHub Database Schema
-- Run this in PostgreSQL to set up the database
-- =============================================

CREATE DATABASE mentor_platform;

-- Connect to the database before running the rest:
-- \c mentor_platform

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('mentor', 'mentee')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  subject VARCHAR(100),
  difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  deadline DATE,
  session_id INTEGER REFERENCES sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  mentee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
