'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { FormData } from '@/types/form';
import { LEAD_CAPTURE_TEXTS } from '@/lib/config';
import { generateTags } from '@/lib/recommendations';

interface LeadCaptureFormProps {
  recommendedProduct: Product;
  alternatives: Product[];
  formData: FormData;
  onSuccess?: () => void;
}

export default function LeadCaptureForm({
  recommendedProduct,
  alternatives,
  formData,
  onSuccess,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

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
      const tags = generateTags(formData, recommendedProduct);
      if (marketingConsent) {
        tags.push('newsletter-consent');
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          marketingConsent,
          recommendedProductId: recommendedProduct.id,
          alternativeProductIds: alternatives.map((p) => p.id),
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

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-green-800 font-medium">{LEAD_CAPTURE_TEXTS.successMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-primary-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{LEAD_CAPTURE_TEXTS.headline}</h3>
          <p className="text-sm text-gray-600 mt-0.5">{LEAD_CAPTURE_TEXTS.description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={LEAD_CAPTURE_TEXTS.emailPlaceholder}
            className="
              w-full px-4 py-3 rounded-lg
              border border-gray-300 bg-white
              text-gray-900 placeholder-gray-400
              focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none
              transition-colors
            "
            disabled={isSubmitting}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="
              mt-0.5 h-4 w-4 rounded
              border-gray-300 text-primary-500
              focus:ring-primary-500
            "
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-600">{LEAD_CAPTURE_TEXTS.marketingLabel}</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full px-4 py-3 rounded-lg
            bg-primary-500 text-white font-semibold
            hover:bg-primary-600
            disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors
          "
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Odesílám...
            </span>
          ) : (
            LEAD_CAPTURE_TEXTS.submitButton
          )}
        </button>

        <p className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          {LEAD_CAPTURE_TEXTS.gdprNote}{' '}
          <a href="#" className="underline hover:text-gray-700">
            {LEAD_CAPTURE_TEXTS.gdprLink}
          </a>
        </p>
      </form>
    </div>
  );
}
