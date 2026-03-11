import { Product, ProductType, Activity, Period } from '@/types/product';
import { TYPE_ID_MAP } from './config';

const FEED_URL = 'https://feeds.mergado.com/monkeymum-com-google-nakupy-cz-c52ab2782b7b3f3fab53f79672db2a0b.xml';

// Product types to include from the feed
const ALLOWED_PRODUCT_TYPES = [
  'Zábrany na postel',
  'Bezpečnostní ohrádky',
  'Bezpečnostní zábrany',
  'Jídelní židličky',
  'Dětské postýlky',
];

// Exclude only truly unwanted items (spare parts, opened packages)
const EXCLUDED_KEYWORDS = [
  'rozbalené',
  'rozbalená',
  'doprodej',
  'náhradní díly',
  'koncovky',
  'bezpečnostní pás',
  'prodloužení',
  'ohrádkové konektory',
];

interface RawProduct {
  id: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  additionalImageLinks: string[];
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

function extractAllValues(item: string, tagName: string): string[] {
  const regex = new RegExp(`<g:${tagName}>([^<]*)<\\/g:${tagName}>`, 'g');
  const values: string[] = [];
  let match;
  while ((match = regex.exec(item)) !== null) {
    values.push(match[1]);
  }
  return values;
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
  const match = priceStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseLength(lengthStr: string | undefined): number {
  if (!lengthStr) return 0;
  const match = lengthStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function mapProductType(title: string, typeStr: string | undefined): ProductType {
  const titleLower = title.toLowerCase();

  // Map by title keywords first (most specific)
  if (titleLower.includes('jídelní židlička') || titleLower.includes('židlička')) return 'Židlička';
  if (titleLower.includes('dětská postýlka') || titleLower.includes('postýlka')) return 'Postýlka';
  if (titleLower.includes('postel se zábranou')) return 'Postel';
  if (titleLower.includes('bezpečnostní ohrádka') || titleLower.includes('ohrádka')) return 'Ohrádka';
  if (titleLower.includes('safety gate')
    || titleLower.includes('bezpečnostní zábrana monkey mum® small')
    || titleLower.includes('bezpečnostní zábrana monkey mum® medium')
    || titleLower.includes('bezpečnostní zábrana monkey mum® large')) return 'Safety Gate';
  if (titleLower.includes('cestovní vak') && titleLower.includes('bed bumper')) return 'Cestovní Vak Bumper';
  if (titleLower.includes('cestovní vak') && titleLower.includes('malý')) return 'Cestovní Vak Malý';
  if (titleLower.includes('cestovní vak')) return 'Cestovní Vak';
  if (titleLower.includes('cestovní mantinel') || titleLower.includes('bed bumper')) return 'Bed Bumper';
  if (titleLower.includes('nová zábrana')) return 'Nová Zábrana';
  if (titleLower.includes('flip')) return 'Flip';
  if (titleLower.includes('smart')) return 'Smart';
  if (titleLower.includes('short')) return 'Short';

  // Then by type attribute
  if (typeStr) {
    const typeLower = typeStr.toLowerCase();
    if (typeLower.includes('premium')) return 'Premium';
    if (typeLower.includes('popular')) return 'Popular';
    if (typeLower.includes('economy')) return 'Economy';
    if (typeLower.includes('flip')) return 'Flip';
    if (typeLower.includes('smart')) return 'Smart';
    if (typeLower.includes('short')) return 'Short';
    if (typeLower.includes('cestovní')) return 'Bed Bumper';
  }

  // Final fallback: detect from title
  if (titleLower.includes('premium')) return 'Premium';
  if (titleLower.includes('economy')) return 'Economy';
  if (titleLower.includes('popular')) return 'Popular';

  return 'Popular';
}

function mapActivities(activities: string[] | undefined): Activity[] {
  if (!activities || activities.length === 0) return ['Spánek'];

  const mapped: Activity[] = [];
  for (const activity of activities) {
    if (activity.toLowerCase().includes('spánek')) mapped.push('Spánek');
    if (activity.toLowerCase().includes('cestování')) mapped.push('Cestování');
  }

  return mapped.length > 0 ? mapped : ['Spánek'];
}

function mapPeriods(periods: string[] | undefined): Period[] {
  if (!periods || periods.length === 0) {
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
  if (raw.availability !== 'in_stock') return false;

  // Check excluded keywords
  const titleLower = raw.title.toLowerCase();
  for (const keyword of EXCLUDED_KEYWORDS) {
    if (titleLower.includes(keyword)) return false;
  }

  // Must have product type or be recognizable from title
  const hasValidType = raw.productType && ALLOWED_PRODUCT_TYPES.some(
    (type) => raw.productType!.includes(type)
  );

  // Also accept products we can classify by title
  const recognizable = titleLower.includes('zábrana')
    || titleLower.includes('mantinel')
    || titleLower.includes('ohrádka')
    || titleLower.includes('safety gate')
    || titleLower.includes('židlička')
    || titleLower.includes('postýlka')
    || titleLower.includes('cestovní vak');

  if (!hasValidType && !recognizable) return false;

  return true;
}

function rawToProduct(raw: RawProduct): Product {
  const typeStr = raw.details['Typ zábran']?.[0];
  const lengthStr = raw.details['Délka postele']?.[0];
  const productType = mapProductType(raw.title, typeStr);
  const typeId = TYPE_ID_MAP[productType] || 1;

  return {
    id: raw.id,
    name: raw.title,
    description: raw.description,
    url: raw.link,
    imageUrl: raw.imageLink,
    additionalImages: raw.additionalImageLinks,
    price: parsePrice(raw.price),
    currency: 'CZK',
    params: {
      length: parseLength(lengthStr),
      type: productType,
      typeId,
      activity: mapActivities(raw.details['Aktivita']),
      periods: mapPeriods(raw.details['Období']),
      supportsMultipleSides: !['Bed Bumper', 'Cestovní Vak', 'Cestovní Vak Malý', 'Cestovní Vak Bumper'].includes(productType),
    },
  };
}

export async function fetchProductsFromFeed(): Promise<Product[]> {
  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feed: ' + response.status);
    }

    const xml = await response.text();

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
        additionalImageLinks: extractAllValues(itemContent, 'additional_image_link'),
        price: extractValue(itemContent, 'price') || '0 CZK',
        availability: extractValue(itemContent, 'availability') || 'out_of_stock',
        productType: extractValue(itemContent, 'product_type'),
        details: extractProductDetails(itemContent),
      };

      if (shouldIncludeProduct(raw)) {
        products.push(rawToProduct(raw));
      }
    }

    // Sort by type ID then by length
    products.sort((a, b) => {
      if (a.params.typeId !== b.params.typeId) return a.params.typeId - b.params.typeId;
      return a.params.length - b.params.length;
    });

    return products;
  } catch (error) {
    console.error('Error fetching products from feed:', error);
    return [];
  }
}

export async function getStaticProducts(): Promise<Product[]> {
  return fetchProductsFromFeed();
}
