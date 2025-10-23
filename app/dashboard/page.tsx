'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';

type Stats = {
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
};

type RecentActivity = {
  lessonId: number;
  lessonTitle: string;
  courseTitle: string;
  completed: string | null;
  score: number;
};

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch progress data
        const response = await fetch('/api/progress', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const progressData = await response.json();

          // Fetch course/lesson counts (already filtered to private courses)
          const coursesResponse = await fetch('/api/courses/stats');
          const coursesData = await coursesResponse.json();

          // Get private lessons to filter progress data
          const lessonsResponse = await fetch('/api/lessons/by-course');
          const privateLessons = await lessonsResponse.json();
          const privateLessonIds = new Set(privateLessons.map((l: any) => l.id));

          // Filter progress data to only include private course lessons
          const privateProgressData = progressData.filter((p: any) =>
            privateLessonIds.has(p.lessonId)
          );

          // Calculate stats (only for private courses)
          const completedLessons = privateProgressData.filter((p: any) => p.completed).length;
          const totalScore = privateProgressData.reduce((sum: number, p: any) => sum + (p.score || 0), 0);
          const averageScore = privateProgressData.length > 0
            ? Math.round(totalScore / privateProgressData.length)
            : 0;

          // Calculate completed courses (only for private courses)
          // A course is completed if all its lessons are completed
          const completedLessonIds = new Set(
            privateProgressData.filter((p: any) => p.completed).map((p: any) => p.lessonId)
          );

          let completedCoursesCount = 0;
          if (coursesData.courseDetails) {
            // Group private lessons by course
            const lessonsByCourse = privateLessons.reduce((acc: any, lesson: any) => {
              if (!acc[lesson.courseId]) {
                acc[lesson.courseId] = [];
              }
              acc[lesson.courseId].push(lesson);
              return acc;
            }, {});

            // Check each private course
            for (const courseDetail of coursesData.courseDetails) {
              const courseLessons = lessonsByCourse[courseDetail.courseId] || [];
              if (courseLessons.length > 0) {
                const allCompleted = courseLessons.every((lesson: any) =>
                  completedLessonIds.has(lesson.id)
                );
                if (allCompleted) {
                  completedCoursesCount++;
                }
              }
            }
          }

          setStats({
            totalCourses: coursesData.totalCourses || 0,
            completedCourses: completedCoursesCount,
            totalLessons: coursesData.totalLessons || 0,
            completedLessons,
            averageScore,
          });

          // Create recent activity from private progress data
          // Create a map of lesson id to lesson/course info
          const lessonMap = new Map();
          privateLessons.forEach((lesson: any) => {
            const course = coursesData.courseDetails?.find((c: any) => c.courseId === lesson.courseId);
            lessonMap.set(lesson.id, {
              lessonTitle: lesson.title,
              courseTitle: course?.courseTitle || 'コース',
            });
          });

          // Combine private progress data with lesson info
          const activities: RecentActivity[] = privateProgressData
            .filter((p: any) => p.completed) // Only show completed lessons
            .map((p: any) => {
              const lessonInfo = lessonMap.get(p.lessonId);
              return {
                lessonId: p.lessonId,
                lessonTitle: lessonInfo?.lessonTitle || 'レッスン',
                courseTitle: lessonInfo?.courseTitle || 'コース',
                completed: p.completed,
                score: p.score || 0,
              };
            })
            .sort((a: any, b: any) => {
              // Sort by completion date (most recent first)
              return new Date(b.completed).getTime() - new Date(a.completed).getTime();
            })
            .slice(0, 10); // Show the 10 most recent

          setRecentActivity(activities);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      // Use window.location to force full page reload and avoid ProtectedRoute redirect
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
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
              {loading ? '...' : `${stats.completedCourses}/${stats.totalCourses}`}
            </div>
            <div className="text-sm text-gray-600 mt-2">完了したコース</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">レッスン進捗</div>
            <div className="text-3xl font-bold text-green-600">
              {loading ? '...' : `${stats.completedLessons}/${stats.totalLessons}`}
            </div>
            <div className="text-sm text-gray-600 mt-2">完了したレッスン</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">平均スコア</div>
            <div className="text-3xl font-bold text-purple-600">
              {loading ? '...' : `${stats.averageScore}%`}
            </div>
            <div className="text-sm text-gray-600 mt-2">全レッスンの平均</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
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

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">最近の学習</h2>
          {loading ? (
            <div className="text-gray-500 text-center py-8">読み込み中...</div>
          ) : recentActivity.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              学習履歴がまだありません
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={`${activity.lessonId}-${activity.completed}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{activity.lessonTitle}</div>
                    <div className="text-sm text-gray-500">{activity.courseTitle}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">スコア</div>
                      <div className="text-lg font-semibold text-purple-600">{activity.score}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">完了日</div>
                      <div className="text-sm text-gray-700">
                        {activity.completed
                          ? new Date(activity.completed).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 text-sm underline"
          >
            ログアウト
          </button>
        </div>
      </div>
    </main>
  );
}
