import { NextRequest, NextResponse } from 'next/server';
import { BookData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // Validate URL strictly: must be https://ridero.ru/books/...
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    if (
      parsed.hostname !== 'ridero.ru' &&
      parsed.hostname !== 'www.ridero.ru'
    ) {
      return NextResponse.json({ error: 'URL must be from ridero.ru' }, { status: 400 });
    }

    if (!parsed.pathname.startsWith('/books/')) {
      return NextResponse.json({ error: 'URL must point to a book page' }, { status: 400 });
    }

    // Reconstruct safe URL to prevent SSRF
    const safeUrl = `https://ridero.ru${parsed.pathname}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(safeUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch book page' },
        { status: 500 }
      );
    }

    const html = await response.text();
    const bookData = parseRideroPage(html, safeUrl);

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
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));

  let inQuote = false;
  result = result.replace(/"/g, () => {
    inQuote = !inQuote;
    return inQuote ? '«' : '»';
  });

  return result;
}

function parseRideroPage(html: string, bookUrl: string): BookData | null {
  try {
    let coverUrl = '';

    // Prefer clean cover from store.ridero.ru (no promotional stickers)
    // Match width-based URLs (w350, w200, etc.) with cover-front in the key
    const storeImageMatch = html.match(/https:\/\/store\.ridero\.ru\/images\/w\d+\?[^"'\s]*cover-front[^"'\s]*/i);
    if (storeImageMatch) {
      // HTML encodes & as &amp; — decode it back
      coverUrl = storeImageMatch[0].replace(/&amp;/g, '&');
    }

    // Fallback: og:image (may include promotional badges/stickers)
    if (!coverUrl) {
      const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
      if (ogImageMatch) {
        coverUrl = ogImageMatch[1];
      }
    }

    // Upscale to w800 for better quality
    if (coverUrl.match(/\/images\/w\d+\?/)) {
      coverUrl = coverUrl.replace(/\/images\/w\d+\?/, '/images/w800?');
    }

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

    let author = '';
    const authorMatch = html.match(/author[^>]*>([^<]+)</i) ||
                        html.match(/<a[^>]*href="[^"]*author[^"]*"[^>]*>([^<]+)</i);
    if (authorMatch) {
      author = authorMatch[1].trim();
    }

    let annotation = '';

    // 1. Try to extract from embedded JSON data (skuFromServer or product data)
    //    The page embeds a JSON object with a clean "description" field
    const jsonDescMatch = html.match(/"description"\s*:\s*"([^"]{30,})"/);
    if (jsonDescMatch) {
      annotation = jsonDescMatch[1];
      // Unescape JSON string escapes
      annotation = annotation
        .replace(/\\n/g, ' ')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }

    // 2. Fallback: og:description, but strip metadata prefix
    if (!annotation) {
      const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i);
      if (ogDescMatch) {
        let ogDesc = ogDescMatch[1];
        // og:description on Ridero includes metadata prefix like:
        // "Книга «Title». «Subtitle» - Author - печатная, электронная: epub, fb2, ... - actual annotation"
        // Strip everything up to and including the format list
        const formatPattern = /(?:печатная|электронная|аудио)[^-]*-\s*/i;
        const formatMatch = ogDesc.match(formatPattern);
        if (formatMatch && formatMatch.index !== undefined) {
          ogDesc = ogDesc.slice(formatMatch.index + formatMatch[0].length);
        }
        annotation = ogDesc;
      }
    }

    if (!coverUrl || !title) {
      return null;
    }

    return {
      title: decodeHtmlEntities(title),
      author: decodeHtmlEntities(author),
      coverUrl,
      annotation: decodeHtmlEntities(annotation),
      bookUrl,
      freeFragmentUrl: bookUrl,
    };
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return null;
  }
}
