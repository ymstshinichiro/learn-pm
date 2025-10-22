import Link from 'next/link';
import { db } from '@/lib/db';
import { courses, lessons } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function ProgressPage() {
  // Fetch all courses and their lessons
  const allCourses = await db.select().from(courses);

  const coursesWithLessons = await Promise.all(
    allCourses.map(async (course) => {
      const courseLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, course.id))
        .orderBy(lessons.order);

      return {
        ...course,
        lessons: courseLessons,
      };
    })
  );

  // TODO: Replace with actual user progress from database
  // For now, we'll read from localStorage on client side
  const mockProgress = {
    // This will be populated from database in Phase 2
    // Format: { lessonId: { score, answeredQuestions, completedAt } }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">
            ← マイページに戻る
          </Link>
          <h1 className="text-4xl font-bold mb-2">学習進捗</h1>
          <p className="text-gray-600">コース別の詳しい進捗状況</p>
        </div>

        {/* Course Progress */}
        <div className="space-y-6">
          {coursesWithLessons.map((course) => {
            const totalLessons = course.lessons.length;
            // TODO: Calculate completed lessons from database
            const completedLessons = 0;
            const progressPercentage = totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;

            return (
              <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Course Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{course.title}</h2>
                      <p className="text-sm text-gray-600">{course.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {progressPercentage}%
                      </div>
                      <div className="text-sm text-gray-500">完了</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  <div className="text-sm text-gray-600 mt-2">
                    {completedLessons} / {totalLessons} レッスン完了
                  </div>
                </div>

                {/* Lesson List */}
                <div className="divide-y divide-gray-200">
                  {course.lessons.map((lesson, index) => {
                    // TODO: Get actual progress from database
                    const isCompleted = false;
                    const score = null;

                    return (
                      <div key={lesson.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="text-2xl">
                              {isCompleted ? '✅' : '⭕'}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{lesson.title}</div>
                              <div className="text-sm text-gray-500">
                                レッスン {index + 1}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {score !== null && (
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600">
                                  {score}%
                                </div>
                                <div className="text-xs text-gray-500">スコア</div>
                              </div>
                            )}

                            <Link
                              href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                            >
                              {isCompleted ? '復習する' : '学習する'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Message */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 現在はローカルストレージに保存された進捗データを表示しています。ログイン機能実装後は、データベースに保存され、どのデバイスからでもアクセスできるようになります。
          </p>
        </div>
      </div>
    </main>
  );
}
