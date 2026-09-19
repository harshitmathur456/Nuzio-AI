import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const VALID_CATEGORIES = ['All', 'AI & Tech', 'Markets', 'Startups', 'Science', 'Global'];

export async function GET() {
  const supabase = createClient();
  const cookieStore = cookies();

  let userId: string | null = null;
  let isDemo = false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
    }
  } catch {
    // lookup
  }

  if (!userId) {
    const demoCookie = cookieStore.get('nuzio_demo_user')?.value;
    if (demoCookie) {
      try {
        const parsed = JSON.parse(demoCookie);
        userId = parsed.id || 'demo-user-id';
        isDemo = true;
      } catch {
        userId = 'demo-user-id';
        isDemo = true;
      }
    }
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isDemo) {
    const demoPrefs = cookieStore.get('nuzio_demo_preferences')?.value;
    const data = demoPrefs ? JSON.parse(demoPrefs) : { categories: ['All'] };
    const categories = Array.isArray(data) ? data : data.categories || ['All'];
    return NextResponse.json({ categories, preferences: data, isDemo: true });
  }

  try {
    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ categories: ['All'] });
    }

    return NextResponse.json({
      categories: data.categories || ['All'],
      preferences: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: message, categories: ['All'] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createClient();
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
  let isDemo = false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
    }
  } catch {
    // lookup
  }

  if (!userId) {
    const demoCookie = cookieStore.get('nuzio_demo_user')?.value;
    if (demoCookie) {
      try {
        const parsed = JSON.parse(demoCookie);
        userId = parsed.id || 'demo-user-id';
        isDemo = true;
      } catch {
        userId = 'demo-user-id';
        isDemo = true;
      }
    }
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload: Record<string, any> = {
    user_id: userId,
    categories: rawCategories,
    updated_at: new Date().toISOString(),
  };

  if (body.full_name) payload.full_name = body.full_name;
  if (body.profession) payload.profession = body.profession;
  if (body.voice) payload.voice = body.voice;
  if (body.brief_length) payload.brief_length = body.brief_length;
  if (body.delivery_time) payload.delivery_time = body.delivery_time;
  if (body.language) payload.language = body.language;
  if (body.notifications_enabled !== undefined) payload.notifications_enabled = body.notifications_enabled;

  if (isDemo) {
    const response = NextResponse.json({
      success: true,
      preferences: payload,
      categories: rawCategories,
      isDemo: true,
    });
    response.cookies.set('nuzio_demo_preferences', JSON.stringify(payload), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
    return response;
  }

  try {
    // First try upserting with all extended columns
    const { data, error } = await supabase
      .from('preferences')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      // If extended columns do not exist in DB yet, fallback to base categories upsert
      console.warn('Upsert with extended columns failed, falling back to base columns:', error.message);
      const fallbackPayload = {
        user_id: userId,
        categories: rawCategories,
        updated_at: new Date().toISOString(),
      };
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('preferences')
        .upsert(fallbackPayload, { onConflict: 'user_id' })
        .select()
        .single();

      if (fallbackError) {
        return NextResponse.json({ error: fallbackError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: fallbackData,
        categories: fallbackData.categories,
      });
    }

    return NextResponse.json({
      success: true,
      data,
      categories: data.categories,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
