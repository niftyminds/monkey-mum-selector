import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monkey Mum Kalkulačka',
  robots: { index: false, follow: false },
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden bg-transparent">
      {children}
    </div>
  );
}
