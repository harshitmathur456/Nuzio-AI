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
    // Supabase unreachable or unconfigured
  }

  // Check demo fallback
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

  // Reject unauthenticated requests per PRD Section 8
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const explicitCategory = searchParams.get('category');

  let preferredCategories: string[] = [];

  if (explicitCategory && explicitCategory !== 'All') {
    preferredCategories = [explicitCategory];
  } else if (!explicitCategory) {
    // Fetch user preferences from DB or session
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
        // Fallback to empty preferences
      }
    }
  }

  // PRD Section 7 & 8:
  // score(article) = (isPreferredCategory ? 100 : 0) - ageInHours
  // Resilience: feed falls back to default queue if no preferences are saved yet
  const ranked = rankArticles(INITIAL_ARTICLES, preferredCategories);

  return NextResponse.json({
    articles: ranked,
    preferredCategories,
    total: ranked.length,
    formula: 'score(article) = (isPreferredCategory ? 100 : 0) - ageInHours',
    timestamp: new Date().toISOString(),
  });
}
