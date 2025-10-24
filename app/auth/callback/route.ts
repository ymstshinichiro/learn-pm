import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // セッション確立に成功したら、指定されたページまたはホームにリダイレクト
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // エラーの場合はログインページにリダイレクト
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin));
}
