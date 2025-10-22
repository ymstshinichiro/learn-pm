import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses, lessons } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Count total courses
    const courseCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(courses);

    // Count total lessons
    const lessonCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(lessons);

    return NextResponse.json({
      totalCourses: courseCount[0]?.count || 0,
      totalLessons: lessonCount[0]?.count || 0,
    });
  } catch (error) {
    console.error('Error fetching course stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
