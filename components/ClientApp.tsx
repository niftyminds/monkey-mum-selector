'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { FormData } from '@/types/form';
import { getRecommendations, RecommendationResult } from '@/lib/recommendations';
import IntroSection from './IntroSection';
import FormSection from './FormSection';
import ResultsSection from './ResultsSection';

type AppStep = 'intro' | 'form' | 'results';

interface ClientAppProps {
  products: Product[];
}

export default function ClientApp({ products }: ClientAppProps) {
  const [step, setStep] = useState<AppStep>('intro');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);

  const handleStart = () => {
    setStep('form');
  };

  const handleFormComplete = (data: FormData) => {
    setFormData(data);
    const recommendations = getRecommendations(data, products);
    setResult(recommendations);
    setStep('results');
  };

  const handleBackToIntro = () => {
    setStep('intro');
  };

  const handleRestart = () => {
    setFormData(null);
    setResult(null);
    setStep('intro');
  };

  return (
    <main className="min-h-screen">
      {step === 'intro' && <IntroSection onStart={handleStart} />}
      {step === 'form' && (
        <FormSection onComplete={handleFormComplete} onBack={handleBackToIntro} />
      )}
      {step === 'results' && result && formData && (
        <ResultsSection result={result} formData={formData} onRestart={handleRestart} />
      )}
    </main>
  );
}
