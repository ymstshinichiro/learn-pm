-- Learning Platform Database Schema
-- Run this in Supabase SQL Editor

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'multiple-choice',
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed TIMESTAMP,
  score INTEGER,
  completed_at TIMESTAMP
);

-- Test Results table
CREATE TABLE IF NOT EXISTS test_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  answered_at TIMESTAMP DEFAULT NOW()
);

-- Sample Data: PM Basic Course
INSERT INTO courses (slug, title, category, description) VALUES
('pm-basic', 'プロジェクトマネジメント基礎', 'project-management', 'PMBOKに基づく基礎知識を学びます');

-- Lesson 1: What is a Project
INSERT INTO lessons (course_id, slug, title, content, "order") VALUES
(1, 'what-is-project', 'プロジェクトとは',
'# プロジェクトとは

プロジェクトは、**独自のプロダクト、サービス、所産を創造するために実施される有期性の業務**です。

## プロジェクトの特徴

### 1. 独自性（Uniqueness）
プロジェクトは、これまでにない新しい何かを生み出します。たとえ似たようなプロジェクトがあったとしても、場所、時期、人、環境などが異なるため、それぞれが独自のものとなります。

### 2. 有期性（Temporary）
プロジェクトには必ず開始と終了があります。永遠に続くプロジェクトはありません。

**例：**
- ✅ 新製品の開発（プロジェクト）
- ✅ イベントの企画・運営（プロジェクト）
- ❌ 日々の営業活動（定常業務）
- ❌ 顧客サポート（定常業務）

## プロジェクトと定常業務の違い

| 項目 | プロジェクト | 定常業務 |
|------|------------|---------|
| 期間 | 有期的 | 継続的 |
| 成果物 | 独自のもの | 反復的・定型的 |
| 目的 | 新しい価値の創造 | 既存の価値の維持 |

プロジェクトマネジメントは、この独自性と有期性を持つプロジェクトを成功に導くための知識とスキルです。', 1);

-- Question 1 for Lesson 1
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
(1, 'multiple-choice', 'プロジェクトの定義として正しいものはどれか？',
 ARRAY['独自性と有期性を持つ業務', '日常的な反復業務', '継続的な運用業務', '定型的な保守業務'],
 '独自性と有期性を持つ業務',
 'プロジェクトは独自性（ユニーク）と有期性（開始と終了がある）を持つ点が特徴です。日常的な反復業務や継続的な運用業務は定常業務に分類されます。', 1);

-- Question 2 for Lesson 1
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
(1, 'multiple-choice', '次のうち、プロジェクトに該当するものはどれか？',
 ARRAY['新製品の開発', '日々の顧客サポート', '定期的な在庫確認', '毎月の経理処理'],
 '新製品の開発',
 '新製品の開発は独自性（新しい製品）と有期性（開発期間がある）を持つためプロジェクトです。他の選択肢は反復的な定常業務です。', 2);

-- Lesson 2: Project Life Cycle
INSERT INTO lessons (course_id, slug, title, content, "order") VALUES
(1, 'project-lifecycle', 'プロジェクトライフサイクル',
'# プロジェクトライフサイクル

プロジェクトライフサイクルとは、プロジェクトの開始から終了までの一連のフェーズ（段階）のことです。

## 一般的なライフサイクル

プロジェクトは通常、以下のようなフェーズを経て進行します：

### 1. 立ち上げ（Initiating）
- プロジェクトの承認
- ステークホルダーの特定
- プロジェクト憲章の作成

### 2. 計画（Planning）
- スコープの定義
- スケジュール作成
- 予算計画
- リスク分析

### 3. 実行（Executing）
- 計画に基づいた作業の実施
- チーム管理
- ステークホルダーとのコミュニケーション

### 4. 監視・コントロール（Monitoring and Controlling）
- 進捗の監視
- 変更管理
- 品質管理

### 5. 終結（Closing）
- 成果物の引き渡し
- プロジェクトの振り返り
- 文書化と教訓の記録

## ライフサイクルの特徴

- **各フェーズは重複することがある**: ウォーターフォールのように順次進む場合もあれば、アジャイルのように反復する場合もあります
- **プロジェクトの種類によって異なる**: 建設プロジェクトとソフトウェア開発プロジェクトでは、ライフサイクルが異なります', 2);

-- Question 1 for Lesson 2
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
(2, 'multiple-choice', 'プロジェクトライフサイクルの最初のフェーズはどれか？',
 ARRAY['立ち上げ', '計画', '実行', '終結'],
 '立ち上げ',
 'プロジェクトライフサイクルは「立ち上げ→計画→実行→監視・コントロール→終結」の順に進みます。最初のフェーズは立ち上げです。', 1);

-- Question 2 for Lesson 2
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
(2, 'multiple-choice', 'プロジェクトの終結フェーズで行うべき活動はどれか？',
 ARRAY['成果物の引き渡しと教訓の記録', '新しい計画の作成', 'チームメンバーの採用', 'リスクの特定'],
 '成果物の引き渡しと教訓の記録',
 '終結フェーズでは、成果物を引き渡し、プロジェクトの振り返りを行い、得られた教訓を文書化します。計画作成やリスク特定は初期フェーズの活動です。', 2);

-- Verify tables were created
SELECT 'Courses' as table_name, COUNT(*) as count FROM courses
UNION ALL
SELECT 'Lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'Questions', COUNT(*) FROM questions;
