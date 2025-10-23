'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';

type Course = {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string | null;
  isPublic: number;
};

export default function CoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses/all');
        if (response.ok) {
          const allCourses = await response.json();

          // If logged in, show only private courses
          // If not logged in, show only public courses
          const filteredCourses = allCourses.filter((course: Course) => {
            if (user) {
              return course.isPublic === 0; // Show private courses
            } else {
              return course.isPublic === 1; // Show public courses
            }
          });

          setCourses(filteredCourses);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchCourses();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-500">読み込み中...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← ホームに戻る
          </Link>
          {user && (
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
              マイページ
            </Link>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-2">学習コース一覧</h1>
        <p className="text-gray-600 mb-8">
          {user
            ? 'あなたの学びたいコースを選択してください'
            : '無料サンプルコースで体験してみましょう'}
        </p>

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">現在、利用可能なコースはありません</p>
            {!user && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-4">
                  すべてのコースにアクセスするには、ログインまたは新規登録してください
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/login"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    新規登録（無料）
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {course.category}
                      </span>
                      {course.isPublic === 1 && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          無料サンプル
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                    <p className="text-gray-600">{course.description}</p>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
