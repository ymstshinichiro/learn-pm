'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Navigation from '@/components/navigation/Navigation';

type Lesson = {
  id: number;
  title: string;
  slug: string;
  order: number;
};

type CourseWithLessons = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  lessons: Lesson[];
};

type Progress = {
  lessonId: number;
  score: number;
  completed: string | null;
};

export default function ProgressPage() {
  const { user } = useAuth();
  const [coursesWithLessons, setCoursesWithLessons] = useState<CourseWithLessons[]>([]);
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        // Fetch user progress
        const progressResponse = await fetch('/api/progress', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        let allProgress: Progress[] = [];
        if (progressResponse.ok) {
          allProgress = await progressResponse.json();
        }

        // Fetch private courses only
        const coursesResponse = await fetch('/api/courses/stats');
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();

          // Fetch private lessons only
          const lessonsResponse = await fetch('/api/lessons/by-course');
          if (lessonsResponse.ok) {
            const privateLessons = await lessonsResponse.json();

            // Filter progress to only include private course lessons
            const privateLessonIds = new Set(privateLessons.map((l: any) => l.id));
            const privateProgress = allProgress.filter(p => privateLessonIds.has(p.lessonId));
            setProgressData(privateProgress);

            // Group lessons by course
            const coursesMap = new Map();
            coursesData.courseDetails?.forEach((course: any) => {
              coursesMap.set(course.courseId, {
                id: course.courseId,
                slug: course.courseSlug,
                title: course.courseTitle,
                description: course.courseDescription,
                lessons: [],
              });
            });

            // Add private lessons to courses
            privateLessons.forEach((lesson: any) => {
              const course = coursesMap.get(lesson.courseId);
              if (course) {
                course.lessons.push({
                  id: lesson.id,
                  title: lesson.title,
                  slug: lesson.slug,
                  order: lesson.order,
                });
              }
            });

            // Sort lessons by order
            coursesMap.forEach((course) => {
              course.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
            });

            setCoursesWithLessons(Array.from(coursesMap.values()));
          }
        }
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center text-gray-500">読み込み中...</div>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-gray-600 mb-4">進捗を確認するにはログインが必要です</p>
              <Link href="/login" className="text-primary-600 hover:text-primary-800">
                ログインページへ
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Create progress map for quick lookup
  const progressMap = new Map<number, Progress>();
  progressData.forEach((p) => {
    progressMap.set(p.lessonId, p);
  });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="text-primary-600 hover:text-primary-800 text-sm mb-4 inline-block">
              ← ダッシュボードに戻る
            </Link>
          <h1 className="text-4xl font-bold mb-2">学習進捗</h1>
          <p className="text-gray-600">コース別の詳しい進捗状況</p>
        </div>

        {/* Course Progress */}
        <div className="space-y-6">
          {coursesWithLessons.map((course) => {
            const totalLessons = course.lessons.length;
            const completedLessons = course.lessons.filter((lesson) => {
              const progress = progressMap.get(lesson.id);
              return progress?.completed;
            }).length;
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
                      <div className="text-3xl font-bold text-primary-600">
                        {progressPercentage}%
                      </div>
                      <div className="text-sm text-gray-500">完了</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
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
                    const progress = progressMap.get(lesson.id);
                    const isCompleted = !!progress?.completed;
                    const score = progress?.score || null;

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
                                <div className="text-lg font-bold text-secondary-600">
                                  {score}%
                                </div>
                                <div className="text-xs text-gray-500">スコア</div>
                              </div>
                            )}

                            <Link
                              href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm"
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
        {coursesWithLessons.length === 0 && (
          <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-primary-800">
              コースがまだ登録されていません。
            </p>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
