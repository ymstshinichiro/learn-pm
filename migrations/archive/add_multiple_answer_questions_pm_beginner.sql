-- pm-beginnerコースに複数選択問題を追加
-- 各レッスンに1問ずつ、ひっかけ要素を含む問題を追加

DO $$
DECLARE
  v_course_id INT;
  v_lesson_id INT;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'pm-beginner';

  -- Lesson 1: プロジェクトとは何か
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'what-is-project';
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'プロジェクトの特徴として正しいものを全て選びなさい。',
    ARRAY['有期性（明確な開始と終了がある）', '独自性（ユニークな成果物を生み出す）', '反復性（同じ作業を繰り返す）', '段階的詳細化（徐々に詳細を決めていく）', '恒久的な組織体制'],
    ARRAY['有期性（明確な開始と終了がある）', '独自性（ユニークな成果物を生み出す）', '段階的詳細化（徐々に詳細を決めていく）'],
    'プロジェクトの主な特徴は、有期性（開始と終了が明確）、独自性（ユニークな成果物）、段階的詳細化です。反復性は定常業務の特徴であり、プロジェクトは一時的なものなので恒久的な組織体制は持ちません。',
    999,
    NOW()
  );

  -- Lesson 2: プロジェクトマネージャーの役割
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'pm-role';
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'プロジェクトマネージャーが管理すべき主要な制約として正しいものを全て選びなさい。',
    ARRAY['スコープ（範囲）', 'スケジュール（時間）', 'コスト（予算）', '人気度', '品質', '株価'],
    ARRAY['スコープ（範囲）', 'スケジュール（時間）', 'コスト（予算）', '品質'],
    'プロジェクトマネジメントの主要な制約は、スコープ、スケジュール、コストの三大制約に品質を加えた四要素です。人気度や株価は企業全体の指標であり、PMが直接管理する制約ではありません。',
    999,
    NOW()
  );

  -- Lesson 3: プロジェクトライフサイクル
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'project-lifecycle';
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'PMBOKで定義されているプロセス群として正しいものを全て選びなさい。',
    ARRAY['立上げプロセス群', '計画プロセス群', '実行プロセス群', '監視・コントロールプロセス群', '終結プロセス群', '改善プロセス群', '評価プロセス群'],
    ARRAY['立上げプロセス群', '計画プロセス群', '実行プロセス群', '監視・コントロールプロセス群', '終結プロセス群'],
    'PMBOKでは5つのプロセス群が定義されています：立上げ、計画、実行、監視・コントロール、終結。改善や評価は各プロセスに含まれる活動ですが、独立したプロセス群ではありません。',
    999,
    NOW()
  );

  -- Lesson 4: プロジェクト立上げと憲章
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'project-charter';
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'プロジェクト憲章に含めるべき内容として正しいものを全て選びなさい。',
    ARRAY['プロジェクトの目的と正当性', 'プロジェクトマネージャーの任命と権限', '主要なステークホルダーのリスト', '詳細なスケジュールとガントチャート', 'ハイレベルな要求事項', '各タスクの担当者割り当て'],
    ARRAY['プロジェクトの目的と正当性', 'プロジェクトマネージャーの任命と権限', '主要なステークホルダーのリスト', 'ハイレベルな要求事項'],
    'プロジェクト憲章は立上げフェーズの文書で、目的、PMの任命、主要ステークホルダー、ハイレベルな要求事項などを含みます。詳細なスケジュールやタスク割り当ては計画フェーズで作成するため、憲章には含まれません。',
    999,
    NOW()
  );

  -- Lesson 5: スコープとWBS
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'scope-and-wbs';
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'WBS（Work Breakdown Structure）の特徴として正しいものを全て選びなさい。',
    ARRAY['作業を階層的に分解する', '最下層はワークパッケージと呼ばれる', '100%ルールに従う（親の合計=子の合計）', 'スケジュールの順序を示す', '成果物指向の分解構造である', '担当者の組織図を表す'],
    ARRAY['作業を階層的に分解する', '最下層はワークパッケージと呼ばれる', '100%ルールに従う（親の合計=子の合計）', '成果物指向の分解構造である'],
    'WBSは作業を成果物指向で階層的に分解し、最下層はワークパッケージと呼ばれます。100%ルール（親の範囲=全ての子の合計）に従います。ただし、WBSは作業の順序や担当者の組織図を示すものではありません。それらはスケジュールや組織図（OBS）で表現します。',
    999,
    NOW()
  );

  -- Lesson 6: スケジュール管理の基本
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'schedule-management';
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'クリティカルパスの特徴として正しいものを全て選びなさい。',
    ARRAY['プロジェクトで最も長い作業経路である', 'フロート（余裕時間）がゼロである', 'クリティカルパス上の遅延は必ずプロジェクト全体の遅延につながる', '最もコストがかかる作業経路である', 'クリティカルパスは常に1つだけ存在する', '短縮するとプロジェクト期間が短縮される'],
    ARRAY['プロジェクトで最も長い作業経路である', 'フロート（余裕時間）がゼロである', 'クリティカルパス上の遅延は必ずプロジェクト全体の遅延につながる', '短縮するとプロジェクト期間が短縮される'],
    'クリティカルパスは最も長い作業経路で、フロートがゼロです。この経路の遅延はプロジェクト全体の遅延に直結し、短縮すれば全体期間も短縮されます。ただし、最もコストが高い経路とは限らず、複数のクリティカルパスが存在することもあります。',
    999,
    NOW()
  );

  -- Lesson 7: リスクマネジメント入門
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'risk-management-basics';
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'ネガティブリスク（脅威）に対する対応戦略として正しいものを全て選びなさい。',
    ARRAY['回避（Avoid）', '転嫁（Transfer）', '軽減（Mitigate）', '受容（Accept）', '活用（Exploit）', '強化（Enhance）', '共有（Share）'],
    ARRAY['回避（Avoid）', '転嫁（Transfer）', '軽減（Mitigate）', '受容（Accept）'],
    'ネガティブリスク（脅威）の対応戦略は、回避、転嫁、軽減、受容の4つです。活用（Exploit）、強化（Enhance）、共有（Share）はポジティブリスク（機会）に対する戦略です。これらを混同しないよう注意が必要です。',
    999,
    NOW()
  );

  -- Lesson 8: チームマネジメントの基礎
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'team-management';
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'タックマンモデルのチーム発達段階として正しいものを全て選びなさい。',
    ARRAY['形成期（Forming）', '混乱期（Storming）', '統一期（Norming）', '機能期（Performing）', '散会期（Adjourning）', '成熟期（Maturing）', '安定期（Stabilizing）'],
    ARRAY['形成期（Forming）', '混乱期（Storming）', '統一期（Norming）', '機能期（Performing）', '散会期（Adjourning）'],
    'タックマンモデルは5段階で構成されます：形成期（Forming）、混乱期（Storming）、統一期（Norming）、機能期（Performing）、散会期（Adjourning）。成熟期や安定期という段階は存在しません。',
    999,
    NOW()
  );

  -- Lesson 9: コミュニケーションマネジメント
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'communication-management';
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'プロジェクトにおける効果的なコミュニケーション方法として正しいものを全て選びなさい。',
    ARRAY['プッシュ型（メール、報告書など）', 'プル型（ポータル、共有フォルダなど）', 'インタラクティブ型（会議、電話など）', 'パッシブ型（掲示板への投稿のみ）', '一方向型（指示のみで質問を受け付けない）'],
    ARRAY['プッシュ型（メール、報告書など）', 'プル型（ポータル、共有フォルダなど）', 'インタラクティブ型（会議、電話など）'],
    'PMBOKでは3種類のコミュニケーション方法が定義されています：プッシュ型（送信者が受信者に送る）、プル型（受信者が必要に応じて取得）、インタラクティブ型（双方向の対話）。パッシブ型や一方向型は効果的なコミュニケーション方法として定義されていません。',
    999,
    NOW()
  );

  -- Lesson 10: プロジェクト終結と振り返り
  SELECT id INTO v_lesson_id FROM lessons WHERE course_id = v_course_id AND slug = 'project-closure';
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES (
    v_lesson_id,
    'multiple-answer',
    'プロジェクト終結フェーズで実施すべき活動として正しいものを全て選びなさい。',
    ARRAY['成果物の正式な引き渡しと承認', 'プロジェクト文書のアーカイブ', '契約の完了処理', '教訓（Lessons Learned）の文書化', 'チームメンバーの解散', '次のプロジェクトの詳細計画策定', '新しいステークホルダーの特定'],
    ARRAY['成果物の正式な引き渡しと承認', 'プロジェクト文書のアーカイブ', '契約の完了処理', '教訓（Lessons Learned）の文書化', 'チームメンバーの解散'],
    '終結フェーズでは、成果物の引き渡し、文書のアーカイブ、契約完了、教訓の文書化、チーム解散を行います。次のプロジェクトの詳細計画策定や新しいステークホルダー特定は、次のプロジェクトの立上げ・計画フェーズで行う活動です。',
    999,
    NOW()
  );

END $$;
