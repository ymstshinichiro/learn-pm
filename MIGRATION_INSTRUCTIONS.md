# Database Migration Instructions

## Overview
This guide will help you migrate your databases (both local and Supabase production) to support multiple-answer questions.

## What Changed
- `questions.correct_answer` column changed from `text` to `text[]` (array)
- Added `questions.type` field to distinguish between 'multiple-choice' and 'multiple-answer'
- Added sample multiple-answer questions to test the feature

## Migration Steps

### 1. Local Database (Docker)

Run these commands in order:

```bash
# Connect to the local database
docker-compose exec db psql -U postgres -d learnpm

# Then run these SQL commands in order:
```

**Step 1: Run migration 003**
```sql
\i /docker-entrypoint-initdb.d/003_add_multiple_answer_support.sql
```

**Step 2: Add type field to questions table**
```sql
-- Check if type column exists
SELECT column_name FROM information_schema.columns
WHERE table_name = 'questions' AND column_name = 'type';

-- If it doesn't exist, add it:
ALTER TABLE questions ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'multiple-choice';
```

**Step 3: Add multiple-answer sample questions**
```sql
\i /docker-entrypoint-initdb.d/seed_multiple_answer_questions.sql
```

**Step 4: Verify**
```sql
-- Check the schema
\d questions

-- Check the data
SELECT id, type, question, correct_answer, array_length(correct_answer, 1) as answer_count
FROM questions
ORDER BY id DESC
LIMIT 5;

-- Exit
\q
```

### 2. Supabase Production Database

Go to your Supabase project: https://supabase.com/dashboard/project/_/sql

**Step 1: Run migration 003**

Copy and paste the contents of `migrations/003_add_multiple_answer_support.sql`:

```sql
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
```

Click "Run" button.

**Step 2: Add type field (if needed)**

```sql
-- Check if type column exists
SELECT column_name FROM information_schema.columns
WHERE table_name = 'questions' AND column_name = 'type';

-- If it doesn't exist, add it:
ALTER TABLE questions ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'multiple-choice';
```

Click "Run" button.

**Step 3: Add multiple-answer sample questions**

Copy and paste the contents of `migrations/seed_multiple_answer_questions.sql` and click "Run".

**Step 4: Verify**

```sql
-- Check the data
SELECT
    l.title as lesson_title,
    q.type,
    q.question,
    array_length(q.correct_answer, 1) as correct_answer_count
FROM questions q
JOIN lessons l ON q.lesson_id = l.id
WHERE q.type = 'multiple-answer'
ORDER BY l.id, q."order";
```

You should see 4 new multiple-answer questions.

## Expected Results

After migration, you should have:
- All existing questions with `type = 'multiple-choice'` and `correct_answer` as an array with 1 element
- 4 new questions with `type = 'multiple-answer'` with 2-5 correct answers each:
  - PM Basic - Project Lifecycle (5 correct answers)
  - PM Basic - WBS (2 correct answers)
  - PM Advanced - Stakeholder Management (3 correct answers)
  - PM Advanced - Risk Management (4 correct answers)

## Testing

After migration:
1. Restart the Docker container: `docker-compose restart app`
2. Access a lesson with the new questions
3. Test both question types:
   - Single-choice: Can only select one answer (circular radio buttons)
   - Multiple-answer: Can select multiple answers (square checkboxes) with badge "複数選択（正しいものをすべて選んでください）"

## Rollback (If Needed)

If something goes wrong, you can rollback by:

```sql
-- Convert array back to single text
ALTER TABLE questions ADD COLUMN correct_answer_temp text;
UPDATE questions SET correct_answer_temp = correct_answer[1];
ALTER TABLE questions DROP COLUMN correct_answer;
ALTER TABLE questions RENAME COLUMN correct_answer_temp TO correct_answer;

-- Remove multiple-answer questions
DELETE FROM questions WHERE type = 'multiple-answer';
```

## Troubleshooting

**Error: "column correct_answer does not exist"**
- The migration already ran. Check with `\d questions` to see the schema.

**Error: "duplicate key value violates unique constraint"**
- The sample data already exists. Skip the seed step.

**Questions not showing checkbox style**
- Clear browser cache and hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check browser console for errors

**Correct answers not being validated properly**
- Check that `correct_answer` is an array with multiple elements
- Verify the QuizSection component is using the updated code
