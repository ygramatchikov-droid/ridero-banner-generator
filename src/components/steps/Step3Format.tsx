'use client';

import { useBannerStore } from '@/lib/store';
import { BannerFormat, FORMAT_DIMENSIONS } from '@/lib/types';
import { Button, Card } from '@/components/ui';
import { SquareIcon, PhoneIcon } from '@/components/ui/Icons';

const FORMAT_ICONS: Record<BannerFormat, React.ComponentType<{ size?: number; className?: string }>> = {
  square: SquareIcon,
  vertical: PhoneIcon,
};

export function Step3Format() {
  const { selectedFormats, toggleFormat, prevStep, nextStep } = useBannerStore();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'PT Serif', serif" }}>
          Выберите форматы
        </h1>
        <p className="text-gray-600 text-lg">
          Можно выбрать несколько форматов сразу
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {(Object.keys(FORMAT_DIMENSIONS) as BannerFormat[]).map((format) => {
          const { width, height, label, description } = FORMAT_DIMENSIONS[format];
          const isSelected = selectedFormats.includes(format);

          const Icon = FORMAT_ICONS[format];
          return (
            <Card
              key={format}
              selected={isSelected}
              clickable
              onClick={() => toggleFormat(format)}
              className="flex items-center gap-4"
            >
              <div className="text-gray-600">
                <Icon size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{label}</h3>
                  <span className="text-sm text-gray-400">
                    {width}×{height} px
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-[#FF7E00] border-[#FF7E00] text-white'
                    : 'border-[#E8EBED]'
                }`}
              >
                {isSelected && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={prevStep} className="flex-1">
          Назад
        </Button>
        <Button size="lg" onClick={nextStep} disabled={selectedFormats.length === 0} className="flex-1">
          Далее
        </Button>
      </div>
    </div>
  );
}
