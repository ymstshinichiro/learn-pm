# Phase 2 実装 - 手動セットアップタスク

## 実装済み（本番設定不要）

以下の機能はすでに実装されており、ローカル環境で動作確認できます：

### ✅ UI コンポーネント
- [x] ログインフォーム ([components/auth/LoginForm.tsx](components/auth/LoginForm.tsx))
- [x] 新規登録フォーム ([components/auth/SignupForm.tsx](components/auth/SignupForm.tsx))
- [x] 認証ページ ([app/auth/login/page.tsx](app/auth/login/page.tsx), [app/auth/signup/page.tsx](app/auth/signup/page.tsx))
- [x] ユーザーダッシュボード ([app/dashboard/page.tsx](app/dashboard/page.tsx))
- [x] 詳細進捗ページ ([app/dashboard/progress/page.tsx](app/dashboard/progress/page.tsx))

### ✅ 認証システム基盤
- [x] AuthContext 作成 ([lib/auth/AuthContext.tsx](lib/auth/AuthContext.tsx))
- [x] ProtectedRoute コンポーネント ([components/auth/ProtectedRoute.tsx](components/auth/ProtectedRoute.tsx))

### ✅ データ移行ユーティリティ
- [x] LocalStorage → DB 移行ツール ([lib/utils/progressMigration.ts](lib/utils/progressMigration.ts))

---

## 手動セットアップが必要なタスク

以下のタスクは、本番環境（Supabase）での設定作業が必要です。

### 1️⃣ Supabase Auth 有効化

**作業内容:**
1. Supabase ダッシュボード (https://supabase.com/dashboard) にアクセス
2. プロジェクト `learn-pm` を選択
3. 左メニューから **Authentication** → **Providers** を開く
4. **Email** プロバイダーを有効化
5. 以下の設定を確認：
   - ✅ Enable email provider
   - ✅ Confirm email (推奨: 本番環境では有効化)
   - ❌ Secure email change (開発時は無効でOK)

**確認方法:**
```bash
# Authentication settings を開いて以下を確認
- Email Auth: Enabled
- Email templates: デフォルトでOK（後でカスタマイズ可能）
```

---

### 2️⃣ Supabase クライアント作成

**作業内容:**
[lib/supabase/client.ts](lib/supabase/client.ts) を作成

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**注:** `@supabase/supabase-js` はすでにインストール済みです。

---

### 3️⃣ 環境変数の追加

**作業内容:**
`.env.local` に以下を追加（既存の `DATABASE_URL` の下に）

```bash
# Supabase (既存)
DATABASE_URL=postgresql://postgres.<PROJECT_ID>:<PASSWORD>@<HOST>:5432/postgres

# Supabase Auth (新規追加)
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_ID>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase ダッシュボードから取得>
```

**ANON_KEY の取得方法:**
1. Supabase ダッシュボード → プロジェクト設定
2. **Settings** → **API**
3. **Project API keys** セクション
4. `anon` `public` キーをコピー

**Vercel 環境変数:**
Vercel ダッシュボードでも同じ変数を設定
```
Settings → Environment Variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

### 4️⃣ AuthContext の実装更新

**作業内容:**
[lib/auth/AuthContext.tsx](lib/auth/AuthContext.tsx) を以下のように更新

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type User = {
  id: string;
  email: string;
  name?: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name,
      } : null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name,
      } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

### 5️⃣ LoginForm/SignupForm の更新

**LoginForm の更新 ([components/auth/LoginForm.tsx](components/auth/LoginForm.tsx)):**

`handleSubmit` 関数を以下のように変更：

```typescript
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

// コンポーネント内
const { signIn } = useAuth();
const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    await signIn(email, password);
    router.push('/dashboard'); // ログイン成功後、ダッシュボードへ
  } catch (err: any) {
    setError(err.message || 'ログインに失敗しました');
  } finally {
    setLoading(false);
  }
};
```

**SignupForm の更新 ([components/auth/SignupForm.tsx](components/auth/SignupForm.tsx)):**

同様に `handleSubmit` を更新：

```typescript
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

const { signUp } = useAuth();
const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  // Validation
  if (password !== confirmPassword) {
    setError('パスワードが一致しません');
    setLoading(false);
    return;
  }

  if (password.length < 6) {
    setError('パスワードは6文字以上で入力してください');
    setLoading(false);
    return;
  }

  try {
    await signUp(email, password, name);
    // 確認メール送信の場合はメッセージ表示
    setError(null);
    alert('確認メールを送信しました。メールをご確認ください。');
    router.push('/auth/login');
  } catch (err: any) {
    setError(err.message || '登録に失敗しました');
  } finally {
    setLoading(false);
  }
};
```

---

### 6️⃣ ルートレイアウトに AuthProvider 追加

**作業内容:**
[app/layout.tsx](app/layout.tsx) を更新

```typescript
import { AuthProvider } from '@/lib/auth/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

