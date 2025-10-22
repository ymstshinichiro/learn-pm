-- PM Advanced Course Seed Data
-- Project Management Advanced Topics

-- PM Advanced Course
INSERT INTO courses (slug, title, category, description) VALUES
('pm-advanced', 'プロジェクトマネジメント応用', 'project-management', 'ステークホルダー管理とリスクマネジメントを学びます');

-- Lesson 1: Stakeholder Management
INSERT INTO lessons (course_id, slug, title, content, "order") VALUES
((SELECT id FROM courses WHERE slug = 'pm-advanced'), 'stakeholder-management', 'ステークホルダーマネジメント',
'# ステークホルダーマネジメント

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
3. **ギャップを埋める戦略**を立案', 1);

-- Questions for Lesson 1
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'stakeholder-management'), 'multiple-choice',
'高パワー・高関心のステークホルダーに対する適切な対応はどれか？',
 ARRAY['監視のみ行う', '最小限の情報提供', '重点的に管理し定期的にコミュニケーション', '報告書を送付するのみ'],
 '重点的に管理し定期的にコミュニケーション',
 '高パワー・高関心のステークホルダーは、プロジェクトに最も影響力があり関心も高いため、重点的に管理し、定期的なコミュニケーションと意思決定への参加が必要です。', 1);

INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'stakeholder-management'), 'multiple-choice',
'ステークホルダーマネジメントの主な目的はどれか？',
 ARRAY['プロジェクトコストを削減する', 'プロジェクトに影響を与える人々を特定し適切に関与させる', 'スケジュールを短縮する', 'チームメンバーを増やす'],
 'プロジェクトに影響を与える人々を特定し適切に関与させる',
 'ステークホルダーマネジメントの目的は、プロジェクトに影響を与える、または影響を受ける人々を特定し、適切に関与させることで、プロジェクトの成功確率を高めることです。', 2);

-- Lesson 2: Risk Management
INSERT INTO lessons (course_id, slug, title, content, "order") VALUES
((SELECT id FROM courses WHERE slug = 'pm-advanced'), 'risk-management', 'リスクマネジメント',
'# リスクマネジメント

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
- ステータス', 2);

-- Questions for Lesson 2
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'risk-management'), 'multiple-choice',
'プロジェクトで使用予定の新技術が不確実なため、その技術を使わないことにした。これはどのリスク対応戦略か？',
 ARRAY['回避', '転嫁', '軽減', '受容'],
 '回避',
 '回避戦略は、リスクの原因そのものを排除することです。不確実な技術を使わないという選択は、そのリスクを完全に回避しています。', 1);

INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM lessons WHERE slug = 'risk-management'), 'multiple-choice',
'リスク分析において、発生確率と影響度を掛け合わせて算出するものはどれか？',
 ARRAY['コスト', '優先度', 'スケジュール', '品質'],
 '優先度',
 'リスクの優先度は、発生確率と影響度を掛け合わせて算出されます。これにより、どのリスクに優先的に対応すべきかを判断できます。', 2);

-- Verify
SELECT
    c.title as course_title,
    COUNT(DISTINCT l.id) as lesson_count,
    COUNT(q.id) as question_count
FROM courses c
LEFT JOIN lessons l ON c.id = l.course_id
LEFT JOIN questions q ON l.id = q.lesson_id
WHERE c.slug = 'pm-advanced'
GROUP BY c.id, c.title;
