import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

const VALID_CATEGORIES = ['All', 'AI & Tech', 'Markets', 'Startups', 'Science', 'Global'];

export async function GET() {
  const cookieStore = cookies();

  let userId: string | null = null;
  const demoCookie = cookieStore.get('nuzio_demo_user')?.value;
  if (demoCookie) {
    try {
      const parsed = JSON.parse(demoCookie);
      userId = parsed.id || null;
    } catch {
      // ignore
    }
  }

  // If we have a valid UUID user ID, query Supabase DB directly
  if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    try {
      const rows = await sql`SELECT * FROM public.preferences WHERE user_id = ${userId} LIMIT 1`;
      if (rows.length > 0) {
        return NextResponse.json({
          categories: rows[0].categories || ['All'],
          preferences: rows[0],
        });
      }
    } catch (err) {
      console.warn('DB preferences fetch error, checking cookie fallback:', err);
    }
  }

  // Cookie fallback for fast responsive rendering
  const demoPrefs = cookieStore.get('nuzio_demo_preferences')?.value;
  if (demoPrefs) {
    try {
      const data = JSON.parse(demoPrefs);
      const categories = Array.isArray(data) ? data : data.categories || ['All'];
      return NextResponse.json({ categories, preferences: data });
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ categories: ['All'] });
}

export async function POST(request: Request) {
  const cookieStore = cookies();

  let body: {
    categories?: string[];
    category?: string;
    full_name?: string;
    profession?: string;
    voice?: string;
    brief_length?: string;
    delivery_time?: string;
    language?: string;
    notifications_enabled?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const rawCategories = body.categories || (body.category ? [body.category] : ['All']);

  let userId: string | null = null;
  const demoCookie = cookieStore.get('nuzio_demo_user')?.value;
  if (demoCookie) {
    try {
      const parsed = JSON.parse(demoCookie);
      userId = parsed.id || null;
    } catch {
      // ignore
    }
  }

  // Direct Supabase Postgres save if userId is valid UUID
  if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    try {
      const result = await sql`
        INSERT INTO public.preferences (
          user_id,
          categories,
          full_name,
          profession,
          voice,
          brief_length,
          delivery_time,
          language,
          notifications_enabled,
          updated_at
        ) VALUES (
          ${userId},
          ${rawCategories},
          ${body.full_name || null},
          ${body.profession || 'Founder / Builder'},
          ${body.voice || 'Aria'},
          ${body.brief_length || '10 min'},
          ${body.delivery_time || '07:00 AM'},
          ${body.language || 'English'},
          ${body.notifications_enabled !== undefined ? body.notifications_enabled : true},
          now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
          categories = EXCLUDED.categories,
          full_name = COALESCE(EXCLUDED.full_name, public.preferences.full_name),
          profession = COALESCE(EXCLUDED.profession, public.preferences.profession),
          voice = COALESCE(EXCLUDED.voice, public.preferences.voice),
          brief_length = COALESCE(EXCLUDED.brief_length, public.preferences.brief_length),
          delivery_time = COALESCE(EXCLUDED.delivery_time, public.preferences.delivery_time),
          language = COALESCE(EXCLUDED.language, public.preferences.language),
          notifications_enabled = COALESCE(EXCLUDED.notifications_enabled, public.preferences.notifications_enabled),
          updated_at = now()
        RETURNING *
      `;

      // Update cookie as well
      const response = NextResponse.json({
        success: true,
        data: result[0],
        categories: result[0].categories,
      });

      response.cookies.set('nuzio_demo_preferences', JSON.stringify(result[0]), {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });

      return response;
    } catch (err: unknown) {
      console.error('Failed to update preferences in Supabase:', err);
    }
  }

  // Fallback update cookie
  const payload = {
    categories: rawCategories,
    full_name: body.full_name,
    profession: body.profession,
    voice: body.voice,
    brief_length: body.brief_length,
    delivery_time: body.delivery_time,
    language: body.language,
    notifications_enabled: body.notifications_enabled,
    updated_at: new Date().toISOString(),
  };

  const response = NextResponse.json({
    success: true,
    preferences: payload,
    categories: rawCategories,
  });

  response.cookies.set('nuzio_demo_preferences', JSON.stringify(payload), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });

  return response;
}
