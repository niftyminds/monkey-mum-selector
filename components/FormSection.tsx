'use client';

import { useState } from 'react';
import { FormData } from '@/types/form';
import { FORM_STEPS } from '@/lib/config';
import RadioGroup from './RadioGroup';
import SelectField from './SelectField';

interface FormSectionProps {
  onComplete: (data: FormData) => void;
  onBack: () => void;
}

const initialFormData: FormData = {
  bedType: '',
  length: '',
  sides: '',
  period: '',
  activity: '',
  preference: '',
  budget: '',
};

export default function FormSection({ onComplete, onBack }: FormSectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const step = FORM_STEPS[currentStep];
  const isLastStep = currentStep === FORM_STEPS.length - 1;
  const isFirstStep = currentStep === 0;
  const currentValue = formData[step.id] || '';
  const canProceed = currentValue !== '';

  const handleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [step.id]: value,
    }));
  };

  const handleNext = () => {
    if (!canProceed) return;

    if (isLastStep) {
      onComplete(formData);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (isFirstStep) {
      onBack();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>
              Otázka {currentStep + 1} z {FORM_STEPS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Question */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            {step.label}
          </h2>

          {/* Input */}
          <div className="mb-8">
            {step.type === 'radio' ? (
              <RadioGroup
                name={step.id}
                options={step.options}
                value={currentValue}
                onChange={handleChange}
              />
            ) : (
              <SelectField
                name={step.id}
                options={step.options}
                value={currentValue}
                onChange={handleChange}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              className="
                flex items-center gap-2 px-4 py-2.5
                text-gray-600 font-medium
                rounded-lg
                hover:bg-gray-100
                transition-colors
              "
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Zpět
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`
                flex items-center gap-2 px-6 py-2.5
                font-semibold rounded-lg
                transition-all
                ${canProceed
                  ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isLastStep ? 'Zobrazit doporučení' : 'Pokračovat'}
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-1.5 mt-6">
          {FORM_STEPS.map((_, index) => (
            <div
              key={index}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${index === currentStep
                  ? 'w-6 bg-primary-500'
                  : index < currentStep
                  ? 'w-1.5 bg-primary-300'
                  : 'w-1.5 bg-gray-300'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
