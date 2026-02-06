'use client';

import { useState } from 'react';
import { useBannerStore } from '@/lib/store';
import { Button, Input } from '@/components/ui';
import { BookData } from '@/lib/types';

export function Step1Url() {
  const { bookUrl, setBookUrl, setBookData, nextStep } = useBannerStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bookUrl.includes('ridero.ru/books/')) {
      setError('Пожалуйста, введите корректную ссылку на книгу Ridero');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/parse-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: bookUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch book data');
      }

      const bookData: BookData = await response.json();
      setBookData(bookData);
      nextStep();
    } catch (err) {
      setError('Не удалось загрузить данные книги. Попробуйте ещё раз.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Создайте баннер для своей книги
        </h1>
        <p className="text-gray-600 text-lg">
          Вставьте ссылку на страницу книги в Ridero
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="url"
          placeholder="https://ridero.ru/books/your-book/"
          value={bookUrl}
          onChange={(e) => setBookUrl(e.target.value)}
          error={error}
          className="text-lg"
        />

        <Button
          type="submit"
          disabled={!bookUrl || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Загрузка...
            </span>
          ) : (
            'Далее'
          )}
        </Button>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-500 text-center">
          Примеры ссылок для тестирования:
        </p>
        <div className="mt-2 space-y-1">
          <button
            type="button"
            onClick={() => setBookUrl('https://ridero.ru/books/skoraya/')}
            className="block w-full text-sm text-[#FF7E00] hover:underline text-left truncate"
          >
            ridero.ru/books/skoraya/
          </button>
          <button
            type="button"
            onClick={() => setBookUrl('https://ridero.ru/books/menedzher_transformacii/')}
            className="block w-full text-sm text-[#FF7E00] hover:underline text-left truncate"
          >
            ridero.ru/books/menedzher_transformacii/
          </button>
        </div>
      </div>
    </div>
  );
}
