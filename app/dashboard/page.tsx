'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  // TODO: Replace with actual progress data from database
  const mockStats = {
    totalCourses: 2,
    completedCourses: 0,
    totalLessons: 4,
    completedLessons: 0,
    averageScore: 0,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">マイページ</h1>
          <p className="text-gray-600">こんにちは、{user?.name || user?.email}さん</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">コース進捗</div>
            <div className="text-3xl font-bold text-blue-600">
              {mockStats.completedCourses}/{mockStats.totalCourses}
            </div>
            <div className="text-sm text-gray-600 mt-2">完了したコース</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">レッスン進捗</div>
            <div className="text-3xl font-bold text-green-600">
              {mockStats.completedLessons}/{mockStats.totalLessons}
            </div>
            <div className="text-sm text-gray-600 mt-2">完了したレッスン</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">平均スコア</div>
            <div className="text-3xl font-bold text-purple-600">
              {mockStats.averageScore}%
            </div>
            <div className="text-sm text-gray-600 mt-2">全レッスンの平均</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">最近の学習</h2>
          <div className="text-gray-500 text-center py-8">
            学習履歴がまだありません
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">クイックアクション</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/courses"
              className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold">コース一覧</div>
              <div className="text-sm text-gray-600">新しいコースを探す</div>
            </Link>

            <Link
              href="/dashboard/progress"
              className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">進捗詳細</div>
              <div className="text-sm text-gray-600">詳しい学習状況を見る</div>
            </Link>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mt-6 text-center">
          <Link href="/dashboard/settings" className="text-blue-600 hover:text-blue-800 text-sm">
            アカウント設定
          </Link>
        </div>
      </div>
    </main>
  );
}
