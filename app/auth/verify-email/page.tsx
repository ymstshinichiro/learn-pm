'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
          {/* アイコン */}
          <div className="flex justify-center mb-6">
            <div className="bg-secondary-100 rounded-full p-4">
              <svg
                className="w-16 h-16 text-secondary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* タイトル */}
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            確認メールを送信しました
          </h2>

          {/* メッセージ */}
          <div className="mb-6 space-y-4">
            <p className="text-gray-600 text-center">
              {email && (
                <span className="block font-semibold text-gray-800 mb-2">
                  {email}
                </span>
              )}
              上記のメールアドレスに確認メールを送信しました。
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>次のステップ：</strong>
              </p>
              <ol className="text-sm text-blue-800 mt-2 space-y-2 list-decimal list-inside">
                <li>受信トレイを確認してください</li>
                <li>確認メール内のリンクをクリックしてください</li>
                <li>アカウントが有効化されたらログインできます</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>メールが届かない場合：</strong>
              </p>
              <ul className="text-sm text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                <li>迷惑メールフォルダをご確認ください</li>
                <li>数分お待ちいただいてから再度ご確認ください</li>
                <li>メールアドレスが正しいかご確認ください</li>
              </ul>
            </div>
          </div>

          {/* ログインページへのリンク */}
          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors"
            >
              ログインページへ
            </Link>
          </div>

          {/* 再登録リンク */}
          <div className="text-center mt-4">
            <Link
              href="/auth/signup"
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              別のメールアドレスで登録する
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
        <div className="text-center">読み込み中...</div>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
