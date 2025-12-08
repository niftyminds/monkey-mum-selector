import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Průvodce výběrem zábrany | Monkey Mum',
  description:
    'Najděte správnou zábranu na postel pro vaše dítě. Zodpovězte 7 jednoduchých otázek a my vám doporučíme nejvhodnější zábranu Monkey Mum.',
  keywords: ['zábrana na postel', 'dětská zábrana', 'Monkey Mum', 'bezpečnost dětí'],
  authors: [{ name: 'Monkey Mum' }],
  openGraph: {
    title: 'Průvodce výběrem zábrany | Monkey Mum',
    description: 'Najděte správnou zábranu na postel pro vaše dítě za 2 minuty.',
    type: 'website',
    locale: 'cs_CZ',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
