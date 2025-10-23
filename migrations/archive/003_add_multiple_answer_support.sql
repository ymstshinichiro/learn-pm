-- Migration: 複数選択式問題のサポート
-- correct_answerカラムをtext[]（配列）に変更

-- 1. 既存データを一時的に保存
ALTER TABLE questions ADD COLUMN correct_answer_temp text[];

-- 2. 既存の単一回答をtext配列に変換
UPDATE questions SET correct_answer_temp = ARRAY[correct_answer];

-- 3. 古いカラムを削除
ALTER TABLE questions DROP COLUMN correct_answer;

-- 4. 新しいカラムを作成
ALTER TABLE questions ADD COLUMN correct_answer text[] NOT NULL DEFAULT '{}';

-- 5. データを戻す
UPDATE questions SET correct_answer = correct_answer_temp;

-- 6. 一時カラムを削除
ALTER TABLE questions DROP COLUMN correct_answer_temp;

-- 確認
SELECT
    id,
    question,
    type,
    correct_answer,
    array_length(correct_answer, 1) as answer_count
FROM questions
LIMIT 5;
