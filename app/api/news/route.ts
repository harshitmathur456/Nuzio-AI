import { INITIAL_ARTICLES } from '@/lib/newsData';
import { rankArticles } from '@/lib/ranking';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
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
    // Supabase unreachable or session token not present
  }

  // Check demo fallback session
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

  // Reject unauthenticated requests per PRD: 401
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const explicitCategory = searchParams.get('category');

  let preferredCategories: string[] = [];

  if (explicitCategory && explicitCategory !== 'All') {
    preferredCategories = [explicitCategory];
  } else if (!explicitCategory) {
    // Read preferences.categories for the user
    if (isDemo) {
      const demoPrefs = cookieStore.get('nuzio_demo_preferences')?.value;
      if (demoPrefs) {
        try {
          preferredCategories = JSON.parse(demoPrefs);
        } catch {
          preferredCategories = [];
        }
      }
    } else {
      try {
        const { data } = await supabase
          .from('preferences')
          .select('categories')
          .eq('user_id', userId)
          .maybeSingle();

        if (data?.categories) {
          preferredCategories = data.categories;
        }
      } catch {
        // Fallback if table not ready yet
      }
    }
  }

  // Score every article: score = (isPreferredCategory ? 100 : 0) - ageInHours, sorts descending
  // Returns { preferredCategories, articles: [...articles with isPreferred flag] }
  // If user has no saved preferences yet, returns everything in recency order
  const ranked = rankArticles(INITIAL_ARTICLES, preferredCategories);

  return NextResponse.json({
    preferredCategories,
    articles: ranked,
    total: ranked.length,
    timestamp: new Date().toISOString(),
  });
}
