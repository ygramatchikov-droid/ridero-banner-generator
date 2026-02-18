'use client';

import { useBannerStore } from '@/lib/store';
import { BannerType } from '@/lib/types';
import { Button, Card, Input } from '@/components/ui';
import { BookIcon, MicrophoneIcon } from '@/components/ui/Icons';

const BANNER_TYPES: { type: BannerType; title: string; description: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  {
    type: 'book',
    title: 'О книге',
    description: 'Стандартный баннер с\u00A0вашей книгой, названием выставки и\u00A0номером стенда',
    Icon: BookIcon,
  },
  {
    type: 'presentation',
    title: 'Презентация книги',
    description: 'Все то\u00A0же самое, но\u00A0с\u00A0временем презентации',
    Icon: MicrophoneIcon,
  },
];

export function Step2Type() {
  const {
    bannerType,
    setBannerType,
    presentationData,
    setPresentationData,
    prevStep,
    nextStep
  } = useBannerStore();

  const canProceed = bannerType === 'book' ||
    (presentationData.time && presentationData.location && presentationData.stand);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'PT Serif', serif" }}>
          Выберите тип баннера
        </h1>
        <p className="text-gray-600 text-lg">
          Для{'\u00A0'}чего вам нужен баннер?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {BANNER_TYPES.map(({ type, title, description, Icon }) => (
          <Card
            key={type}
            selected={bannerType === type}
            clickable
            onClick={() => setBannerType(type)}
            className="text-center"
          >
            <div className="flex justify-center mb-4 text-gray-700">
              <Icon size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </Card>
        ))}
      </div>

      {/* Book data fields (exhibition name, location & stand) */}
      {bannerType === 'book' && (
        <div className="bg-gray-50 rounded-2xl py-4 sm:py-6 mb-8 space-y-4">
          <h3 className="font-bold text-gray-900 mb-4 uppercase" style={{ fontFamily: "'PT Sans Caption', sans-serif", fontSize: '18px', lineHeight: '24px', letterSpacing: '2px' }}>Заполните данные</h3>

          <Input
            label="Название мероприятия"
            placeholder="Non/fiction"
            value={presentationData.exhibitionName}
            onChange={(e) => setPresentationData({ exhibitionName: e.target.value })}
          />

          <Input
            label="Место"
            placeholder="Москва, Гостиный двор"
            value={presentationData.location}
            onChange={(e) => setPresentationData({ location: e.target.value })}
          />

          <Input
            label="Стенд"
            placeholder="Стенд Е-32"
            value={presentationData.stand}
            onChange={(e) => setPresentationData({ stand: e.target.value })}
          />
        </div>
      )}

      {/* Presentation data fields */}
      {bannerType === 'presentation' && (
        <div className="bg-gray-50 rounded-2xl py-4 sm:py-6 mb-8 space-y-4">
          <h3 className="font-bold text-gray-900 mb-4 uppercase" style={{ fontFamily: "'PT Sans Caption', sans-serif", fontSize: '18px', lineHeight: '24px', letterSpacing: '2px' }}>Заполните данные</h3>

          <Input
            label="Название мероприятия"
            placeholder="Non/fiction"
            value={presentationData.exhibitionName}
            onChange={(e) => setPresentationData({ exhibitionName: e.target.value })}
          />

          <Input
            label="Время"
            placeholder="14:30–15:00"
            value={presentationData.time}
            onChange={(e) => setPresentationData({ time: e.target.value })}
          />

          <Input
            label="Место"
            placeholder="Москва, Гостиный двор"
            value={presentationData.location}
            onChange={(e) => setPresentationData({ location: e.target.value })}
          />

          <Input
            label="Стенд"
            placeholder="Стенд Е-32"
            value={presentationData.stand}
            onChange={(e) => setPresentationData({ stand: e.target.value })}
          />
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={prevStep} className="flex-1">
          Назад
        </Button>
        <Button size="lg" onClick={nextStep} disabled={!canProceed} className="flex-1">
          Далее
        </Button>
      </div>
    </div>
  );
}
