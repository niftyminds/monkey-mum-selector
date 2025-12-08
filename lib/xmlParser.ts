import { Product, ProductType, Activity, Period } from '@/types/product';

const FEED_URL = 'https://feeds.mergado.com/monkeymum-com-google-nakupy-cz-c52ab2782b7b3f3fab53f79672db2a0b.xml';

// Product types to include
const ALLOWED_PRODUCT_TYPES = [
  'Zábrany na postel',
  'Bezpečnostní ohrádky',
];

// Exclude products with these keywords in title (case insensitive)
const EXCLUDED_KEYWORDS = [
  'rozbalené',
  'rozbalená',
  'doprodej',
  'náhradní díly',
  'koncovky',
  'bezpečnostní pás',
  'cestovní vak',
  'prodloužení',
  'bezpečnostní zábrana monkey mum® small',
  'bezpečnostní zábrana monkey mum® medium',
  'bezpečnostní zábrana monkey mum® large',
  'bezpečnostní ohrádka',
  'ohrádkové konektory',
  'short',
  'flip',
  'smart',
];

interface RawProduct {
  id: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  price: string;
  availability: string;
  productType: string | null;
  details: Record<string, string[]>;
}

function extractValue(item: string, tagName: string): string | null {
  const regex = new RegExp(`<g:${tagName}>([^<]*)<\\/g:${tagName}>`);
  const match = item.match(regex);
  return match ? match[1] : null;
}

function extractProductDetails(item: string): Record<string, string[]> {
  const detailsRegex = /<g:product_detail>[\s\S]*?<g:attribute_name>([^<]+)<\/g:attribute_name>[\s\S]*?<g:attribute_value>([^<]+)<\/g:attribute_value>[\s\S]*?<\/g:product_detail>/g;
  const details: Record<string, string[]> = {};
  let match;

  while ((match = detailsRegex.exec(item)) !== null) {
    const attrName = match[1];
    const attrValue = match[2];
    if (!details[attrName]) {
      details[attrName] = [];
    }
    details[attrName].push(attrValue);
  }

  return details;
}

function parsePrice(priceStr: string): number {
  // "1990 CZK" -> 1990
  const match = priceStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseLength(lengthStr: string | undefined): number {
  if (!lengthStr) return 0;
  // "150 cm" -> 150
  const match = lengthStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function mapProductType(typeStr: string | undefined): ProductType {
  if (!typeStr) return 'Popular';

  const typeLower = typeStr.toLowerCase();
  if (typeLower.includes('premium')) return 'Premium';
  if (typeLower.includes('popular')) return 'Popular';
  if (typeLower.includes('economy')) return 'Economy';
  if (typeLower.includes('cestovní')) return 'Cestovní';

  return 'Popular';
}

function mapActivities(activities: string[] | undefined): Activity[] {
  if (!activities || activities.length === 0) return ['Spánek'];

  const mapped: Activity[] = [];
  for (const activity of activities) {
    if (activity.toLowerCase().includes('spánek')) {
      mapped.push('Spánek');
    }
    if (activity.toLowerCase().includes('cestování')) {
      mapped.push('Cestování');
    }
  }

  return mapped.length > 0 ? mapped : ['Spánek'];
}

function mapPeriods(periods: string[] | undefined): Period[] {
  if (!periods || periods.length === 0) {
    // Default periods for bed guards
    return ['Šestinedělí', 'První rok s miminkem', 'Dva až tři roky s batoletem'];
  }

  const validPeriods: Period[] = [
    'Šestinedělí',
    'První rok s miminkem',
    'Dva až tři roky s batoletem',
    'Starší než 3 roky',
  ];

  return periods.filter((p) => validPeriods.includes(p as Period)) as Period[];
}

function shouldIncludeProduct(raw: RawProduct): boolean {
  // Check availability
  if (raw.availability !== 'in_stock') {
    return false;
  }

  // Check product type
  const hasValidType = raw.productType && ALLOWED_PRODUCT_TYPES.some(
    (type) => raw.productType!.includes(type)
  );

  if (!hasValidType) {
    return false;
  }

  // Check excluded keywords (case insensitive)
  const titleLower = raw.title.toLowerCase();
  for (const keyword of EXCLUDED_KEYWORDS) {
    if (titleLower.includes(keyword)) {
      return false;
    }
  }

  // Must have a valid length (exclude accessories without length)
  const lengthStr = raw.details['Délka postele']?.[0];
  if (!lengthStr) {
    return false;
  }

  return true;
}

function rawToProduct(raw: RawProduct): Product {
  const typeStr = raw.details['Typ zábran']?.[0];
  const lengthStr = raw.details['Délka postele']?.[0];

  return {
    id: raw.id,
    name: raw.title,
    description: raw.description,
    url: raw.link,
    imageUrl: raw.imageLink,
    price: parsePrice(raw.price),
    currency: 'CZK',
    params: {
      length: parseLength(lengthStr),
      type: mapProductType(typeStr),
      activity: mapActivities(raw.details['Aktivita']),
      periods: mapPeriods(raw.details['Období']),
      supportsMultipleSides: !typeStr?.toLowerCase().includes('cestovní'),
    },
  };
}

export async function fetchProductsFromFeed(): Promise<Product[]> {
  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`);
    }

    const xml = await response.text();

    // Parse items
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const products: Product[] = [];
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1];

      const raw: RawProduct = {
        id: extractValue(itemContent, 'id') || '',
        title: extractValue(itemContent, 'title') || '',
        description: extractValue(itemContent, 'description') || '',
        link: extractValue(itemContent, 'link') || '',
        imageLink: extractValue(itemContent, 'image_link') || '',
        price: extractValue(itemContent, 'price') || '0 CZK',
        availability: extractValue(itemContent, 'availability') || 'out_of_stock',
        productType: extractValue(itemContent, 'product_type'),
        details: extractProductDetails(itemContent),
      };

      if (shouldIncludeProduct(raw)) {
        products.push(rawToProduct(raw));
      }
    }

    // Sort by type priority and then by length
    const typePriority: Record<ProductType, number> = {
      'Popular': 1,
      'Premium': 2,
      'Cestovní': 3,
      'Economy': 4,
    };

    products.sort((a, b) => {
      const priorityDiff = typePriority[a.params.type] - typePriority[b.params.type];
      if (priorityDiff !== 0) return priorityDiff;
      return a.params.length - b.params.length;
    });

    return products;
  } catch (error) {
    console.error('Error fetching products from feed:', error);
    return [];
  }
}

// For server-side static generation
export async function getStaticProducts(): Promise<Product[]> {
  return fetchProductsFromFeed();
}
