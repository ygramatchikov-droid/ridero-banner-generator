'use client';

import { useEffect } from 'react';
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
  const { currentStep, setCurrentStep } = useBannerStore();

  // Sync step to URL hash and handle browser back/forward
  useEffect(() => {
    // Set hash on step change
    const hash = `#step-${currentStep}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
  }, [currentStep]);

  useEffect(() => {
    // Read initial hash
    const hash = window.location.hash;
    const match = hash.match(/^#step-(\d+)$/);
    if (match) {
      const step = parseInt(match[1], 10);
      if (step >= 1 && step <= 6) {
        setCurrentStep(step);
      }
    }

    // Listen for popstate (browser back/forward)
    const handlePopState = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#step-(\d+)$/);
      if (match) {
        const step = parseInt(match[1], 10);
        if (step >= 1 && step <= 6) {
          setCurrentStep(step);
        }
      } else {
        setCurrentStep(1);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setCurrentStep]);

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
    <main className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {currentStep < 6 && (
          <StepIndicator currentStep={currentStep} totalSteps={5} />
        )}

        {renderStep()}
      </div>
    </main>
  );
}
