import { db } from '@/lib/db';
import { courses, lessons } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import LoginRequired from '@/components/LoginRequired';

export default async function CoursePage({ params }: { params: { slug: string } }) {
  // Get course
  const [course] = await db.select().from(courses).where(eq(courses.slug, params.slug));

  if (!course) {
    notFound();
  }

  // Get lessons for this course
  const courseLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, course.id))
    .orderBy(lessons.order);

  // Check if course is private (requires login)
  const isPrivate = course.isPublic === 0;

  const courseContent = (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/courses" className="text-primary-600 hover:underline">
            コース一覧
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{course.title}</span>
        </nav>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
              {course.category}
            </span>
            {course.isPublic === 1 && (
              <span className="px-3 py-1 bg-secondary-100 text-secondary-800 text-sm rounded-full">
                サンプル（無料公開）
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 text-lg">{course.description}</p>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">レッスン一覧</h2>
            <p className="text-gray-600 mt-1">全 {courseLessons.length} レッスン</p>
          </div>

          {courseLessons.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              このコースにはまだレッスンがありません
            </div>
          ) : (
            <div className="divide-y">
              {courseLessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  href={`/courses/${params.slug}/lessons/${lesson.slug}`}
                  className="flex items-center p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-800 font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{lesson.title}</h3>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-400 flex-shrink-0"
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );

  // If course is private, require login
  if (isPrivate) {
    return <LoginRequired>{courseContent}</LoginRequired>;
  }

  // Public course, show directly
  return courseContent;
}
