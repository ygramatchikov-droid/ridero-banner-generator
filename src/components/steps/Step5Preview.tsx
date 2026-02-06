'use client';

import { useBannerStore } from '@/lib/store';
import { Button, Input } from '@/components/ui';
import { SquareBanner, VerticalBanner } from '@/components/templates';
import { BannerFormat } from '@/lib/types';

export function Step5Preview() {
  const {
    bookData,
    bannerType,
    bookStyle,
    selectedFormats,
    colorScheme,
    presentationData,
    editedTitle,
    editedAuthor,
    editedAnnotation,
    setEditedTitle,
    setEditedAuthor,
    setEditedAnnotation,
    setPresentationData,
    prevStep,
    nextStep,
  } = useBannerStore();

  if (!bookData) return null;

  const renderBannerPreview = (format: BannerFormat) => {
    const props = {
      book: bookData,
      colorScheme,
      bannerType,
      bookStyle,
      presentation: presentationData,
      title: editedTitle,
      author: editedAuthor,
      annotation: editedAnnotation,
      genre: bookData.genre,
    };

    switch (format) {
      case 'square':
        return <SquareBanner {...props} scale={0.35} />;
      case 'vertical':
        return <VerticalBanner {...props} scale={0.2} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Предпросмотр и редактирование
        </h1>
        <p className="text-gray-600 text-lg">
          Проверьте баннер и при необходимости отредактируйте текст
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview section */}
        <div className="space-y-6">
          <h2 className="font-semibold text-gray-900">Превью</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {selectedFormats.map((format) => (
              <div
                key={format}
                className="bg-gray-100 rounded-xl p-4 inline-block"
              >
                {renderBannerPreview(format)}
              </div>
            ))}
          </div>
        </div>

        {/* Edit section */}
        <div className="space-y-6">
          <h2 className="font-semibold text-gray-900">Редактирование</h2>

          <Input
            label="Название книги"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />

          <Input
            label="Автор"
            value={editedAuthor}
            onChange={(e) => setEditedAuthor(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Аннотация (до 200 знаков)
            </label>
            <textarea
              value={editedAnnotation}
              onChange={(e) => setEditedAnnotation(e.target.value)}
              maxLength={200}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              {editedAnnotation.length}/200 знаков
            </p>
          </div>

          {bannerType === 'presentation' && (
            <>
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  Данные презентации
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Время"
                    placeholder="14:30–15:00"
                    value={presentationData.time}
                    onChange={(e) =>
                      setPresentationData({ time: e.target.value })
                    }
                  />
                  <Input
                    label="Место"
                    placeholder="Москва, Гостиный двор"
                    value={presentationData.location}
                    onChange={(e) =>
                      setPresentationData({ location: e.target.value })
                    }
                  />
                  <Input
                    label="Стенд"
                    placeholder="Стенд Е-19"
                    value={presentationData.stand}
                    onChange={(e) =>
                      setPresentationData({ stand: e.target.value })
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Назад
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Сгенерировать баннеры
        </Button>
      </div>
    </div>
  );
}
