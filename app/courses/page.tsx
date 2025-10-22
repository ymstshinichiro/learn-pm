import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import Link from 'next/link';

export default async function CoursesPage() {
  const allCourses = await db.select().from(courses);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← ホームに戻る
          </Link>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
            マイページ
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-2">学習コース一覧</h1>
        <p className="text-gray-600 mb-8">あなたの学びたいコースを選択してください</p>

        {allCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">現在、利用可能なコースはありません</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {allCourses.map((course) => (
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
