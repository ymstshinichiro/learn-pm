import { pgTable, serial, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

// Note: User authentication is managed by Supabase Auth (auth.users table)
// User info (id, email, name) is stored in Supabase Auth, not in this database

// Learning platform tables
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  isPublic: integer('is_public').notNull().default(0), // 0 = private, 1 = public (sample)
  createdAt: timestamp('created_at').defaultNow(),
});

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull().default('multiple-choice'), // 'multiple-choice', 'multiple-answer', 'true-false', etc.
  question: text('question').notNull(),
  options: text('options').array().notNull(), // Array of choice options
  correctAnswer: text('correct_answer').array().notNull(), // Array for multiple correct answers
  explanation: text('explanation'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Progress tracking tables
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(), // Supabase Auth uses UUID
  lessonId: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  completed: timestamp('completed'),
  score: integer('score'),
  completedAt: timestamp('completed_at'),
});

export const testResults = pgTable('test_results', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(), // Supabase Auth uses UUID
  questionId: integer('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  userAnswer: text('user_answer').notNull(),
  isCorrect: integer('is_correct').notNull(), // 0 or 1 (boolean as integer)
  answeredAt: timestamp('answered_at').defaultNow(),
});
