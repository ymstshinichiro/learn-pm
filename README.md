# Learn PM

Next.js + PostgreSQL + Drizzle ORM を使用したプロジェクト管理学習アプリ

## 環境構成

### 開発環境
- **フレームワーク**: Next.js 14 (App Router)
- **データベース**: PostgreSQL 16 (Docker)
- **ORM**: Drizzle ORM
- **認証**: Supabase Auth
- **スタイリング**: Tailwind CSS
- **コンテナ**: Docker + Docker Compose

### 本番環境
- **ホスティング**: Vercel
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **デプロイ**: Git Push to Deploy

### データ構成
- **ユーザー情報**: Supabase Auth (auth.users) で管理
- **学習データ**: PostgreSQL (courses, lessons, questions, user_progress, test_results)

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/ymstshinichiro/learn-pm.git
cd learn-pm
```

### 2. Docker環境を起動

```bash
docker-compose up -d
```

これで以下が自動的に起動します：
- PostgreSQL データベース (port 5432)
- Next.js 開発サーバー (port 3000)
- データベースマイグレーション実行

### 3. ブラウザで確認

```
http://localhost:3000
```

## 開発コマンド

```bash
# 開発環境起動
docker-compose up -d

# ログ確認
docker-compose logs -f app

# 停止
docker-compose down

# データベース含めて完全削除
docker-compose down -v

# コンテナ内でコマンド実行
docker-compose exec app npm run db:studio
```

## データベース操作

```bash
# マイグレーションファイル生成
docker-compose exec app npm run db:generate

# データベースにスキーマを反映
docker-compose exec app npm run db:push

# Drizzle Studio起動（GUIでデータベース管理）
docker-compose exec app npm run db:studio
```

## プロジェクト構成

```
.
├── app/                  # Next.js App Router
│   ├── page.tsx         # トップページ
│   ├── layout.tsx       # レイアウト
│   └── globals.css      # グローバルCSS
├── lib/
│   └── db/
│       ├── schema.ts    # データベーススキーマ
│       └── index.ts     # DB接続
├── drizzle.config.ts    # Drizzle設定
├── docker-compose.yml   # Docker構成
├── Dockerfile          # Next.jsコンテナ定義
└── package.json        # 依存関係
```

## 技術スタック

- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Framework**: Next.js 14
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **Containerization**: Docker, Docker Compose

## トラブルシューティング

### ポートが既に使用されている

```bash
# 3000番ポートを使っているプロセスを確認
lsof -i :3000

# 5432番ポートを使っているプロセスを確認
lsof -i :5432
```

### データベース接続エラー

```bash
# コンテナの状態確認
docker-compose ps

# データベースログ確認
docker-compose logs db
```

### node_modulesの再インストール

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 本番環境へのデプロイ

詳細な手順は [DEPLOYMENT.md](DEPLOYMENT.md) を参照してください。

### クイックスタート

1. **Supabaseでプロジェクト作成**
   - https://supabase.com でアカウント作成
   - 新規プロジェクトを作成
   - DATABASE_URL と API情報を取得

2. **Vercelでデプロイ**
   - https://vercel.com でアカウント作成
   - GitHubリポジトリをインポート
   - 環境変数を設定:
     - `DATABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_SITE_URL` (例: https://learn-pm.vercel.app)

3. **デプロイ完了**
   - https://learn-pm.vercel.app にアクセス

---

## ライセンス

MIT

---

## 参考リンク

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Supabase ドキュメント](https://supabase.com/docs)
- [Vercel ドキュメント](https://vercel.com/docs)
