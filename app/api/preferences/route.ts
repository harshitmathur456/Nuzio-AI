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
    // Supabase session lookup
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
    const categories = demoPrefs ? JSON.parse(demoPrefs) : ['All'];
    return NextResponse.json({ categories, isDemo: true });
  }

  try {
    const { data, error } = await supabase
      .from('preferences')
      .select('categories')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ categories: ['All'] });
    }

    return NextResponse.json({ categories: data?.categories || ['All'] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: message, categories: ['All'] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createClient();
  const cookieStore = cookies();

  let body: { categories?: string[]; category?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const rawCategories = body.categories || (body.category ? [body.category] : []);
  if (!Array.isArray(rawCategories) || rawCategories.length === 0) {
    return NextResponse.json({ error: 'Categories array is required' }, { status: 400 });
  }

  // Validate against known category list
  const invalid = rawCategories.find((c) => !VALID_CATEGORIES.includes(c));
  if (invalid) {
    return NextResponse.json({ error: `Invalid category: ${invalid}` }, { status: 400 });
  }

  let userId: string | null = null;
  let isDemo = false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
    }
  } catch {
    // Supabase auth lookup
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
    const response = NextResponse.json({
      success: true,
      categories: rawCategories,
      isDemo: true,
      message: 'Demo preferences saved',
    });
    response.cookies.set('nuzio_demo_preferences', JSON.stringify(rawCategories), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
    return response;
  }

  try {
    const { data, error } = await supabase
      .from('preferences')
      .upsert(
        {
          user_id: userId,
          categories: rawCategories,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase preferences error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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
