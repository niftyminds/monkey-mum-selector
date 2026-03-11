'use client';

import { FormData } from '@/types/form';
import { RecommendationResult, SideRecommendation } from '@/lib/recommendations';
import ProductCard from './ProductCard';
import LeadCaptureForm from './LeadCaptureForm';
import { useIsEmbed } from './EmbedContext';

interface ResultsSectionProps {
  result: RecommendationResult;
  formData: FormData;
  onRestart: () => void;
}

interface GroupedItem {
  product: SideRecommendation['product'];
  requestedLength: number;
  count: number;
  sideIndices: number[];
}

function groupSides(sides: SideRecommendation[]): GroupedItem[] {
  const groups: GroupedItem[] = [];
  for (const side of sides) {
    const existing = groups.find((g) => g.product.id === side.product.id);
    if (existing) {
      existing.count++;
      existing.sideIndices.push(side.sideIndex + 1);
    } else {
      groups.push({
        product: side.product,
        requestedLength: side.requestedLength,
        count: 1,
        sideIndices: [side.sideIndex + 1],
      });
    }
  }
  return groups;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const CROSS_SELL_LABELS: Record<string, string> = {
  'schodiste': 'Zábrana ke schodišti',
  'dvere': 'Zábrana do dveří',
  'ohradka': 'Bezpečnostní ohrádka',
  'stolovani': 'Jídelní židlička',
};

export default function ResultsSection({ result, formData, onRestart }: ResultsSectionProps) {
  const isEmbed = useIsEmbed();
  const { sides, alternativeType, crossSellProducts, message, totalPrice } = result;
  const grouped = groupSides(sides);
  const heroItem = grouped[0];
  const secondaryItems = grouped.slice(1);

  const showPhotoNotice = ['boxspring', 'valenda', 'jiny'].includes(formData.bedType);

  return (
    <div className={`${isEmbed ? '' : 'min-h-screen'} bg-primary-50 py-8 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Photo notice for unusual bed types */}
        {showPhotoNotice && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Pro přesnější radu nám pošlete fotky vaší postele
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Váš typ postele může vyžadovat specifické řešení. Pošlete nám fotky na{' '}
                <a
                  href="mailto:informace@monkeymum.com"
                  className="font-semibold underline hover:text-amber-900"
                >
                  informace@monkeymum.com
                </a>
                {' '}a my vám poradíme tu nejlepší zábranu.
              </p>
            </div>
          </div>
        )}

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
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-2">
            Máme pro vás doporučení!
          </h1>
          {message && <p className="text-primary-600 max-w-xl mx-auto">{message}</p>}
        </div>

        {/* Hero product (first/primary) */}
        {heroItem && (
          <div className="mb-6">
            <ProductCard
              product={heroItem.product}
              isPrimary
              quantity={heroItem.count}
              sideIndices={heroItem.sideIndices}
            />
          </div>
        )}

        {/* Secondary products — 2-column grid */}
        {secondaryItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {secondaryItems.map((item, i) => (
              <ProductCard
                key={`${item.product.id}-${i}`}
                product={item.product}
                quantity={item.count}
                sideIndices={item.sideIndices}
              />
            ))}
          </div>
        )}

        {/* Total price */}
        {sides.length > 1 && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-primary-200 flex items-center justify-between">
            <span className="font-semibold text-primary-800">Celkem</span>
            <span className="text-2xl font-bold text-primary-800">{formatPrice(totalPrice)}</span>
          </div>
        )}

        {/* Alternative */}
        {alternativeType && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-primary-800 mb-4">Alternativa</h2>
            <ProductCard product={alternativeType} />
          </div>
        )}

        {/* Cross-sell products */}
        {crossSellProducts && crossSellProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-primary-800 mb-4">Mohlo by se vám hodit</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {crossSellProducts.map((cs) => (
                <div key={cs.category} className="relative">
                  <span className="absolute -top-2 left-3 z-10 bg-primary-300 text-primary-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {CROSS_SELL_LABELS[cs.category] || cs.category}
                  </span>
                  <ProductCard product={cs.product} compact />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restart */}
        <div className="text-center pb-8">
          <button
            onClick={onRestart}
            className="
              inline-flex items-center gap-2
              text-primary-600 font-medium
              hover:text-primary-800
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

      {/* Floating lead capture button */}
      <LeadCaptureForm
        sides={sides}
        alternativeProduct={alternativeType}
        formData={formData}
      />
    </div>
  );
}
