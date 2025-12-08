'use client';

import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  isPrimary?: boolean;
}

export default function ProductCard({ product, isPrimary = false }: ProductCardProps) {
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
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`
        rounded-xl overflow-hidden transition-all
        ${isPrimary
          ? 'border-2 border-primary-500 shadow-lg bg-white'
          : 'border border-gray-200 bg-white hover:shadow-md'
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
        <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
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
          )}</div>

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
            <span className="text-sm text-gray-500">{product.params.length} cm</span>
          </div>

          <h3 className={`font-semibold ${isPrimary ? 'text-lg' : 'text-base'} text-gray-900`}>
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between pt-2">
            <span className={`font-bold ${isPrimary ? 'text-2xl' : 'text-xl'} text-gray-900`}>
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
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
