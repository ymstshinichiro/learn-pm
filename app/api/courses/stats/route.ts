import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses, lessons } from '@/lib/db/schema';
import { sql, eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all courses with their lesson counts
    const allCourses = await db.select().from(courses);

    const coursesWithLessonCount = await Promise.all(
      allCourses.map(async (course) => {
        const lessonCount = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(lessons)
          .where(eq(lessons.courseId, course.id));

        return {
          courseId: course.id,
          lessonCount: lessonCount[0]?.count || 0,
        };
      })
    );

    // Count total lessons
    const totalLessonCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(lessons);

    return NextResponse.json({
      totalCourses: allCourses.length,
      totalLessons: totalLessonCount[0]?.count || 0,
      courseDetails: coursesWithLessonCount,
    });
  } catch (error) {
    console.error('Error fetching course stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
