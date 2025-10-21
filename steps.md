# Next.js + Supabase + Cloudflare セットアップ手順

## 前提条件

- Node.js 18以上がインストールされていること
- GitHubアカウントがあること
- Supabaseアカウント（無料）: https://supabase.com
- Cloudflareアカウント（無料）: https://dash.cloudflare.com

---

## 1. Supabaseプロジェクトの作成

### 1-1. プロジェクト作成
```
1. https://supabase.com にアクセス
2. "New Project" をクリック
3. 以下を入力:
   - Name: learn-pm (任意)
   - Database Password: 自動生成されたものを使用（メモしておく）
   - Region: Tokyo (Northeast Asia)
4. "Create new project" をクリック
5. 約2分待つ（プロビジョニング中）
```

### 1-2. 接続情報の取得
```
1. Supabaseダッシュボード > Project Settings (左下の歯車アイコン)
2. Database > Connection string
3. "Connection pooling" の "URI" をコピー（後で使う）
   例: postgresql://postgres.xxxxx:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres
```

### 1-3. API情報の取得
```
1. Project Settings > API
2. 以下をコピー（後で使う）:
   - Project URL: https://xxxxx.supabase.co
   - anon public key: eyJhbGc...
```

---

## 2. ローカルプロジェクトの作成

### 2-1. Next.jsプロジェクト作成
```bash
npx create-next-app@latest learn-pm
```

質問に以下のように回答:
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … No
✔ Would you like to use App Router? … Yes
✔ Would you like to use Turbopack for next dev? … No
✔ Would you like to customize the import alias? … No
```

### 2-2. プロジェクトに移動
```bash
cd learn-pm
```

### 2-3. 必要なパッケージをインストール
```bash
# Drizzle ORM関連
npm install drizzle-orm postgres

# Drizzle Kit（開発用）
npm install -D drizzle-kit

# Supabase クライアント
npm install @supabase/supabase-js
```

---

## 3. 環境変数の設定

### 3-1. .env.local ファイルを作成
```bash
touch .env.local
```

### 3-2. 以下の内容を記述
```env
# Supabase Database (Step 1-2でコピーしたURI)
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR_PASSWORD]@xxx.pooler.supabase.com:6543/postgres"

