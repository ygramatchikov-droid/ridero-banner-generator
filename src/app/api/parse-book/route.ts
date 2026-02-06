import { NextRequest, NextResponse } from 'next/server';
import { BookData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes('ridero.ru/books/')) {
      return NextResponse.json(
        { error: 'Invalid Ridero book URL' },
        { status: 400 }
      );
    }

    // Fetch the Ridero page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch book page' },
        { status: 500 }
      );
    }

    const html = await response.text();

    // Parse book data from HTML
    const bookData = parseRideroPage(html, url);

    if (!bookData) {
      return NextResponse.json(
        { error: 'Failed to parse book data' },
        { status: 500 }
      );
    }

    return NextResponse.json(bookData);
  } catch (error) {
    console.error('Error parsing book:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Decode HTML entities and convert quotes to Russian «ёлочки»
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&apos;': "'",
    '&#39;': "'",
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&laquo;': '«',
    '&raquo;': '»',
    '&hellip;': '…',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char);
  }
  // Handle numeric entities like &#34;
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));

  // Convert straight quotes to Russian «ёлочки»
  // Replace pairs of " with « and »
  let inQuote = false;
  result = result.replace(/"/g, () => {
    inQuote = !inQuote;
    return inQuote ? '«' : '»';
  });

  return result;
}

function parseRideroPage(html: string, bookUrl: string): BookData | null {
  try {
    // Extract cover URL from og:image or img tag
    let coverUrl = '';

    // Try og:image first (most reliable)
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
    if (ogImageMatch) {
      coverUrl = ogImageMatch[1];
    }

    // Fallback: look for cover image in store.ridero.ru
    if (!coverUrl) {
      const storeImageMatch = html.match(/https:\/\/store\.ridero\.ru\/images\/[^"'\s]+cover[^"'\s]*/i);
      if (storeImageMatch) {
        coverUrl = storeImageMatch[0];
      }
    }

    // Get higher resolution cover (replace w350 with w800)
    if (coverUrl.includes('w350')) {
      coverUrl = coverUrl.replace('w350', 'w800');
    }

    // Extract title from og:title or h1
    let title = '';
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i);
    if (ogTitleMatch) {
      title = ogTitleMatch[1];
    } else {
      const h1Match = html.match(/<h1[^>]*>([^<]+)</i);
      if (h1Match) {
        title = h1Match[1].trim();
      }
    }

    // Extract author
    let author = '';
    // Look for author link or author-name class
    const authorMatch = html.match(/author[^>]*>([^<]+)</i) ||
                        html.match(/<a[^>]*href="[^"]*author[^"]*"[^>]*>([^<]+)</i);
    if (authorMatch) {
      author = authorMatch[1].trim();
    }

    // Extract description from og:description or annotation
    let annotation = '';
    const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i);
    if (ogDescMatch) {
      annotation = ogDescMatch[1];
    }

    // Extract genre from breadcrumbs/catalog link
    let genre = 'Художественная литература';
    const genreMatch = html.match(/catalog\/([^/"]+)/i);
    if (genreMatch) {
      genre = decodeURIComponent(genreMatch[1]).replace(/-/g, ' ');
    }

    // Build free fragment URL
    const freeFragmentUrl = bookUrl.endsWith('/')
      ? `${bookUrl}read/`
      : `${bookUrl}/read/`;

    if (!coverUrl || !title) {
      return null;
    }

    return {
      title: decodeHtmlEntities(title),
      author: decodeHtmlEntities(author),
      coverUrl,
      annotation: decodeHtmlEntities(annotation),
      genre: decodeHtmlEntities(genre),
      bookUrl,
      freeFragmentUrl,
    };
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return null;
  }
}