### 7️⃣ ダッシュボードページの保護

**作業内容:**
[app/dashboard/page.tsx](app/dashboard/page.tsx) と [app/dashboard/progress/page.tsx](app/dashboard/progress/page.tsx) を Client Component に変更

**dashboard/page.tsx:**
```typescript
'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();

  // 既存のコンテンツ（user.name などを使用）
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ... */}
      <p className="text-gray-600">こんにちは、{user?.name || 'ユーザー'}さん</p>
      {/* ... */}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

---

### 8️⃣ データベース進捗管理の実装

**作業内容:**
API ルート作成: [app/api/progress/route.ts](app/api/progress/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userProgress } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET: ユーザーの進捗取得
export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id'); // TODO: Supabase Auth から取得

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const progress = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, parseInt(userId)));

  return NextResponse.json(progress);
}

// POST: 進捗保存
export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { lessonId, score, completed } = body;

  // Upsert progress
  await db
    .insert(userProgress)
    .values({
      userId: parseInt(userId),
      lessonId,
      score,
      completed: completed ? new Date() : null,
      completedAt: completed ? new Date() : null,
    })
    .onConflictDoUpdate({
      target: [userProgress.userId, userProgress.lessonId],
      set: {
        score,
        completed: completed ? new Date() : null,
        completedAt: completed ? new Date() : null,
      },
    });

  return NextResponse.json({ success: true });
}
```

---

### 9️⃣ QuizSection での進捗保存

**作業内容:**
[components/QuizSection.tsx](components/QuizSection.tsx) に DB 保存ロジック追加

```typescript
import { useAuth } from '@/lib/auth/AuthContext';

// コンポーネント内
const { user } = useAuth();

// saveProgress 関数を更新
const saveProgress = (updatedProgress: QuizProgress) => {
  // LocalStorage に保存（既存）
  localStorage.setItem(`quiz-progress-${lessonId}`, JSON.stringify(updatedProgress));

  // ログイン済みの場合は DB にも保存
  if (user) {
    fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id,
      },
      body: JSON.stringify({
        lessonId,
        score: updatedProgress.score,
        completed: updatedProgress.answeredQuestions.length >= questions.length,
      }),
    });
  }
};
```

---

## テスト手順

### ローカル環境
1. 新規登録ページ (/auth/signup) で登録
2. 確認メールのリンクをクリック（開発時は自動確認も可能）
3. ログインページ (/auth/login) でログイン
4. ダッシュボード (/dashboard) にリダイレクトされることを確認
5. コースを受講し、進捗が保存されることを確認
6. ログアウト後、再ログインして進捗が復元されることを確認

### 本番環境（Vercel）
1. 環境変数が設定されていることを確認
2. デプロイ後、同様のテストを実施
3. 複数デバイスで同じアカウントにログインし、進捗が同期されることを確認

---

## 注意事項

### セキュリティ
- ❌ **絶対に** Supabase の `service_role` キーをクライアント側で使用しない
- ✅ `anon` キーのみを `NEXT_PUBLIC_` で公開
- ✅ Row Level Security (RLS) を有効化（後述）

### Row Level Security (RLS) 設定
Supabase ダッシュボードで以下のポリシーを設定：

```sql
-- users テーブル: 自分のデータのみ読み書き可能
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- user_progress テーブル
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
  ON user_progress FOR ALL
  USING (auth.uid()::text = user_id::text);

-- test_results テーブル
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own test results"
  ON test_results FOR ALL
  USING (auth.uid()::text = user_id::text);
```

---

## 完了チェックリスト

作業完了後、以下を確認：

- [ ] Supabase Auth が有効化されている
- [ ] 環境変数が設定されている（ローカル & Vercel）
- [ ] `@supabase/supabase-js` がインストールされている
- [ ] AuthContext が Supabase と連携している
- [ ] ログイン・新規登録が動作する
- [ ] ダッシュボードがログイン後のみアクセス可能
- [ ] 進捗が DB に保存される
- [ ] RLS ポリシーが設定されている
- [ ] 本番環境でも動作確認済み

---

## 次のステップ（Phase 3 以降）

Phase 2 完了後、以下の機能を検討：

- [ ] パスワードリセット機能
- [ ] プロフィール編集
- [ ] 学習統計グラフ表示
- [ ] バッジ・実績システム
- [ ] ソーシャルログイン（Google, GitHub など）
