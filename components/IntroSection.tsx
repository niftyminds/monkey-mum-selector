'use client';

import { useIsEmbed } from './EmbedContext';

interface IntroSectionProps {
  onStart: () => void;
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  const isEmbed = useIsEmbed();

  return (
    <div className="bg-primary-50">
      <div className={`${isEmbed ? '' : 'min-h-[80vh]'} flex items-center justify-center px-4 py-12`}>
        <div className="max-w-2xl text-center">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-800 mb-4">
            Najděte správnou zábranu
            <br />
            pro vaše dítě
          </h1>

          {/* Description */}
          <p className="text-lg text-primary-700 mb-8 max-w-xl mx-auto">
            Pomůžeme vám vybrat bezpečnou zábranu, která přesně sedí vaší posteli a potřebám
            vašeho dítěte — během 2 minut.
          </p>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 text-sm text-primary-700">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Trvá jen 2 minuty</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Personalizované doporučení</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Zdarma</span>
            </div>
          </div>

          {/* CTA Button — Soft Gold */}
          <button
            onClick={onStart}
            className="
              inline-flex items-center justify-center
              px-8 py-4 text-lg font-semibold
              bg-primary-300 text-primary-800
              rounded-xl shadow-lg shadow-primary-300/40
              hover:bg-primary-400 hover:shadow-xl hover:shadow-primary-400/40
              transform hover:-translate-y-0.5
              transition-all duration-200
            "
          >
            Začít výběr
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          {/* Trust indicators */}
          <p className="mt-8 text-sm text-primary-500">
            Více než 50 000 spokojených rodičů
          </p>
        </div>
      </div>
    </div>
  );
}
