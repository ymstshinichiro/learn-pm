# Learn PM - 汎用学習・テストプラットフォーム

## プロジェクト概要

JSONベースの汎用学習プラットフォーム。解説・設問・回答をJSONで定義することで、あらゆる学習コンテンツ（プロジェクトマネジメント、料理、漢字検定など）に対応可能。

---

## コアコンセプト

### 学習とテストの統合
- **解説**: テキスト、図、例を使って概念を説明
- **小テスト**: 解説内容を即座に確認できる設問
- **即時フィードバック**: 正誤判定と解説で理解を深める

### 再利用性の高いアーキテクチャ
```
データベース/JSON → 汎用UI → 学習・テスト機能
```

- **コンテンツ**: データベースで管理（解説、設問、回答、解説など）
- **UI**: コンテンツの種類に依存しない汎用コンポーネント
- **機能**: 解説閲覧、テスト実施、進捗管理

※ UIの詳細レイアウトは実装フェーズで決定

---

## データ構造イメージ

### コース (Course)
```json
{
  "id": "pm-basic-001",
  "title": "プロジェクトマネジメント基礎",
  "category": "project-management",
  "description": "PMBOKに基づく基礎知識",
  "lessons": [...]
}
```

### レッスン (Lesson)
```json
{
  "id": "lesson-001",
  "title": "プロジェクトとは",
  "content": "プロジェクトの定義...",
  "questions": [...]
}
```

### 設問 (Question)
```json
{
  "id": "q-001",
  "type": "multiple-choice",
  "question": "プロジェクトの定義として正しいものは？",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "explanation": "プロジェクトは..."
}
```

---

## 機能要件

### Phase 1: MVP（最小機能）
- [ ] コース一覧表示
- [ ] レッスン閲覧（解説表示）
- [ ] 選択式テスト（4択）
- [ ] 正誤判定と解説表示
- [ ] 進捗記録（ローカルストレージ）
- [ ] スコアリング機能
- [ ] 復習機能（間違えた問題の再出題）

### Phase 2: ユーザー管理
- [ ] ユーザー登録・ログイン（Supabase Auth）
- [ ] 進捗のデータベース保存
- [ ] 学習履歴の表示

### Phase 3: ブランディング・メール設定
- [ ] 独自ドメイン取得
- [ ] Resend カスタムSMTP設定
- [ ] Supabase メールテンプレート日本語化
  - 確認メール（Confirm signup）
  - パスワードリセット（Reset password）
  - メールアドレス変更（Change email）
- [ ] サービスURL設定（サイトロゴ、OGP画像など）

### Phase 4 (リリース後に作るか考える): AIサポート
- [ ] 解説コメント
- [ ] 学習分析（弱点分析）
- [ ] 記述式テストの設問回答

---

## 技術スタック

### フロントエンド
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand or React Context（状態管理）

### バックエンド
- Next.js API Routes / Server Actions
- Supabase (PostgreSQL)
- Drizzle ORM

### インフラ
- Vercel (本番環境)
- Docker (開発環境)

---

## データベース設計

### テーブル構成

```sql
-- ユーザー
users (id, email, name, created_at)

-- コース
courses (id, title, category, description, created_at)

-- レッスン
lessons (id, course_id, title, content, order, created_at)

-- 設問
questions (id, lesson_id, type, question, options, correct_answer, explanation, order)

-- 進捗管理
user_progress (id, user_id, lesson_id, completed, score, completed_at)

-- テスト結果
test_results (id, user_id, question_id, user_answer, is_correct, answered_at)
```

---

## 開発工程表

### Phase 1: MVP開発（2-3週間）

#### Week 1: データベース・基盤構築
- [ ] **Day 1-2**: データベーススキーマ設計・作成
  - courses, lessons, questions テーブル
  - サンプルデータ投入（PM基礎コース）

- [ ] **Day 3-4**: コース一覧・詳細ページ
  - コース一覧表示
  - コース詳細ページ
  - レッスン一覧表示

- [ ] **Day 5-7**: レッスン閲覧機能
  - レッスンコンテンツ表示
  - マークダウンサポート
  - 次のレッスンへのナビゲーション

#### Week 2: テスト機能実装
- [ ] **Day 8-10**: 設問表示・回答機能
  - 選択式問題の表示
  - 回答選択UI
  - 正誤判定ロジック

- [ ] **Day 11-12**: 結果表示・解説
  - 正誤結果の表示
  - 解説表示
  - スコア計算

