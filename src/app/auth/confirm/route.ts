import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  try {
    const supabase = await createClient();

    // 1. Exchange PKCE code if present
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('Error exchanging code for session in /auth/confirm:', error);
    }

    // 2. Verify OTP token_hash if present
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type });
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('Error verifying token_hash in /auth/confirm:', error);
    }

    // 3. Check if user is already authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } catch (err) {
    console.error('Auth confirm exception:', err);
  }

  // Fallback to login with confirmation parameter
  return NextResponse.redirect(`${origin}/login?confirmed=true`);
}
