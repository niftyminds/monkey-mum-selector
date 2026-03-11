import { Product } from '@/types/product';

// Fallback static products (used when XML feed is unavailable)
export const FALLBACK_PRODUCTS: Product[] = [
  // Premium řada
  {
    id: 'MM-PREM-150',
    name: 'Zábrana na postel Monkey Mum® Premium 150 cm',
    description: 'Prémiová zábrana s extra měkkým polstrováním a elegantním designem. Nejbezpečnější volba pro váš klid.',
    url: 'https://monkeymum.cz/zabrana-premium-150',
    imageUrl: '/images/premium-150.jpg',
    additionalImages: [],
    price: 2290,
    currency: 'CZK',
    params: {
      length: 150,
      type: 'Premium',
      typeId: 2,
      activity: ['Spánek'],
      periods: ['Šestinedělí', 'První rok s miminkem', 'Dva až tři roky s batoletem'],
      supportsMultipleSides: true,
    },
  },
  {
    id: 'MM-PREM-180',
    name: 'Zábrana na postel Monkey Mum® Premium 180 cm',
    description: 'Prémiová zábrana s extra měkkým polstrováním a elegantním designem. Nejbezpečnější volba pro váš klid.',
    url: 'https://monkeymum.cz/zabrana-premium-180',
    imageUrl: '/images/premium-180.jpg',
    additionalImages: [],
    price: 2390,
    currency: 'CZK',
    params: {
      length: 180,
      type: 'Premium',
      typeId: 2,
      activity: ['Spánek'],
      periods: ['Šestinedělí', 'První rok s miminkem', 'Dva až tři roky s batoletem'],
      supportsMultipleSides: true,
    },
  },
  {
    id: 'MM-PREM-200',
    name: 'Zábrana na postel Monkey Mum® Premium 200 cm',
    description: 'Prémiová zábrana s extra měkkým polstrováním a elegantním designem. Nejbezpečnější volba pro váš klid.',
    url: 'https://monkeymum.cz/zabrana-premium-200',
    imageUrl: '/images/premium-200.jpg',
    additionalImages: [],
    price: 2490,
    currency: 'CZK',
    params: {
      length: 200,
      type: 'Premium',
      typeId: 2,
      activity: ['Spánek'],
      periods: ['Šestinedělí', 'První rok s miminkem', 'Dva až tři roky s batoletem'],
      supportsMultipleSides: true,
    },
  },

  // Popular řada
  {
    id: 'MM-POP-120',
    name: 'Zábrana na postel Monkey Mum® Popular 120 cm',
    description: 'Nejoblíbenější zábrana s perfektním poměrem ceny a kvality. Spolehlivá ochrana pro každou rodinu.',
    url: 'https://monkeymum.cz/zabrana-popular-120',
    imageUrl: '/images/popular-120.jpg',
    additionalImages: [],
    price: 1390,
    currency: 'CZK',
    params: {
      length: 120,
      type: 'Popular',
      typeId: 1,
      activity: ['Spánek'],
      periods: ['Šestinedělí', 'První rok s miminkem', 'Dva až tři roky s batoletem', 'Starší než 3 roky'],
      supportsMultipleSides: true,
    },
  },
  {
    id: 'MM-POP-150',
    name: 'Zábrana na postel Monkey Mum® Popular 150 cm',
    description: 'Nejoblíbenější zábrana s perfektním poměrem ceny a kvality. Spolehlivá ochrana pro každou rodinu.',
    url: 'https://monkeymum.cz/zabrana-popular-150',
    imageUrl: '/images/popular-150.jpg',
    additionalImages: [],
    price: 1490,
    currency: 'CZK',
    params: {
      length: 150,
      type: 'Popular',
      typeId: 1,
      activity: ['Spánek'],
      periods: ['Šestinedělí', 'První rok s miminkem', 'Dva až tři roky s batoletem', 'Starší než 3 roky'],
      supportsMultipleSides: true,
    },
  },
  {
    id: 'MM-POP-180',
    name: 'Zábrana na postel Monkey Mum® Popular 180 cm',
    description: 'Nejoblíbenější zábrana s perfektním poměrem ceny a kvality. Spolehlivá ochrana pro každou rodinu.',
    url: 'https://monkeymum.cz/zabrana-popular-180',
    imageUrl: '/images/popular-180.jpg',
    additionalImages: [],
    price: 1590,
    currency: 'CZK',
    params: {
      length: 180,
      type: 'Popular',
      typeId: 1,
      activity: ['Spánek'],
      periods: ['Šestinedělí', 'První rok s miminkem', 'Dva až tři roky s batoletem', 'Starší než 3 roky'],
      supportsMultipleSides: true,
    },
  },
  {
    id: 'MM-POP-200',
    name: 'Zábrana na postel Monkey Mum® Popular 200 cm',
    description: 'Nejoblíbenější zábrana s perfektním poměrem ceny a kvality. Spolehlivá ochrana pro každou rodinu.',
    url: 'https://monkeymum.cz/zabrana-popular-200',
    imageUrl: '/images/popular-200.jpg',
    additionalImages: [],
    price: 1690,
    currency: 'CZK',
    params: {
      length: 200,
      type: 'Popular',
      typeId: 1,
      activity: ['Spánek'],
      periods: ['Šestinedělí', 'První rok s miminkem', 'Dva až tři roky s batoletem', 'Starší než 3 roky'],
      supportsMultipleSides: true,
    },
  },

  // Economy řada
  {
    id: 'MM-ECO-100',
    name: 'Zábrana na postel Monkey Mum® Economy 100 cm',
    description: 'Základní zábrana za skvělou cenu. Spolehlivá ochrana pro rozpočtově orientované rodiny.',
    url: 'https://monkeymum.cz/zabrana-economy-100',
    imageUrl: '/images/economy-100.jpg',
    additionalImages: [],
    price: 890,
    currency: 'CZK',
    params: {
      length: 100,
      type: 'Economy',
      typeId: 3,
      activity: ['Spánek'],
      periods: ['První rok s miminkem', 'Dva až tři roky s batoletem', 'Starší než 3 roky'],
      supportsMultipleSides: true,
    },
  },
  {
    id: 'MM-ECO-120',
    name: 'Zábrana na postel Monkey Mum® Economy 120 cm',
    description: 'Základní zábrana za skvělou cenu. Spolehlivá ochrana pro rozpočtově orientované rodiny.',
    url: 'https://monkeymum.cz/zabrana-economy-120',
    imageUrl: '/images/economy-120.jpg',
    additionalImages: [],
    price: 990,
    currency: 'CZK',
    params: {
      length: 120,
      type: 'Economy',
      typeId: 3,
      activity: ['Spánek'],
      periods: ['První rok s miminkem', 'Dva až tři roky s batoletem', 'Starší než 3 roky'],
      supportsMultipleSides: true,
    },
  },
  {
    id: 'MM-ECO-150',
    name: 'Zábrana na postel Monkey Mum® Economy 150 cm',
    description: 'Základní zábrana za skvělou cenu. Spolehlivá ochrana pro rozpočtově orientované rodiny.',
    url: 'https://monkeymum.cz/zabrana-economy-150',
    imageUrl: '/images/economy-150.jpg',
    additionalImages: [],
    price: 1090,
    currency: 'CZK',
    params: {
      length: 150,
      type: 'Economy',
      typeId: 3,
      activity: ['Spánek'],
      periods: ['První rok s miminkem', 'Dva až tři roky s batoletem', 'Starší než 3 roky'],
      supportsMultipleSides: true,
    },
  },

  // Cestovní mantinely (Bed Bumper)
  {
    id: 'MM-TRAVEL-120',
    name: 'Cestovní mantinel Monkey Mum® 120 cm',
    description: 'Lehký a snadno přenosný mantinel ideální pro cestování. Rychlá instalace a kompaktní balení.',
    url: 'https://monkeymum.cz/cestovni-mantinel-120',
    imageUrl: '/images/travel-120.jpg',
    additionalImages: [],
    price: 1290,
    currency: 'CZK',
    params: {
      length: 120,
      type: 'Bed Bumper',
      typeId: 7,
      activity: ['Spánek', 'Cestování'],
      periods: ['První rok s miminkem', 'Dva až tři roky s batoletem'],
      supportsMultipleSides: false,
    },
  },
  {
    id: 'MM-TRAVEL-150',
    name: 'Cestovní mantinel Monkey Mum® 150 cm',
    description: 'Lehký a snadno přenosný mantinel ideální pro cestování. Rychlá instalace a kompaktní balení.',
    url: 'https://monkeymum.cz/cestovni-mantinel-150',
    imageUrl: '/images/travel-150.jpg',
    additionalImages: [],
    price: 1390,
    currency: 'CZK',
    params: {
      length: 150,
      type: 'Bed Bumper',
      typeId: 7,
      activity: ['Spánek', 'Cestování'],
      periods: ['První rok s miminkem', 'Dva až tři roky s batoletem'],
      supportsMultipleSides: false,
    },
  },
];

// Legacy export for backward compatibility
export const SAMPLE_PRODUCTS = FALLBACK_PRODUCTS;

export function getProductById(products: Product[], id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByType(products: Product[], type: string): Product[] {
  return products.filter((product) => product.params.type === type);
}

export function getAvailableLengths(products: Product[]): number[] {
  const lengths = new Set(products.map((p) => p.params.length));
  return Array.from(lengths).sort((a, b) => a - b);
}
