import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

interface SearchResultItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

// Clean helper to parse RSS XML without bulky dependencies
function parseGoogleNewsRss(xmlText: string): SearchResultItem[] {
  const items: SearchResultItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xmlText)) !== null && items.length < 10) {
    const itemContent = match[1];

    // Extract title
    const titleMatch = /<title>([\s\S]*?)<\/title>/i.exec(itemContent);
    let title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : '';

    // Extract link
    const linkMatch = /<link>([\s\S]*?)<\/link>/i.exec(itemContent);
    const link = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : '';

    // Extract source
    const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/i.exec(itemContent);
    let source = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : 'Google News';

    // Often Google News title ends with " - Source Name", clean it if needed
    if (source === 'Google News' && title.includes(' - ')) {
      const parts = title.split(' - ');
      source = parts.pop() || 'Google News';
      title = parts.join(' - ');
    }

    // Extract pubDate
    const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/i.exec(itemContent);
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();

    if (title && link) {
      // Decode HTML entities
      const decodedTitle = title
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

      items.push({
        title: decodedTitle,
        link,
        source,
        pubDate,
      });
    }
  }

  return items;
}

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const cookieStore = cookies();

  let userId: string | null = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
    }
  } catch {
    // lookup error
  }

  if (!userId) {
    const demoCookie = cookieStore.get('nuzio_demo_user')?.value;
    if (demoCookie) {
      userId = 'demo-user-id';
    }
  }

  // 401 if unauthenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  // 400 if q is missing or empty
  if (!q || !q.trim()) {
    return NextResponse.json({ error: 'Search query "q" is required' }, { status: 400 });
  }

  const encodedQuery = encodeURIComponent(q.trim());
  const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-IN&gl=IN&ceid=IN:en`;

  try {
    const res = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      next: { revalidate: 60 }, // Cache search queries for 60s
    });

    if (!res.ok) {
      return NextResponse.json(
        { results: [], error: `Google News returned status ${res.status}` },
        { status: 200 }
      );
    }

    const xmlText = await res.text();
    const results = parseGoogleNewsRss(xmlText);

    return NextResponse.json({
      query: q.trim(),
      results,
      count: results.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch Google News';
    return NextResponse.json({ results: [], error: message }, { status: 200 });
  }
}
