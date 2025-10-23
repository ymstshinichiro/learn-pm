-- Add multiple-answer questions to PM Beginner course

DO $$
DECLARE
  v_course_id INT;
  v_lesson_id INT;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'pm-beginner';

  -- Lesson 2: プロジェクトマネージャーの役割
  -- Update existing question to multiple-answer
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'pm-role';

  UPDATE questions
  SET
    type = 'multiple-answer',
    question = 'プロジェクトマネージャーが管理すべき要素として正しいものを全て選択してください。',
    options = ARRAY['スコープ（範囲）', 'コスト（予算）', 'スケジュール（時間）', '人事評価'],
    correct_answer = ARRAY['スコープ（範囲）', 'コスト（予算）', 'スケジュール（時間）'],
    explanation = 'プロジェクトマネジメントの三大制約は、スコープ・コスト・スケジュールです。人事評価は人事部門の役割であり、PMの直接的な管理対象ではありません。これに品質を加えた4要素の管理がPMの基本です。'
  WHERE lesson_id = v_lesson_id AND question LIKE '%重視すべきバランス%';

  -- Lesson 3: プロジェクトライフサイクル
  -- Update existing question to multiple-answer
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'project-lifecycle';

  UPDATE questions
  SET
    type = 'multiple-answer',
    question = '終結プロセスで行うべき活動として正しいものを全て選択してください。',
    options = ARRAY['成果物の正式な承認', '教訓の文書化', 'WBSの作成', '契約のクローズ'],
    correct_answer = ARRAY['成果物の正式な承認', '教訓の文書化', '契約のクローズ'],
    explanation = '終結プロセスでは、成果物の承認、契約の完了、教訓（Lessons Learned）の文書化を行います。WBSの作成は計画プロセスで行う活動です。'
  WHERE lesson_id = v_lesson_id AND question LIKE '%終結プロセスで行うべき%';

  -- Lesson 4: プロジェクト立上げと憲章
  -- Update existing question to multiple-answer
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'project-charter';

  UPDATE questions
  SET
    type = 'multiple-answer',
    question = 'プロジェクト憲章に含まれる要素として正しいものを全て選択してください。',
    options = ARRAY['プロジェクトの目的', '成功基準', '詳細なWBS', '主要なステークホルダー'],
    correct_answer = ARRAY['プロジェクトの目的', '成功基準', '主要なステークホルダー'],
    explanation = 'プロジェクト憲章はハイレベルな文書であり、目的、成功基準、主要なステークホルダー、概算予算などを含みます。詳細なWBSは計画フェーズで作成する詳細な文書です。'
  WHERE lesson_id = v_lesson_id AND question LIKE '%憲章に含まれる要素%';

  -- Lesson 7: リスクマネジメント入門
  -- Add new multiple-answer question
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'risk-management-basics';

  -- First, delete the third single-choice question
  DELETE FROM questions
  WHERE lesson_id = v_lesson_id AND question LIKE '%リスク登録簿に含まれる%';

  -- Add new multiple-answer question
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'リスク対応の戦略として正しいものを全て選択してください。',
    ARRAY['回避（リスクを完全に排除）', '転嫁（第三者に移転）', '軽減（影響を減らす）', '無視（何もしない）'],
    ARRAY['回避（リスクを完全に排除）', '転嫁（第三者に移転）', '軽減（影響を減らす）'],
    'リスク対応の4つの戦略は、回避・転嫁・軽減・受容です。「無視」は戦略ではありません。受容は対策を講じないという判断ですが、発生時の対応は準備します。',
    3,
    NOW()
  );

  -- Lesson 8: チームマネジメントの基礎
  -- Update existing question to multiple-answer
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'team-management';

  UPDATE questions
  SET
    type = 'multiple-answer',
    question = '高いパフォーマンスを発揮するチームに必要な要素を全て選択してください。',
    options = ARRAY['明確な共通目標', 'メンバー間の信頼', '厳格な命令と服従', 'オープンなコミュニケーション'],
    correct_answer = ARRAY['明確な共通目標', 'メンバー間の信頼', 'オープンなコミュニケーション'],
    explanation = '高パフォーマンスチームには、共通の目標、信頼、オープンなコミュニケーション、協力が必要です。一方的な命令と服従は、メンバーの主体性を奪い、パフォーマンスを低下させます。'
  WHERE lesson_id = v_lesson_id AND question LIKE '%高いパフォーマンス%';

  -- Lesson 9: コミュニケーションマネジメント
  -- Update existing question to multiple-answer
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'communication-management';

  UPDATE questions
  SET
    type = 'multiple-answer',
    question = '効果的な会議運営に必要な要素を全て選択してください。',
    options = ARRAY['議題を事前に共有する', '開始・終了時刻を明示する', '時間を気にせず進める', '議事録を取る'],
    correct_answer = ARRAY['議題を事前に共有する', '開始・終了時刻を明示する', '議事録を取る'],
    explanation = '効果的な会議には、明確な議題、事前の資料共有、時間管理、議事録の作成が重要です。時間を気にせず進めると、会議が長引き、参加者の生産性を損ないます。'
  WHERE lesson_id = v_lesson_id AND question LIKE '%効果的な会議%';

  -- Lesson 10: プロジェクト終結と振り返り
  -- Update existing question to multiple-answer
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'project-closure';

  UPDATE questions
  SET
    type = 'multiple-answer',
    question = '終結時に行うべき活動として正しいものを全て選択してください。',
    options = ARRAY['成果物の承認', '教訓の記録', 'WBSの初期作成', '関係者との最終報告'],
    correct_answer = ARRAY['成果物の承認', '教訓の記録', '関係者との最終報告'],
    explanation = '終結プロセスでは、成果物の承認、最終報告、教訓の整理を行います。WBSの作成は計画プロセスで行う活動であり、終結時には行いません。'
  WHERE lesson_id = v_lesson_id AND question LIKE '%終結時に行うべき活動として不適切%';

END $$;
