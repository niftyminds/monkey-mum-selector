'use client';

import { useState, useEffect, useCallback } from 'react';
import { FormData, SideLength, CrossSell } from '@/types/form';
import { FORM_STEPS, SLEEP_POSITION_SIDES_MAP } from '@/lib/config';
import { useIsEmbed } from './EmbedContext';
import RadioGroup from './RadioGroup';
import SelectField from './SelectField';
import MultiLengthField from './MultiLengthField';
import CheckboxGroup from './CheckboxGroup';

interface FormSectionProps {
  onComplete: (data: FormData) => void;
  onBack: () => void;
}

const initialFormData: FormData = {
  bedType: '',
  sleepPosition: '',
  lengths: [],
  age: '',
  usage: '',
  priority: '',
  crossSell: [],
};

export default function FormSection({ onComplete, onBack }: FormSectionProps) {
  const isEmbed = useIsEmbed();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const step = FORM_STEPS[currentStep];
  const isLastStep = currentStep === FORM_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const getSideCount = (): number => {
    return SLEEP_POSITION_SIDES_MAP[formData.sleepPosition] || 1;
  };

  const canProceed = (): boolean => {
    if (!step.required) return true;

    if (step.type === 'multi-length') {
      const sideCount = getSideCount();
      if (formData.lengths.length < sideCount) return false;
      return formData.lengths.every((s) => {
        if (s.length === 'jine') return s.customLength != null && s.customLength > 0;
        return s.length > 0;
      });
    }

    if (step.type === 'checkbox') {
      return true; // checkbox (crossSell) is optional
    }

    const val = formData[step.id];
    if (typeof val === 'string') return val !== '';
    return true;
  };

  const handleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [step.id]: value,
    }));
  };

  const handleLengthsChange = (lengths: SideLength[]) => {
    setFormData((prev) => ({
      ...prev,
      lengths,
    }));
  };

  const handleCheckboxChange = (values: string[]) => {
    setFormData((prev) => ({
      ...prev,
      crossSell: values as CrossSell[],
    }));
  };

  const handleNext = () => {
    if (!canProceed()) return;

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

  // Enter key to proceed to next step
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canProceed()) {
        e.preventDefault();
        handleNext();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStep, formData]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100;
  const currentValue = typeof formData[step.id] === 'string' ? (formData[step.id] as string) : '';

  return (
    <div className={`${isEmbed ? '' : 'min-h-screen'} bg-primary-50 py-8 px-4`}>
      <div className="max-w-xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-primary-600 mb-2">
            <span>
              Otázka {currentStep + 1} z {FORM_STEPS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-primary-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-300 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-primary-200 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-800 mb-2">
            {step.label}
          </h2>
          {step.description && (
            <p className="text-sm text-primary-500 mb-6">{step.description}</p>
          )}
          {!step.description && <div className="mb-6" />}

          {/* Input */}
          <div className="mb-8">
            {step.type === 'radio' && (
              <RadioGroup
                name={step.id}
                options={step.options}
                value={currentValue}
                onChange={handleChange}
              />
            )}
            {step.type === 'select' && (
              <SelectField
                name={step.id}
                options={step.options}
                value={currentValue}
                onChange={handleChange}
              />
            )}
            {step.type === 'multi-length' && (
              <MultiLengthField
                sideCount={getSideCount()}
                value={formData.lengths}
                onChange={handleLengthsChange}
              />
            )}
            {step.type === 'checkbox' && (
              <CheckboxGroup
                name={step.id}
                options={step.options}
                value={formData.crossSell}
                onChange={handleCheckboxChange}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              className="
                flex items-center gap-2 px-4 py-2.5
                text-primary-700 font-medium
                rounded-lg
                hover:bg-primary-100
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
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-6 py-2.5
                font-semibold rounded-lg
                transition-all
                ${canProceed()
                  ? 'bg-primary-300 text-primary-800 hover:bg-primary-400 shadow-md hover:shadow-lg'
                  : 'bg-primary-200 text-primary-400 cursor-not-allowed'
                }
              `}
            >
              {isLastStep ? 'Zobrazit doporučení' : step.required ? 'Pokračovat' : 'Přeskočit / Pokračovat'}
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
                  ? 'w-6 bg-primary-300'
                  : index < currentStep
                  ? 'w-1.5 bg-primary-300'
                  : 'w-1.5 bg-primary-200'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