- [ ] **Day 13-14**: 進捗管理（ローカル）
  - LocalStorageで進捗保存
  - 学習状況の可視化
  - 完了マーク機能

---

### Phase 2: ユーザー管理（1-2週間）

#### Week 3: 認証・データ永続化
- [ ] **Day 15-17**: Supabase Auth統合
  - メール認証実装
  - ログイン・ログアウト
  - 保護されたルート

- [ ] **Day 18-19**: 進捗データベース化
  - user_progress テーブル活用
  - LocalStorageからマイグレーション
  - 複数デバイス同期

- [ ] **Day 20-21**: 学習履歴ダッシュボード
  - マイページ作成
  - 学習履歴表示
  - 統計情報（学習時間、正答率など）

---

### Phase 3: 機能拡張（2-3週間）

#### Week 4-5: 高度な機能
- [ ] **Day 22-24**: 複数の設問タイプ
  - 記述式問題
  - 並び替え問題
  - 画像問題

- [ ] **Day 25-27**: スコアリング・復習機能
  - スコアリングアルゴリズム
  - 間違えた問題の抽出
  - 復習モード

- [ ] **Day 28-30**: コンテンツ管理機能
  - JSON直接編集UI
  - コース作成フォーム
  - プレビュー機能

---

### Phase 4: 運用・拡張（継続的）

- [ ] **コンテンツ追加**
  - PM応用コース
  - 他ジャンルコース（料理、漢字検定など）

- [ ] **UI/UX改善**
  - レスポンシブ対応強化
  - アニメーション追加
  - アクセシビリティ向上

- [ ] **パフォーマンス最適化**
  - 画像最適化
  - キャッシング戦略
  - データベースインデックス

---

## 最初の開発タスク（Week 1, Day 1-2）

### データベーススキーマ作成

```typescript
// lib/db/schema.ts に追加

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id').references(() => lessons.id).notNull(),
  type: text('type').notNull(), // 'multiple-choice', 'true-false', etc.
  question: text('question').notNull(),
  options: text('options').array(), // JSON array for options
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### サンプルデータ投入（SQL）

```sql
-- PM基礎コース
INSERT INTO courses (slug, title, category, description) VALUES
('pm-basic', 'プロジェクトマネジメント基礎', 'project-management', 'PMBOKに基づく基礎知識を学びます');

-- レッスン1
INSERT INTO lessons (course_id, slug, title, content, "order") VALUES
(1, 'what-is-project', 'プロジェクトとは', '# プロジェクトとは

プロジェクトは、独自のプロダクト、サービス、所産を創造するために実施される有期性の業務です。', 1);

-- 設問1
INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
(1, 'multiple-choice', 'プロジェクトの定義として正しいものはどれか？',
 ARRAY['独自性と有期性を持つ業務', '日常的な反復業務', '継続的な運用業務', '定型的な保守業務'],
 '独自性と有期性を持つ業務',
 'プロジェクトは独自性（ユニーク）と有期性（開始と終了がある）を持つ点が特徴です。', 1);
```

---

## マイルストーン

| Phase | 期間 | 主な成果物 | デモ可能機能 |
|-------|------|-----------|------------|
| **Phase 1** | Week 1-2 | MVP | コース閲覧、テスト受験 |
| **Phase 2** | Week 3 | ユーザー管理 | ログイン、進捗保存 |
| **Phase 3** | Week 4-5 | 高度な機能 | 復習モード、多様な設問 |
| **Phase 4** | 継続 | コンテンツ拡充 | 複数ジャンル対応 |

---

## 成功指標（KPI）

### Phase 1（MVP）
- ✅ 1コース分のコンテンツ公開
- ✅ 基本的なテスト機能動作
- ✅ 進捗保存機能（ローカル）

### Phase 2（ユーザー管理）
- ✅ ユーザー登録・ログイン機能
- ✅ 進捗のDB保存
- ✅ マイページ表示

### Phase 3以降
- コース数 5個以上
- アクティブユーザー数
- 平均学習完了率

---

## 次のアクション

1. **データベーススキーマ作成**（lib/db/schema.ts 更新）
2. **マイグレーション実行**（ローカル & Supabase）
3. **サンプルデータ投入**（SQL実行）
4. **コース一覧ページ作成**（app/courses/page.tsx）

準備ができたら、Phase 1 Week 1 の開発を開始しましょう！
