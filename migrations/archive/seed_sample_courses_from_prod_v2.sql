-- Sample courses seed file (pm-basic, pm-advanced)
-- Extracted from production database
-- Version 2: Handles existing data properly

-- First, update pm-basic to be public and add pm-advanced if it doesn't exist
INSERT INTO courses (slug, title, category, description, is_public, created_at)
VALUES
  ('pm-basic', 'プロジェクトマネジメント基礎', 'project-management', 'PMBOKに基づく基礎知識を学びます', 1, '2025-10-22 05:15:43.8724'),
  ('pm-advanced', 'プロジェクトマネジメント応用', 'project-management', 'ステークホルダー管理とリスクマネジメントを学びます', 1, '2025-10-22 06:47:50.58125')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  is_public = EXCLUDED.is_public;

-- Get the course IDs for pm-basic and pm-advanced
DO $$
DECLARE
  pm_basic_id INTEGER;
  pm_advanced_id INTEGER;
BEGIN
  SELECT id INTO pm_basic_id FROM courses WHERE slug = 'pm-basic';
  SELECT id INTO pm_advanced_id FROM courses WHERE slug = 'pm-advanced';

  -- Insert lessons for pm-basic (should already exist, but update if needed)
  INSERT INTO lessons (course_id, slug, title, content, "order", created_at)
  VALUES
    (pm_basic_id, 'what-is-project', 'プロジェクトとは', '# プロジェクトとは

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

プロジェクトマネジメントは、この独自性と有期性を持つプロジェクトを成功に導くための知識とスキルです。', 1, '2025-10-22 05:15:43.8724'),
    (pm_basic_id, 'project-lifecycle', 'プロジェクトライフサイクル', '# プロジェクトライフサイクル

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
- **プロジェクトの種類によって異なる**: 建設プロジェクトとソフトウェア開発プロジェクトでは、ライフサイクルが異なります', 2, '2025-10-22 05:15:43.8724')
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    "order" = EXCLUDED."order";

  -- Insert lessons for pm-advanced
  INSERT INTO lessons (course_id, slug, title, content, "order", created_at)
  VALUES
    (pm_advanced_id, 'stakeholder-management', 'ステークホルダーマネジメント', '# ステークホルダーマネジメント

ステークホルダーマネジメントは、プロジェクトに影響を与える、または影響を受けるすべての個人や組織を特定し、関与させるプロセスです。

## ステークホルダーとは

プロジェクトに対して：
- **影響を与える人・組織**：意思決定者、スポンサー、チームメンバー
- **影響を受ける人・組織**：エンドユーザー、顧客、地域住民

## ステークホルダー分析

### パワー/関心グリッド

| パワー/関心 | 低関心 | 高関心 |
|-----------|--------|--------|
| **高パワー** | 満足させる | 重点的に管理 |
| **低パワー** | 監視 | 情報提供 |

### 対応戦略

**重点的に管理（高パワー × 高関心）**
- 定期的なコミュニケーション
- 意思決定への参加
- 懸念事項への迅速な対応

**満足させる（高パワー × 低関心）**
- 定期的な報告
- 重要な決定事項の共有
- 過度な負担をかけない

**情報提供（低パワー × 高関心）**
- 適切な情報提供
- 期待値の管理
- フィードバックの収集

**監視（低パワー × 低関心）**
- 最小限の対応
- 状況変化の監視

## エンゲージメント計画

ステークホルダーごとに：
1. **現在のエンゲージメントレベル**を評価
2. **望ましいエンゲージメントレベル**を設定
3. **ギャップを埋める戦略**を立案', 1, '2025-10-22 06:47:50.58125'),
    (pm_advanced_id, 'risk-management', 'リスクマネジメント', '# リスクマネジメント

リスクマネジメントは、プロジェクトに影響を与える可能性のある不確実な事象を特定し、分析し、対応するプロセスです。

## リスクとは

- **定義**：発生すると、プロジェクトの目標に肯定的または否定的な影響を与える不確実な事象や状態
- **脅威**（ネガティブリスク）：悪影響を与える可能性
- **機会**（ポジティブリスク）：良い影響を与える可能性

## リスクマネジメントプロセス

### 1. リスク特定
- ブレインストーミング
- チェックリスト分析
- 過去プロジェクトからの教訓

### 2. リスク分析

**定性的分析**
- 発生確率：高/中/低
- 影響度：高/中/低
- 優先度 = 発生確率 × 影響度

**定量的分析**
- 期待金額価値（EMV）
- モンテカルロシミュレーション

### 3. リスク対応計画

| 対応戦略 | 説明 | 例 |
|---------|------|-----|
| **回避** | リスクの原因を排除 | 不確実な技術を使わない |
| **転嫁** | 第三者にリスクを移す | 保険、外注 |
| **軽減** | 影響を減らす | バックアップ、テスト |
| **受容** | リスクを認識して受け入れる | コンティンジェンシー予備 |

### 4. リスク監視
- 定期的なリスクレビュー
- リスク登録簿の更新
- 新規リスクの特定

## リスク登録簿

各リスクについて記録：
- リスクの説明
- 発生確率
- 影響度
- 対応戦略
- 担当者
- ステータス', 2, '2025-10-22 06:47:50.58125')
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    "order" = EXCLUDED."order";

  -- Get lesson IDs for questions
  DECLARE
    lesson_what_is_project_id INTEGER;
    lesson_project_lifecycle_id INTEGER;
    lesson_stakeholder_id INTEGER;
    lesson_risk_id INTEGER;
  BEGIN
    SELECT id INTO lesson_what_is_project_id FROM lessons WHERE course_id = pm_basic_id AND slug = 'what-is-project';
    SELECT id INTO lesson_project_lifecycle_id FROM lessons WHERE course_id = pm_basic_id AND slug = 'project-lifecycle';
    SELECT id INTO lesson_stakeholder_id FROM lessons WHERE course_id = pm_advanced_id AND slug = 'stakeholder-management';
    SELECT id INTO lesson_risk_id FROM lessons WHERE course_id = pm_advanced_id AND slug = 'risk-management';

    -- Insert questions for lesson 1 (what-is-project)
    INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
    VALUES
      (lesson_what_is_project_id, 'multiple-choice', 'プロジェクトの定義として正しいものはどれか？',
       ARRAY['独自性と有期性を持つ業務','日常的な反復業務','継続的な運用業務','定型的な保守業務'],
       ARRAY['独自性と有期性を持つ業務'],
       'プロジェクトは独自性（ユニーク）と有期性（開始と終了がある）を持つ点が特徴です。日常的な反復業務や継続的な運用業務は定常業務に分類されます。',
       1, '2025-10-22 05:15:43.8724'),
      (lesson_what_is_project_id, 'multiple-choice', '次のうち、プロジェクトに該当するものはどれか？',
       ARRAY['新製品の開発','日々の顧客サポート','定期的な在庫確認','毎月の経理処理'],
       ARRAY['新製品の開発'],
       '新製品の開発は独自性（新しい製品）と有期性（開発期間がある）を持つためプロジェクトです。他の選択肢は反復的な定常業務です。',
       2, '2025-10-22 05:15:43.8724'),
      (lesson_what_is_project_id, 'multiple-answer', 'プロジェクトの特徴として正しいものはどれか？（複数選択）',
       ARRAY['有期性（開始と終了が明確）','独自性（ユニークな成果物）','日常業務と同じ','段階的詳細化','恒久的な活動'],
       ARRAY['有期性（開始と終了が明確）','独自性（ユニークな成果物）','段階的詳細化'],
       'プロジェクトの主な特徴は、有期性（開始と終了が明確）、独自性（ユニークな成果物）、段階的詳細化です。日常業務や恒久的な活動とは異なります。',
       999, '2025-10-22 14:48:15.22086')
    ON CONFLICT (lesson_id, "order") DO UPDATE SET
      type = EXCLUDED.type,
      question = EXCLUDED.question,
      options = EXCLUDED.options,
      correct_answer = EXCLUDED.correct_answer,
      explanation = EXCLUDED.explanation;

    -- Insert questions for lesson 2 (project-lifecycle)
    INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
    VALUES
      (lesson_project_lifecycle_id, 'multiple-choice', 'プロジェクトライフサイクルの最初のフェーズはどれか？',
       ARRAY['立ち上げ','計画','実行','終結'],
       ARRAY['立ち上げ'],
       'プロジェクトライフサイクルは「立ち上げ→計画→実行→監視・コントロール→終結」の順に進みます。最初のフェーズは立ち上げです。',
       1, '2025-10-22 05:15:43.8724'),
      (lesson_project_lifecycle_id, 'multiple-choice', 'プロジェクトの終結フェーズで行うべき活動はどれか？',
       ARRAY['成果物の引き渡しと教訓の記録','新しい計画の作成','チームメンバーの採用','リスクの特定'],
       ARRAY['成果物の引き渡しと教訓の記録'],
       '終結フェーズでは、成果物を引き渡し、プロジェクトの振り返りを行い、得られた教訓を文書化します。計画作成やリスク特定は初期フェーズの活動です。',
       2, '2025-10-22 05:15:43.8724'),
      (lesson_project_lifecycle_id, 'multiple-answer', 'プロジェクトライフサイクルに含まれる主要なフェーズはどれか？（複数選択）',
       ARRAY['立ち上げ','計画','実行','休憩','監視・コントロール','終結'],
       ARRAY['立ち上げ','計画','実行','監視・コントロール','終結'],
       'プロジェクトライフサイクルの5つの主要フェーズは、立ち上げ、計画、実行、監視・コントロール、終結です。「休憩」はフェーズには含まれません。',
       999, '2025-10-22 14:48:15.22086')
    ON CONFLICT (lesson_id, "order") DO UPDATE SET
      type = EXCLUDED.type,
      question = EXCLUDED.question,
      options = EXCLUDED.options,
      correct_answer = EXCLUDED.correct_answer,
      explanation = EXCLUDED.explanation;

    -- Insert questions for lesson 3 (stakeholder-management)
    INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
    VALUES
      (lesson_stakeholder_id, 'multiple-choice', '高パワー・高関心のステークホルダーに対する適切な対応はどれか？',
       ARRAY['監視のみ行う','最小限の情報提供','重点的に管理し定期的にコミュニケーション','報告書を送付するのみ'],
       ARRAY['重点的に管理し定期的にコミュニケーション'],
       '高パワー・高関心のステークホルダーは、プロジェクトに最も影響力があり関心も高いため、重点的に管理し、定期的なコミュニケーションと意思決定への参加が必要です。',
       1, '2025-10-22 06:47:50.58125'),
      (lesson_stakeholder_id, 'multiple-choice', 'ステークホルダーマネジメントの主な目的はどれか？',
       ARRAY['プロジェクトコストを削減する','プロジェクトに影響を与える人々を特定し適切に関与させる','スケジュールを短縮する','チームメンバーを増やす'],
       ARRAY['プロジェクトに影響を与える人々を特定し適切に関与させる'],
       'ステークホルダーマネジメントの目的は、プロジェクトに影響を与える、または影響を受ける人々を特定し、適切に関与させることで、プロジェクトの成功確率を高めることです。',
       2, '2025-10-22 06:47:50.58125'),
      (lesson_stakeholder_id, 'multiple-answer', 'ステークホルダー分析で使用される評価軸はどれか？（複数選択）',
       ARRAY['パワー（影響力）','関心度','年齢','組織での地位','態度（支持/反対）'],
       ARRAY['パワー（影響力）','関心度','態度（支持/反対）'],
       'ステークホルダー分析では、パワー（影響力）、関心度、態度（支持/反対）などの軸を使用します。年齢や組織での地位はパワーの一部として考慮されることはありますが、それ自体が評価軸ではありません。',
       999, '2025-10-22 14:48:15.22086')
    ON CONFLICT (lesson_id, "order") DO UPDATE SET
      type = EXCLUDED.type,
      question = EXCLUDED.question,
      options = EXCLUDED.options,
      correct_answer = EXCLUDED.correct_answer,
      explanation = EXCLUDED.explanation;

    -- Insert questions for lesson 4 (risk-management)
    INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
    VALUES
      (lesson_risk_id, 'multiple-choice', 'プロジェクトで使用予定の新技術が不確実なため、その技術を使わないことにした。これはどのリスク対応戦略か？',
       ARRAY['回避','転嫁','軽減','受容'],
       ARRAY['回避'],
       '回避戦略は、リスクの原因そのものを排除することです。不確実な技術を使わないという選択は、そのリスクを完全に回避しています。',
       1, '2025-10-22 06:47:50.58125'),
      (lesson_risk_id, 'multiple-choice', 'リスク分析において、発生確率と影響度を掛け合わせて算出するものはどれか？',
       ARRAY['コスト','優先度','スケジュール','品質'],
       ARRAY['優先度'],
       'リスクの優先度は、発生確率と影響度を掛け合わせて算出されます。これにより、どのリスクに優先的に対応すべきかを判断できます。',
       2, '2025-10-22 06:47:50.58125'),
      (lesson_risk_id, 'multiple-answer', 'ネガティブリスクに対する対応戦略として正しいものはどれか？（複数選択）',
       ARRAY['回避','転嫁','軽減','受容','活用','共有'],
       ARRAY['回避','転嫁','軽減','受容'],
       'ネガティブリスク（脅威）の対応戦略は、回避、転嫁、軽減、受容の4つです。活用と共有はポジティブリスク（機会）に対する戦略です。',
       999, '2025-10-22 14:48:15.22086')
    ON CONFLICT (lesson_id, "order") DO UPDATE SET
      type = EXCLUDED.type,
      question = EXCLUDED.question,
      options = EXCLUDED.options,
      correct_answer = EXCLUDED.correct_answer,
      explanation = EXCLUDED.explanation;
  END;
END $$;
