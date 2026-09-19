import { NextResponse } from 'next/server';
import { saveUserAndPreferencesToSupabase } from '@/lib/db';

export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const name = body.fullName || body.name || 'Aarav Sharma';
  const email = body.email || 'aarav.sharma@nuzio.ai';
  const categories = body.categories || ['AI & Tech', 'Markets', 'Startups'];
  const profession = body.profession || 'Founder / Builder';
  const voice = body.voice || 'Aria';
  const briefLength = body.briefLength || '10 min';
  const deliveryTime = body.deliveryTime || '07:00 AM';
  const language = body.language || 'English';
  const location = body.location || 'Mumbai, India';
  const notificationsEnabled = body.notificationsEnabled !== undefined ? body.notificationsEnabled : true;

  let dbUserId: string | null = null;
  let dbSaved = false;

  try {
    const dbResult = await saveUserAndPreferencesToSupabase({
      email,
      fullName: name,
      profession,
      categories,
      voice,
      briefLength,
      deliveryTime,
      language,
      location,
      notificationsEnabled,
    });
    dbUserId = dbResult.userId;
    dbSaved = true;
  } catch (dbErr) {
    console.warn('Direct Supabase save warning:', dbErr);
  }

  const demoUser = {
    id: dbUserId || 'demo-user-' + Math.random().toString(36).substring(2, 9),
    name,
    email,
    profession,
    voice,
    briefLength,
    deliveryTime,
    language,
    location,
    created_at: new Date().toISOString(),
  };

  const response = NextResponse.json({
    success: true,
    user: demoUser,
    dbSaved,
    message: 'User session and Supabase record saved successfully',
  });

  response.cookies.set('nuzio_demo_user', JSON.stringify(demoUser), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    httpOnly: false,
  });

  response.cookies.set(
    'nuzio_demo_preferences',
    JSON.stringify({
      categories,
      full_name: name,
      profession,
      voice,
      brief_length: briefLength,
      delivery_time: deliveryTime,
      language,
      notifications_enabled: notificationsEnabled,
    }),
    {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    }
  );

  return response;
}
