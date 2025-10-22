-- Add multiple-answer questions to existing lessons (Production version)
-- These questions require selecting multiple correct answers
-- Only adds questions to lessons that exist in production

-- PM Basic Course - Multiple Answer Question 1 (project-lifecycle exists)
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'project-lifecycle'), 'multiple-answer',
'プロジェクトライフサイクルに含まれる主要なフェーズはどれか？（複数選択）',
 ARRAY['立ち上げ', '計画', '実行', '休憩', '監視・コントロール', '終結'],
 ARRAY['立ち上げ', '計画', '実行', '監視・コントロール', '終結'],
 'プロジェクトライフサイクルの5つの主要フェーズは、立ち上げ、計画、実行、監視・コントロール、終結です。「休憩」はフェーズには含まれません。', 999);

-- PM Basic Course - Multiple Answer Question 2 (what-is-project exists)
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'what-is-project'), 'multiple-answer',
'プロジェクトの特徴として正しいものはどれか？（複数選択）',
 ARRAY['有期性（開始と終了が明確）', '独自性（ユニークな成果物）', '日常業務と同じ', '段階的詳細化', '恒久的な活動'],
 ARRAY['有期性（開始と終了が明確）', '独自性（ユニークな成果物）', '段階的詳細化'],
 'プロジェクトの主な特徴は、有期性（開始と終了が明確）、独自性（ユニークな成果物）、段階的詳細化です。日常業務や恒久的な活動とは異なります。', 999);

-- PM Advanced Course - Multiple Answer Question 1 (stakeholder-management exists)
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'stakeholder-management'), 'multiple-answer',
'ステークホルダー分析で使用される評価軸はどれか？（複数選択）',
 ARRAY['パワー（影響力）', '関心度', '年齢', '組織での地位', '態度（支持/反対）'],
 ARRAY['パワー（影響力）', '関心度', '態度（支持/反対）'],
 'ステークホルダー分析では、パワー（影響力）、関心度、態度（支持/反対）などの軸を使用します。年齢や組織での地位はパワーの一部として考慮されることはありますが、それ自体が評価軸ではありません。', 999);

-- PM Advanced Course - Multiple Answer Question 2 (risk-management exists)
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
ORDER BY l.id, q."order";
