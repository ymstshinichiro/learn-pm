import Link from 'next/link';

export default function Home() {
  const isProduction = process.env.NODE_ENV === 'production';
  const environment = isProduction ? 'Production (Vercel + Supabase)' : 'Development (Docker)';

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Learn PM</h1>
          <p className="text-xl text-gray-600 mb-2">
            プロジェクトマネジメントを学ぶ、汎用学習プラットフォーム
          </p>
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
            {environment}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">学習を始めましょう</h2>
          <p className="text-gray-600 mb-6">
            解説とクイズで学ぶ、インタラクティブな学習体験
          </p>
          <Link
            href="/courses"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            コース一覧を見る
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold mb-2">体系的な学習</h3>
            <p className="text-gray-600 text-sm">
              PMBOKに基づいた体系的なカリキュラム
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-lg font-semibold mb-2">即時フィードバック</h3>
            <p className="text-gray-600 text-sm">
              理解度を確認できる小テストと解説
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2">進捗管理</h3>
            <p className="text-gray-600 text-sm">
              あなたの学習進捗を可視化して管理
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="text-center text-sm text-gray-500">
          <p>✅ Next.js 起動中</p>
          <p>✅ PostgreSQL 接続成功</p>
          <p>✅ Drizzle ORM 動作中</p>
        </div>
      </div>
    </main>
  );
}
