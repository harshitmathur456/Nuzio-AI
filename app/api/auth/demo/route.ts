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
  const location = body.location || 'Jodhpur, Rajasthan (Hyperlocal active)';
  const notificationsEnabled = body.notificationsEnabled !== undefined ? body.notificationsEnabled : true;

  let dbUserId: string | null = null;
  let dbSaved = false;

  // Background save to Supabase with timeout race so the client is never delayed
  const savePromise = saveUserAndPreferencesToSupabase({
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

  const timeoutPromise = new Promise<{ userId?: string }>((resolve) =>
    setTimeout(() => resolve({}), 1200)
  );

  try {
    const result = await Promise.race([savePromise, timeoutPromise]);
    if (result && 'userId' in result && result.userId) {
      dbUserId = result.userId;
      dbSaved = true;
    }
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
    message: 'User session and preferences saved successfully',
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
      location,
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
