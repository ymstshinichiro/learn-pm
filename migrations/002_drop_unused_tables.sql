-- Drop unused tables (users and posts)
-- These tables are not used in the current implementation
-- User authentication is handled by Supabase Auth (auth.users table)

DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
