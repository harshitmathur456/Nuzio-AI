import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createClient();
  try {
    await supabase.auth.signOut();
  } catch {
    // Continue cleanup
  }

  const response = NextResponse.json({ success: true, message: 'Logged out' });

  // Delete cookies
  response.cookies.set('nuzio_demo_user', '', { path: '/', maxAge: 0 });
  response.cookies.set('nuzio_demo_preferences', '', { path: '/', maxAge: 0 });

  return response;
}
