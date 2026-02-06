'use client';

import { useBannerStore } from '@/lib/store';
import { ColorScheme, COLOR_SCHEMES, BookStyle } from '@/lib/types';
import { Button } from '@/components/ui';

const BOOK_STYLES: { value: BookStyle; label: string; description: string }[] = [
  { value: '3d', label: '3D книга', description: 'Объёмная книга с корешком' },
  { value: '3d-hardcover', label: '3D хардкавер', description: 'Книга с видимыми страницами' },
  { value: 'flat', label: 'Плоская', description: 'Классическая плоская обложка' },
];

export function Step4Color() {
  const { colorScheme, setColorScheme, bookStyle, setBookStyle, prevStep, nextStep } = useBannerStore();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Выберите цветовую схему
        </h1>
        <p className="text-gray-600 text-lg">
          Подберите стиль под жанр вашей книги
        </p>
      </div>

      {/* Book style selector */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Стиль книги</h2>
        <div className="grid grid-cols-3 gap-3">
          {BOOK_STYLES.map((style) => {
            const isSelected = bookStyle === style.value;
            return (
              <button
                key={style.value}
                onClick={() => setBookStyle(style.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-[#FF7E00] bg-[#FFD8B3]/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{style.label}</span>
                  {isSelected && (
                    <div className="w-5 h-5 bg-[#FF7E00] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">{style.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Цветовая схема</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-8">
        {(Object.keys(COLOR_SCHEMES) as ColorScheme[]).map((scheme) => {
          const { name, bg, wave, text } = COLOR_SCHEMES[scheme];
          const isSelected = colorScheme === scheme;

          return (
            <button
              key={scheme}
              onClick={() => setColorScheme(scheme)}
              className={`relative p-3 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-[#FF7E00] shadow-lg ring-2 ring-[#FFD8B3]'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              {/* Color preview - mimics banner layout */}
              <div
                className="w-full h-16 rounded-xl mb-2 relative overflow-hidden"
                style={{ backgroundColor: bg }}
              >
                {/* Wave decoration preview */}
                <div
                  className="absolute -left-2 -top-2 w-8 h-8 rounded-full opacity-50"
                  style={{ backgroundColor: wave }}
                />
                <div
                  className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full opacity-30"
                  style={{ backgroundColor: wave }}
                />
                {/* Book cover preview */}
                <div className="absolute left-2 top-2 bottom-2 w-5 bg-gray-700 rounded-sm shadow-md" />
                {/* Text lines preview */}
                <div className="absolute right-2 top-3 space-y-1">
                  <div className="w-8 h-1 rounded" style={{ backgroundColor: text }} />
                  <div className="w-6 h-0.5 rounded opacity-40" style={{ backgroundColor: text }} />
                </div>
              </div>

              <p className="font-medium text-gray-900 text-sm">{name}</p>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-[#FF7E00] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Назад
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Далее
        </Button>
      </div>
    </div>
  );
}