# Supabase API (Step 1-3でコピーした情報)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
```

**重要**: `[YOUR_PASSWORD]` 部分を実際のパスワードに置き換えること

---

## 4. Drizzle ORMの設定

### 4-1. drizzle.config.ts を作成
```bash
touch drizzle.config.ts
```

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 4-2. ディレクトリ作成
```bash
mkdir -p lib/db
```

### 4-3. lib/db/schema.ts を作成
```typescript
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  userId: serial('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 4-4. lib/db/index.ts を作成
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
```

---

## 5. マイグレーション実行

### 5-1. マイグレーションファイル生成
```bash
npx drizzle-kit generate
```

生成されたファイルを確認:
```bash
ls drizzle/
# 0000_xxxxx.sql というファイルができる
```

### 5-2. マイグレーション実行（DBに反映）
```bash
npx drizzle-kit push
```

成功すると以下のようなメッセージが表示される:
```
✓ Applying migrations...
✓ Done!
```

### 5-3. Supabaseで確認（オプション）
```
1. Supabaseダッシュボード > Table Editor
2. usersテーブルとpostsテーブルが作成されていることを確認
```

---

## 6. 最初のページを作成

### 6-1. app/page.tsx を編集
```typescript
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export default async function Home() {
  // データベースから全ユーザーを取得
  const allUsers = await db.select().from(users);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Next.js + Supabase</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">ユーザー一覧</h2>
        {allUsers.length === 0 ? (
          <p className="text-gray-500">ユーザーがいません</p>
        ) : (
          <ul className="space-y-2">
            {allUsers.map((user) => (
              <li key={user.id} className="bg-white p-4 rounded shadow">
                <p className="font-semibold">{user.name || '名前なし'}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p>✅ Next.js 起動中</p>
        <p>✅ Supabase 接続成功</p>
        <p>✅ Drizzle ORM 動作中</p>
      </div>
    </main>
  );
}
```

---

## 7. ローカルサーバー起動

### 7-1. 開発サーバー起動
```bash
npm run dev
```

### 7-2. ブラウザで確認
```
http://localhost:3000 にアクセス
```

**期待される表示:**
- "Next.js + Supabase" というタイトル
- "ユーザー一覧" セクション（まだ空）
- ✅ の接続確認メッセージ

---

## 8. テストデータの追加（オプション）

### 8-1. Supabaseダッシュボードで追加
```
1. Supabase > Table Editor > users
2. "Insert row" をクリック
3. 以下を入力:
   - email: test@example.com
   - name: テストユーザー
4. Save
```

### 8-2. ページをリロード
```
http://localhost:3000 を再読み込み
→ テストユーザーが表示される
```

---

## 9. Gitリポジトリの初期化

### 9-1. Gitの初期化
```bash
git init
git add .
git commit -m "Initial commit: Next.js + Supabase + Drizzle"
```

### 9-2. GitHubリポジトリ作成
```
1. https://github.com/new にアクセス
2. Repository name: learn-pm
3. Public or Private を選択
4. "Create repository" をクリック
```

### 9-3. リモートリポジトリに接続してプッシュ
```bash
git remote add origin https://github.com/YOUR_USERNAME/learn-pm.git
git branch -M main
git push -u origin main
```

---

## 10. Cloudflare Pagesにデプロイ

### 10-1. Cloudflareにログイン
```
https://dash.cloudflare.com にアクセス
```

### 10-2. Pagesプロジェクト作成
```
1. Workers & Pages > Create application
2. Pages タブ > Connect to Git
3. GitHubアカウントを連携
4. リポジトリを選択: YOUR_USERNAME/learn-pm
5. "Begin setup" をクリック
```

### 10-3. ビルド設定
```
Project name: learn-pm (自動入力される)
Production branch: main
Framework preset: Next.js (自動検出される)
Build command: npm run build (自動入力される)
Build output directory: .next (自動入力される)
```

### 10-4. 環境変数の追加
```
"Environment variables (advanced)" を展開して以下を追加:

変数名: DATABASE_URL
値: (Step 3-2で設定した値)

変数名: NEXT_PUBLIC_SUPABASE_URL
値: (Step 3-2で設定した値)

変数名: NEXT_PUBLIC_SUPABASE_ANON_KEY
値: (Step 3-2で設定した値)
```

### 10-5. デプロイ実行
```
1. "Save and Deploy" をクリック
2. 3〜5分待つ（ビルド中）
3. "Success! Your site is live!" と表示される
```

### 10-6. 公開URLを確認
```
✅ https://learn-pm.pages.dev

このURLにアクセスして動作確認！
```

---

## 11. 今後の開発フロー

```bash
# 1. コードを編集
# 2. ローカルで確認
npm run dev

# 3. コミット & プッシュ
git add .
git commit -m "Add new feature"
git push origin main

# 4. 自動的にCloudflareが再デプロイ（約3分）
# 5. https://learn-pm.pages.dev が更新される
```

---

## トラブルシューティング

### エラー: "Failed to connect to database"
```bash
# .env.local のDATABASE_URLを確認
# Supabaseのパスワードが正しいか確認
# Connection pooling の URI を使っているか確認
```

### エラー: "Module not found: Can't resolve '@/lib/db'"
```bash
# lib/db/index.ts が存在するか確認
# パスが正しいか確認
npm run dev を再起動
```

### Cloudflareデプロイでエラー
```bash
# 環境変数が正しく設定されているか確認
# ビルドログを確認: Workers & Pages > learn-pm > View build log
```

---

## 次のステップ

- [ ] Server Actionsでデータ作成機能を追加
- [ ] Supabase Authで認証機能を追加
- [ ] 独自ドメインの設定
- [ ] Drizzle Studioでデータベース管理: `npx drizzle-kit studio`

---

## 参考リンク

- Next.js ドキュメント: https://nextjs.org/docs
- Drizzle ORM: https://orm.drizzle.team/docs/overview
- Supabase ドキュメント: https://supabase.com/docs
- Cloudflare Pages: https://developers.cloudflare.com/pages/

---

🎉 セットアップ完了！
```
ローカル: http://localhost:3000
本番: https://learn-pm.pages.dev
```