'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { FormData } from '@/types/form';
import { LEAD_CAPTURE_TEXTS } from '@/lib/config';
import { generateTags, SideRecommendation } from '@/lib/recommendations';

interface LeadCaptureFormProps {
  sides: SideRecommendation[];
  alternativeProduct: Product | null;
  formData: FormData;
  onSuccess?: () => void;
}

export default function LeadCaptureForm({
  sides,
  alternativeProduct,
  formData,
  onSuccess,
}: LeadCaptureFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);

  // Trigger entrance animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Zadejte prosím e-mailovou adresu');
      return;
    }

    if (!validateEmail(email)) {
      setError('Zadejte prosím platnou e-mailovou adresu');
      return;
    }

    setIsSubmitting(true);

    try {
      const tags = generateTags(formData, sides);
      if (marketingConsent) {
        tags.push('newsletter-consent');
      }

      const recommendedProductIds = sides.map((s) => s.product.id);
      const alternativeProductIds = alternativeProduct ? [alternativeProduct.id] : [];

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          marketingConsent,
          recommendedProductId: recommendedProductIds[0] || '',
          alternativeProductIds,
          formAnswers: formData,
          tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || LEAD_CAPTURE_TEXTS.errorMessage);
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : LEAD_CAPTURE_TEXTS.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state — small toast then auto-hide
  if (isSuccess) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-800 font-medium text-sm">{LEAD_CAPTURE_TEXTS.successMessage}</p>
        </div>
      </div>
    );
  }

  // Expanded form panel
  if (isOpen) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />

        {/* Form panel */}
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-sm animate-slide-up">
          <div className="bg-white border border-primary-200 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="font-semibold text-primary-800 text-sm">{LEAD_CAPTURE_TEXTS.headline}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-primary-100 transition-colors text-primary-400 hover:text-primary-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-sm text-primary-600 mb-4">{LEAD_CAPTURE_TEXTS.description}</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={LEAD_CAPTURE_TEXTS.emailPlaceholder}
                    className="
                      w-full px-4 py-2.5 rounded-lg text-sm
                      border border-primary-300 bg-white
                      text-primary-800 placeholder-primary-400
                      focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none
                      transition-colors
                    "
                    disabled={isSubmitting}
                    autoFocus
                  />
                  {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-primary-300 text-primary-500 focus:ring-primary-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-xs text-primary-600">{LEAD_CAPTURE_TEXTS.marketingLabel}</span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full px-4 py-2.5 rounded-lg text-sm
                    bg-primary-500 text-white font-semibold
                    hover:bg-primary-600
                    disabled:bg-primary-200 disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Odesílám...
                    </span>
                  ) : (
                    LEAD_CAPTURE_TEXTS.submitButton
                  )}
                </button>

                <p className="flex items-center gap-1 text-[10px] text-primary-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {LEAD_CAPTURE_TEXTS.gdprNote}
                </p>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Floating button
  return (
    <button
      onClick={() => setIsOpen(true)}
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-2.5
        bg-primary-500 text-white
        pl-4 pr-5 py-3
        rounded-full shadow-lg shadow-primary-500/30
        hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/40
        hover:-translate-y-0.5
        transition-all duration-300
        ${hasAnimated ? 'animate-bounce-subtle' : 'translate-y-20 opacity-0'}
      `}
      style={!hasAnimated ? {} : { animation: 'bounce-subtle 2s ease-in-out infinite, fade-in-up 0.5s ease-out' }}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <span className="font-semibold text-sm whitespace-nowrap">Uložit na později</span>
    </button>
  );
}
