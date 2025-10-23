-- Migration: コースに公開/非公開フラグを追加
-- is_public: 0 = private (ログイン必須), 1 = public (誰でも閲覧可能)

-- 1. is_publicカラムを追加
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_public integer NOT NULL DEFAULT 0;

-- 2. 既存のコースを公開設定にする（サンプルコースとして扱う）
UPDATE courses SET is_public = 1;

-- 3. 確認
SELECT id, slug, title, is_public FROM courses;
