import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lessons, courses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all lessons
    const allLessons = await db.select().from(lessons);

    // Get all courses to check which are private
    const allCourses = await db.select().from(courses);

    // Filter lessons to only include those from private courses
    const privateCourseIds = allCourses
      .filter(course => course.isPublic === 0)
      .map(course => course.id);

    const privateLessons = allLessons.filter(lesson =>
      privateCourseIds.includes(lesson.courseId)
    );

    return NextResponse.json(privateLessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
