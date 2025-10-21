import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export default async function Home() {
  // データベースから全ユーザーを取得
  const allUsers = await db.select().from(users);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Next.js + PostgreSQL (Docker)</h1>

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
        <p>✅ Next.js (Docker) 起動中</p>
        <p>✅ PostgreSQL (Docker) 接続成功</p>
        <p>✅ Drizzle ORM 動作中</p>
      </div>
    </main>
  );
}
