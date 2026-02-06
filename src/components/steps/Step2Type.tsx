'use client';

import { useBannerStore } from '@/lib/store';
import { BannerType } from '@/lib/types';
import { Button, Card, Input } from '@/components/ui';
import { BookIcon, MicrophoneIcon } from '@/components/ui/Icons';

const BANNER_TYPES: { type: BannerType; title: string; description: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  {
    type: 'book',
    title: 'О книге',
    description: 'Баннер с обложкой, названием, автором, описанием и QR-кодом',
    Icon: BookIcon,
  },
  {
    type: 'presentation',
    title: 'Презентация книги',
    description: 'Баннер с временем, местом и стендом мероприятия',
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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Выберите тип баннера
        </h1>
        <p className="text-gray-600 text-lg">
          Для чего вам нужен баннер?
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

      {/* Presentation data fields */}
      {bannerType === 'presentation' && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-4">Данные мероприятия</h3>

          <Input
            label="Название мероприятия"
            placeholder="Презентация моей книги на Non/fiction!"
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
            placeholder="Стенд Е-19"
            value={presentationData.stand}
            onChange={(e) => setPresentationData({ stand: e.target.value })}
          />
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Назад
        </Button>
        <Button onClick={nextStep} disabled={!canProceed} className="flex-1">
          Далее
        </Button>
      </div>
    </div>
  );
}
