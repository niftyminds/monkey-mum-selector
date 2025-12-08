'use client';

import { Product } from '@/types/product';
import { FormData } from '@/types/form';
import { RecommendationResult } from '@/lib/recommendations';
import ProductCard from './ProductCard';
import LeadCaptureForm from './LeadCaptureForm';

interface ResultsSectionProps {
  result: RecommendationResult;
  formData: FormData;
  onRestart: () => void;
}

export default function ResultsSection({ result, formData, onRestart }: ResultsSectionProps) {
  const { primary, alternatives, message } = result;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Máme pro vás doporučení!
          </h1>
          {message && <p className="text-gray-600 max-w-xl mx-auto">{message}</p>}
        </div>

        {/* Lead capture - moved to top */}
        <div className="mb-8">
          <LeadCaptureForm
            recommendedProduct={primary}
            alternatives={alternatives}
            formData={formData}
          />
        </div>

        {/* Primary recommendation */}
        <div className="mb-8">
          <ProductCard product={primary} isPrimary />
        </div>

        {/* Alternatives - show exactly 2 products */}
        {alternatives.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Další možnosti</h2>
            <div className="grid grid-cols-2 gap-4">
              {alternatives.slice(0, 2).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Restart */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="
              inline-flex items-center gap-2
              text-gray-600 font-medium
              hover:text-gray-900
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Začít znovu
          </button>
        </div>
      </div>
    </div>
  );
}
