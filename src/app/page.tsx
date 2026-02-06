'use client';

import { useBannerStore } from '@/lib/store';
import { StepIndicator } from '@/components/ui';
import {
  Step1Url,
  Step2Type,
  Step3Format,
  Step4Color,
  Step5Preview,
  Step6Download,
} from '@/components/steps';

export default function Home() {
  const { currentStep, reset } = useBannerStore();

  const handleLogoClick = () => {
    reset();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Url />;
      case 2:
        return <Step2Type />;
      case 3:
        return <Step3Format />;
      case 4:
        return <Step4Color />;
      case 5:
        return <Step5Preview />;
      case 6:
        return <Step6Download />;
      default:
        return <Step1Url />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl font-bold text-gray-900">Ridero</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Генератор баннеров</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentStep < 6 && (
          <StepIndicator currentStep={currentStep} totalSteps={5} />
        )}

        {renderStep()}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          Ridero © 2026 • Генератор баннеров для авторов
        </div>
      </footer>
    </main>
  );
}
