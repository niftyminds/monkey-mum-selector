'use client';

import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  isPrimary?: boolean;
  quantity?: number;
  sideIndices?: number[];
  compact?: boolean;
}

export default function ProductCard({
  product,
  isPrimary = false,
  quantity,
  sideIndices,
  compact = false,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Premium':
        return 'bg-amber-100 text-amber-800';
      case 'Popular':
        return 'bg-green-100 text-green-800';
      case 'Economy':
        return 'bg-blue-100 text-blue-800';
      case 'Cestovní':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-primary-100 text-primary-800';
    }
  };

  // Compact variant for shopping list with multiple sides
  if (compact && isPrimary) {
    return (
      <div className="rounded-xl border-2 border-primary-500 bg-white overflow-hidden">
        <div className="p-4 sm:p-6 flex gap-4">
          {/* Thumbnail */}
          <div className="w-20 h-20 flex-shrink-0 bg-primary-100 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getTypeBadgeColor(
                  product.params.type
                )}`}
              >
                {product.params.type}
              </span>
              <span className="text-sm text-primary-500">{product.params.length} cm</span>
              {quantity && quantity > 1 && (
                <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                  {quantity}x
                </span>
              )}
            </div>
            <h3 className="font-semibold text-primary-800 truncate">{product.name}</h3>
            {sideIndices && sideIndices.length > 0 && (
              <p className="text-sm text-primary-500 mt-0.5">
                Strana {sideIndices.join(', ')}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-primary-800">
                {quantity && quantity > 1
                  ? `${quantity}x ${formatPrice(product.price)} = ${formatPrice(product.price * quantity)}`
                  : formatPrice(product.price)
                }
              </span>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-sm bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                Koupit
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-xl overflow-hidden transition-all
        ${isPrimary
          ? 'border-2 border-primary-500 shadow-lg bg-white'
          : 'border border-primary-200 bg-white hover:shadow-md'
        }
      `}
    >
      {isPrimary && (
        <div className="bg-primary-500 text-white text-center py-2 text-sm font-semibold">
          Doporučujeme pro vás
        </div>
      )}

      <div className="p-6">
        {/* Product Image */}
        <div className="aspect-video bg-primary-100 rounded-lg mb-4 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-300">
              <svg
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(
                product.params.type
              )}`}
            >
              {product.params.type}
            </span>
            <span className="text-sm text-primary-500">{product.params.length} cm</span>
          </div>

          <h3 className={`font-semibold ${isPrimary ? 'text-lg' : 'text-base'} text-primary-800`}>
            {product.name}
          </h3>

          <p className="text-sm text-primary-600 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between pt-2">
            <span className={`font-bold ${isPrimary ? 'text-2xl' : 'text-xl'} text-primary-800`}>
              {formatPrice(product.price)}
            </span>

            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors
                ${isPrimary
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }
              `}
            >
              {isPrimary ? 'Koupit' : 'Detail'}
              <svg
                className="ml-1.5 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
