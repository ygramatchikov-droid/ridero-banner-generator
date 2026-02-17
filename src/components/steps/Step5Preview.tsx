'use client';

import { useRef, useState, useEffect } from 'react';
import { useBannerStore } from '@/lib/store';
import { Button, Input } from '@/components/ui';
import { SquareBanner, VerticalBanner } from '@/components/templates';
import { BannerFormat } from '@/lib/types';

export function Step5Preview() {
  const {
    bookData,
    bannerType,
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
    qrUrl,
    setQrUrl,
    prevStep,
    nextStep,
  } = useBannerStore();

  // Responsive scale: measure preview container width
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.35);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    const updateScale = () => {
      // Available width minus padding (p-4 = 32px total)
      const available = el.clientWidth - 32;
      // Banner base width is 1080; clamp scale between 0.22 and 0.4
      const scale = Math.min(0.4, Math.max(0.22, available / 1080));
      setPreviewScale(scale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!bookData) return null;

  const renderBannerPreview = (format: BannerFormat) => {
    const props = {
      book: bookData,
      colorScheme,
      bannerType,
      presentation: presentationData,
      title: editedTitle,
      author: editedAuthor,
      annotation: editedAnnotation,
      qrUrl,
    };

    switch (format) {
      case 'square':
        return <SquareBanner {...props} scale={previewScale} />;
      case 'vertical':
        return <VerticalBanner {...props} scale={previewScale} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'PT Serif', serif" }}>
          Предпросмотр и{'\u00A0'}редактирование
        </h1>
        <p className="text-gray-600 text-lg">
          Проверьте баннер и{'\u00A0'}при необходимости отредактируйте текст
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview section */}
        <div className="space-y-6" ref={previewRef}>
          <h2 className="font-bold text-gray-900 uppercase" style={{ fontFamily: "'PT Sans Caption', sans-serif", fontSize: '18px', lineHeight: '24px', letterSpacing: '2px' }}>Превью</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {selectedFormats.map((format) => (
              <div
                key={format}
                className={`rounded-xl p-4 inline-block ${colorScheme === 'white' ? 'bg-gray-100' : 'bg-white'}`}
              >
                {renderBannerPreview(format)}
              </div>
            ))}
          </div>
        </div>

        {/* Edit section */}
        <div className="space-y-6">
          <h2 className="font-bold text-gray-900 uppercase" style={{ fontFamily: "'PT Sans Caption', sans-serif", fontSize: '18px', lineHeight: '24px', letterSpacing: '2px' }}>Редактирование</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Аннотация (до{'\u00A0'}160 знаков)
            </label>
            <textarea
              value={editedAnnotation}
              onChange={(e) => setEditedAnnotation(e.target.value)}
              maxLength={160}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF7E00] transition-colors resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              {editedAnnotation.length}/160 знаков
            </p>
          </div>

          {bannerType === 'book' && (
            <Input
              label="Ссылка для QR-кода"
              placeholder="https://ridero.ru/books/your-book/read/"
              value={qrUrl}
              onChange={(e) => setQrUrl(e.target.value)}
            />
          )}

          <Input
            label="Название мероприятия"
            placeholder="Non/fiction"
            value={presentationData.exhibitionName}
            onChange={(e) =>
              setPresentationData({ exhibitionName: e.target.value })
            }
          />

          {bannerType === 'presentation' && (
            <Input
              label="Время"
              placeholder="14:30–15:00"
              value={presentationData.time}
              onChange={(e) =>
                setPresentationData({ time: e.target.value })
              }
            />
          )}

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
            placeholder="Стенд Е-32"
            value={presentationData.stand}
            onChange={(e) =>
              setPresentationData({ stand: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
        <Button variant="outline" size="lg" onClick={prevStep} className="w-full sm:flex-1 order-2 sm:order-1">
          Назад
        </Button>
        <Button size="lg" onClick={nextStep} className="w-full sm:flex-1 order-1 sm:order-2">
          Сгенерировать баннеры
        </Button>
      </div>
    </div>
  );
}
