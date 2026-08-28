import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Successfully exchanged code for session -> Redirect user to destination already logged in!
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('Error exchanging auth code for session:', error);
    } catch (err) {
      console.error('Auth callback exception:', err);
    }
  }

  // Fallback if no code or error
  return NextResponse.redirect(`${origin}/login?confirmed=true`);
}
