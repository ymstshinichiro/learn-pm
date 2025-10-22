-- Add multiple-answer questions to existing lessons
-- These questions require selecting multiple correct answers

-- PM Basic Course - Multiple Answer Question 1
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'project-lifecycle'), 'multiple-answer',
'プロジェクトライフサイクルに含まれる主要なフェーズはどれか？（複数選択）',
 ARRAY['立ち上げ', '計画', '実行', '休憩', '監視・コントロール', '終結'],
 ARRAY['立ち上げ', '計画', '実行', '監視・コントロール', '終結'],
 'プロジェクトライフサイクルの5つの主要フェーズは、立ち上げ、計画、実行、監視・コントロール、終結です。「休憩」はフェーズには含まれません。', 999);

-- PM Basic Course - Multiple Answer Question 2
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'wbs'), 'multiple-answer',
'WBSを作成する際の重要な原則はどれか？（複数選択）',
 ARRAY['100%ルールを守る', 'できるだけ細かく分解する', '成果物ベースで構成する', '作業の順序を時系列で並べる', '担当者を明記する'],
 ARRAY['100%ルールを守る', '成果物ベースで構成する'],
 'WBSの重要な原則は「100%ルール」（すべての作業を含む）と「成果物ベースの構成」です。細かすぎる分解や時系列は推奨されず、担当者はWBSではなくRACI図などで明記します。', 999);

-- PM Advanced Course - Multiple Answer Question 1
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'stakeholder-management'), 'multiple-answer',
'ステークホルダー分析で使用される評価軸はどれか？（複数選択）',
 ARRAY['パワー（影響力）', '関心度', '年齢', '組織での地位', '態度（支持/反対）'],
 ARRAY['パワー（影響力）', '関心度', '態度（支持/反対）'],
 'ステークホルダー分析では、パワー（影響力）、関心度、態度（支持/反対）などの軸を使用します。年齢や組織での地位はパワーの一部として考慮されることはありますが、それ自体が評価軸ではありません。', 999);

-- PM Advanced Course - Multiple Answer Question 2
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'risk-management'), 'multiple-answer',
'ネガティブリスクに対する対応戦略として正しいものはどれか？（複数選択）',
 ARRAY['回避', '転嫁', '軽減', '受容', '活用', '共有'],
 ARRAY['回避', '転嫁', '軽減', '受容'],
 'ネガティブリスク（脅威）の対応戦略は、回避、転嫁、軽減、受容の4つです。活用と共有はポジティブリスク（機会）に対する戦略です。', 999);

-- Verify
SELECT
    l.title as lesson_title,
    q.type,
    q.question,
    array_length(q.correct_answer, 1) as correct_answer_count
FROM questions q
JOIN lessons l ON q.lesson_id = l.id
WHERE q.type = 'multiple-answer'
ORDER BY l.id, q.order;
