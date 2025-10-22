'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';

type Stats = {
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
  });
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

          // Fetch course/lesson counts
          const coursesResponse = await fetch('/api/courses/stats');
          const coursesData = await coursesResponse.json();

          // Calculate stats
          const completedLessons = progressData.filter((p: any) => p.completed).length;
          const totalScore = progressData.reduce((sum: number, p: any) => sum + (p.score || 0), 0);
          const averageScore = progressData.length > 0
            ? Math.round(totalScore / progressData.length)
            : 0;

          // Calculate completed courses
          // A course is completed if all its lessons are completed
          const completedLessonIds = new Set(
            progressData.filter((p: any) => p.completed).map((p: any) => p.lessonId)
          );

          let completedCoursesCount = 0;
          if (coursesData.courseDetails) {
            // For each course, check if all lessons are completed
            const lessonsResponse = await fetch('/api/lessons/by-course');
            if (lessonsResponse.ok) {
              const allLessons = await lessonsResponse.json();

              // Group lessons by course
              const lessonsByCourse = allLessons.reduce((acc: any, lesson: any) => {
                if (!acc[lesson.courseId]) {
                  acc[lesson.courseId] = [];
                }
                acc[lesson.courseId].push(lesson);
                return acc;
              }, {});

              // Check each course
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
          }

          setStats({
            totalCourses: coursesData.totalCourses || 0,
            completedCourses: completedCoursesCount,
            totalLessons: coursesData.totalLessons || 0,
            completedLessons,
            averageScore,
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

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

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">最近の学習</h2>
          <div className="text-gray-500 text-center py-8">
            学習履歴がまだありません
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
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

        {/* Account Settings */}
        <div className="mt-6 text-center">
          <Link href="/dashboard/settings" className="text-blue-600 hover:text-blue-800 text-sm">
            アカウント設定
          </Link>
        </div>
      </div>
    </main>
  );
}
