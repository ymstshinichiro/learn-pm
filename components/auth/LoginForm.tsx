'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      // Parse Supabase error messages and convert to Japanese
      let errorMessage = 'ログインに失敗しました';

      if (err.message) {
        if (err.message.includes('Invalid login credentials') || err.message.includes('Invalid email or password')) {
          errorMessage = 'メールアドレスまたはパスワードが正しくありません';
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'メールアドレスが確認されていません。確認メールをご確認ください';
        } else if (err.message.includes('Invalid email')) {
          errorMessage = 'メールアドレスの形式が正しくありません';
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'ネットワークエラーが発生しました。もう一度お試しください';
        } else {
          // Show original error in development, user-friendly message in production
          errorMessage = process.env.NODE_ENV === 'development'
            ? `ログインエラー: ${err.message}`
            : 'ログインに失敗しました。しばらく経ってから再度お試しください';
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">ログイン</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </div>

        <div className="text-center">
          <Link href="/signup" className="text-blue-600 hover:text-blue-800 text-sm">
            アカウントをお持ちでない方はこちら
          </Link>
        </div>
      </form>
    </div>
  );
}
