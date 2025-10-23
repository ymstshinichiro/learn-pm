import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses, lessons } from '@/lib/db/schema';
import { sql, eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all courses (public and private)
    const allCourses = await db.select().from(courses);

    // Filter only private courses (isPublic = 0) for stats
    const privateCourses = allCourses.filter(course => course.isPublic === 0);

    const coursesWithLessonCount = await Promise.all(
      privateCourses.map(async (course) => {
        const lessonCount = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(lessons)
          .where(eq(lessons.courseId, course.id));

        return {
          courseId: course.id,
          courseSlug: course.slug,
          courseTitle: course.title,
          courseDescription: course.description,
          lessonCount: lessonCount[0]?.count || 0,
        };
      })
    );

    // Count total lessons for private courses only
    const privateCourseIds = privateCourses.map(c => c.id);
    let totalLessonCount = 0;
    if (privateCourseIds.length > 0) {
      const lessonCounts = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(lessons)
        .where(sql`${lessons.courseId} IN (${sql.join(privateCourseIds.map(id => sql`${id}`), sql`, `)})`);
      totalLessonCount = lessonCounts[0]?.count || 0;
    }

    return NextResponse.json({
      totalCourses: privateCourses.length,
      totalLessons: totalLessonCount,
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
