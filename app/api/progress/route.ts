import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userProgress } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { supabase } from '@/lib/supabase/client';

// Helper to get user from request
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

// GET: ユーザーの進捗取得
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const progress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, user.id));

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: 進捗保存
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { lessonId, score, completed } = body;

    // Upsert progress
    await db
      .insert(userProgress)
      .values({
        userId: user.id,
        lessonId,
        score,
        completed: completed ? new Date() : null,
        completedAt: completed ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.lessonId],
        set: {
          score,
          completed: completed ? new Date() : null,
          completedAt: completed ? new Date() : null,
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
