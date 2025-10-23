import { db } from '@/lib/db';
import { courses, lessons, questions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import QuizSection from '@/components/QuizSection';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LoginRequired from '@/components/LoginRequired';

export default async function LessonPage({
  params,
}: {
  params: { slug: string; lessonSlug: string };
}) {
  // Get course
  const [course] = await db.select().from(courses).where(eq(courses.slug, params.slug));

  if (!course) {
    notFound();
  }

  // Get lesson
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.courseId, course.id), eq(lessons.slug, params.lessonSlug)));

  if (!lesson) {
    notFound();
  }

  // Get all lessons for navigation
  const allLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, course.id))
    .orderBy(lessons.order);

  // Get questions for this lesson
  const lessonQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.lessonId, lesson.id))
    .orderBy(questions.order);

  // Find previous and next lessons
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Check if course is private (requires login)
  const isPrivate = course.isPublic === 0;

  const lessonContent = (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-sm mb-2">
            <Link href="/courses" className="text-primary-600 hover:underline">
              コース一覧
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href={`/courses/${params.slug}`} className="text-primary-600 hover:underline">
              {course.title}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{lesson.title}</span>
          </nav>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Lesson Content */}
          <div className="bg-white rounded-lg shadow p-8">
            <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-7 prose-strong:text-gray-900 prose-strong:font-bold prose-ul:my-4 prose-li:text-gray-700 prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:px-4 prose-th:py-2 prose-th:font-semibold prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {lesson.content}
              </ReactMarkdown>
            </article>
          </div>

          {/* Right: Quiz Section */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">理解度チェック</h2>
            {lessonQuestions.length === 0 ? (
              <p className="text-gray-500">このレッスンにはクイズがありません</p>
            ) : (
              <QuizSection questions={lessonQuestions} lessonId={lesson.id} />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          {prevLesson ? (
            <Link
              href={`/courses/${params.slug}/lessons/${prevLesson.slug}`}
              className="flex items-center px-6 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <div className="text-left">
                <div className="text-sm text-gray-500">前のレッスン</div>
                <div className="font-semibold">{prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div></div>
          )}

          {nextLesson ? (
            <Link
              href={`/courses/${params.slug}/lessons/${nextLesson.slug}`}
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-colors"
            >
              <div className="text-right">
                <div className="text-sm text-primary-100">次のレッスン</div>
                <div className="font-semibold">{nextLesson.title}</div>
              </div>
              <svg
                className="w-5 h-5 ml-2"
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
          ) : (
            <Link
              href={`/courses/${params.slug}`}
              className="px-6 py-3 bg-secondary-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors"
            >
              コースに戻る
            </Link>
          )}
        </div>
      </div>
    </main>
  );

  // If course is private, require login
  if (isPrivate) {
    return <LoginRequired>{lessonContent}</LoginRequired>;
  }

  // Public course, show directly
  return lessonContent;
}
