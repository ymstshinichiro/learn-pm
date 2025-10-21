import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export default async function Home() {
  // データベースから全ユーザーを取得
  const allUsers = await db.select().from(users);

  const isProduction = process.env.NODE_ENV === 'production';
  const environment = isProduction ? 'Production (Vercel + Supabase)' : 'Development (Docker)';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Learn PM</h1>

      <div className="mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
        {environment}
      </div>

      <div className="mb-8 w-full max-w-2xl">
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
        <p>✅ PostgreSQL 接続成功</p>
        <p>✅ Drizzle ORM 動作中</p>
      </div>
    </main>
  );
}
