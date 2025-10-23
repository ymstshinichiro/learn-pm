-- Migration: UUID型への変更とユニーク制約追加
-- Phase 2: ユーザー管理機能で必要な修正

-- 1. user_progressテーブルのuser_id列をUUIDに変更
ALTER TABLE user_progress
ALTER COLUMN user_id TYPE uuid USING user_id::text::uuid;

-- 2. test_resultsテーブルのuser_id列をUUIDに変更
ALTER TABLE test_results
ALTER COLUMN user_id TYPE uuid USING user_id::text::uuid;

-- 3. user_progressにユニーク制約を追加（UPSERT用）
ALTER TABLE user_progress
ADD CONSTRAINT user_progress_user_lesson_unique
UNIQUE (user_id, lesson_id);

-- 確認
SELECT
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'user_progress'::regclass;
