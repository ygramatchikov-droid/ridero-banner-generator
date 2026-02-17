import { BookData } from './types';

// Sample books with real covers from Ridero
// These will be used for demo/testing until Ridero API is connected
export const SAMPLE_BOOKS: Record<string, BookData> = {
  'skoraya': {
    title: 'Скорая',
    author: 'Алексей Кулаков',
    coverUrl: 'https://store.ridero.ru/images/w350?bucket=yc:store-raw-data.ridero.store&key=ridero/sku/2020-10/5f8539eaa555ac5b6dc7c75a/rev.2022-08-19T04:16:04.609Z/cover-front.png&format=original',
    annotation: 'Фантастическая повесть про мир, в котором люди не умирают, но счастья у них от этого не прибавляется.',

    bookUrl: 'https://ridero.ru/books/skoraya/',
    freeFragmentUrl: 'https://ridero.ru/books/skoraya/',
  },
  'menedzher_transformacii': {
    title: 'Менеджер трансформации',
    author: 'Марина Корсакова',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9785171139827-L.jpg', // Sample cover
    annotation: 'Практическое руководство по управлению изменениями в компании. Как стать лидером перемен и вести команду к успеху.',

    bookUrl: 'https://ridero.ru/books/menedzher_transformacii/',
    freeFragmentUrl: 'https://ridero.ru/books/menedzher_transformacii/',
  },
};

// Fallback covers from Open Library (popular books with reliable covers)
export const FALLBACK_COVERS = [
  'https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg', // Crime and Punishment
  'https://covers.openlibrary.org/b/isbn/9780679720201-L.jpg', // War and Peace
  'https://covers.openlibrary.org/b/isbn/9780143039433-L.jpg', // The Brothers Karamazov
  'https://covers.openlibrary.org/b/isbn/9780140449242-L.jpg', // Dead Souls
  'https://covers.openlibrary.org/b/isbn/9780199538669-L.jpg', // Anna Karenina
];

export function extractBookSlug(url: string): string | null {
  const match = url.match(/ridero\.ru\/books\/([^\/]+)/);
  return match ? match[1] : null;
}

export function getBookData(url: string): BookData | null {
  const slug = extractBookSlug(url);
  if (!slug) return null;

  // Check if we have sample data for this book
  if (SAMPLE_BOOKS[slug]) {
    return SAMPLE_BOOKS[slug];
  }

  // Generate mock data for unknown books
  const randomCover = FALLBACK_COVERS[Math.floor(Math.random() * FALLBACK_COVERS.length)];
  const formattedSlug = slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: formattedSlug,
    author: 'Автор книги',
    coverUrl: randomCover,
    annotation: 'Это увлекательная книга, которая откроет вам новые горизонты и подарит незабываемые эмоции от чтения.',

    bookUrl: url,
    freeFragmentUrl: url,
  };
}
