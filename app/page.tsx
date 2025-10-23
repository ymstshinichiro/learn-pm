'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center text-gray-500">読み込み中...</div>
        </div>
      </main>
    );
  }

  // If user is logged in, don't show the landing page (redirecting...)
  if (user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              無料で始められる学習プラットフォーム
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Learn PM
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              プロジェクトマネジメントを
              <br />
              体系的に学ぶ
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              PMBOKに基づいた実践的なカリキュラムで、
              <br className="hidden md:block" />
              プロジェクト成功に必要なスキルを習得
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-lg font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                無料で始める
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-lg border-2 border-gray-300 hover:border-primary-500 hover:shadow-md transition-all"
              >
                ログイン
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>無料で利用開始</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>クレジットカード不要</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>いつでも学習可能</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Learn PMの特徴</h2>
            <p className="text-gray-600">効率的な学習をサポートする3つの特徴</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center text-3xl mb-4">
                📚
              </div>
              <h3 className="text-xl font-bold mb-3">体系的な学習</h3>
              <p className="text-gray-700 leading-relaxed">
                PMBOKに基づいた体系的なカリキュラムで、プロジェクトマネジメントの基礎から応用まで段階的に学習できます。
              </p>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-secondary-600 rounded-xl flex items-center justify-center text-3xl mb-4">
                ✅
              </div>
              <h3 className="text-xl font-bold mb-3">即時フィードバック</h3>
              <p className="text-gray-700 leading-relaxed">
                各レッスンごとに理解度を確認できる小テストを用意。解答後すぐに詳しい解説を確認できます。
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-accent-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent-600 rounded-xl flex items-center justify-center text-3xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3">進捗の可視化</h3>
              <p className="text-gray-700 leading-relaxed">
                学習の進捗状況やスコアを一目で確認。モチベーションを保ちながら継続的に学習できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">学習の流れ</h2>
            <p className="text-gray-600">3つのステップで効率的に学習</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">コースを選ぶ</h3>
              <p className="text-gray-600">
                基礎から応用まで、あなたのレベルに合わせたコースを選択
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">レッスンで学ぶ</h3>
              <p className="text-gray-600">
                わかりやすい解説とクイズで理解を深めながら進める
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">スキルを習得</h3>
              <p className="text-gray-600">
                実践的な知識を身につけ、プロジェクトを成功に導く
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            今すぐ学習を始めましょう
          </h2>
          <p className="text-xl mb-10 opacity-90">
            無料でアカウントを作成して、プロジェクトマネジメントのスキルを磨きましょう
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-10 py-4 bg-white text-primary-600 text-lg font-semibold rounded-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all"
            >
              無料で始める
            </Link>
            <Link
              href="/courses"
              className="px-10 py-4 bg-transparent text-white text-lg font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-primary-600 transition-all"
            >
              コースを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-sm">
            <p>&copy; 2025 Learn PM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
