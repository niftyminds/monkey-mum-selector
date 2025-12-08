import { Product, Period as ProductPeriod } from '@/types/product';
import { FormData } from '@/types/form';
import { FALLBACK_PRODUCTS } from './products';
import { PERIOD_MAP } from './config';

export interface RecommendationResult {
  primary: Product;
  alternatives: Product[];
  message: string;
}

function mapFormPeriodToProductPeriod(formPeriod: string): ProductPeriod {
  return PERIOD_MAP[formPeriod] as ProductPeriod;
}

function getDesiredLength(formLength: string): number | null {
  if (formLength === 'nevim') {
    return null;
  }
  return parseInt(formLength, 10);
}

function filterByLength(products: Product[], desiredLength: number | null): Product[] {
  if (desiredLength === null) {
    // If unknown, return products sorted by length (medium first)
    return [...products].sort((a, b) => {
      const targetLength = 150;
      return Math.abs(a.params.length - targetLength) - Math.abs(b.params.length - targetLength);
    });
  }

  // First try exact match
  const exactMatch = products.filter((p) => p.params.length === desiredLength);
  if (exactMatch.length > 0) {
    return exactMatch;
  }

  // Then try closest longer variant
  const longerProducts = products
    .filter((p) => p.params.length >= desiredLength)
    .sort((a, b) => a.params.length - b.params.length);

  if (longerProducts.length > 0) {
    return longerProducts;
  }

  // Fallback: closest shorter variant
  return [...products].sort((a, b) => {
    return Math.abs(a.params.length - desiredLength) - Math.abs(b.params.length - desiredLength);
  });
}

function filterByPeriod(products: Product[], period: string): Product[] {
  const productPeriod = mapFormPeriodToProductPeriod(period);
  if (!productPeriod) return products;

  const filtered = products.filter((p) => p.params.periods.includes(productPeriod));
  return filtered.length > 0 ? filtered : products;
}

function filterByActivity(products: Product[], activity: string): Product[] {
  if (activity === 'cestovani') {
    // Prefer travel products, but don't exclude others
    const travelProducts = products.filter((p) => p.params.activity.includes('Cestování'));
    if (travelProducts.length > 0) {
      return travelProducts;
    }
  }
  return products;
}

function filterByBudget(products: Product[], budget: string): Product[] {
  if (budget === 'do-1500') {
    const filtered = products.filter((p) => p.price <= 1500);
    return filtered.length > 0 ? filtered : products;
  }
  if (budget === 'nad-1500') {
    const filtered = products.filter((p) => p.price > 1500);
    return filtered.length > 0 ? filtered : products;
  }
  return products;
}

function sortByPreference(products: Product[], preference: string): Product[] {
  const typeOrder: Record<string, number> = {
    Premium: 1,
    Popular: 2,
    Cestovní: 3,
    Economy: 4,
  };

  return [...products].sort((a, b) => {
    if (preference === 'premium') {
      // Premium first, then by price descending
      if (a.params.type === 'Premium' && b.params.type !== 'Premium') return -1;
      if (b.params.type === 'Premium' && a.params.type !== 'Premium') return 1;
      return b.price - a.price;
    }

    if (preference === 'popular') {
      // Popular first, then by price
      if (a.params.type === 'Popular' && b.params.type !== 'Popular') return -1;
      if (b.params.type === 'Popular' && a.params.type !== 'Popular') return 1;
      return a.price - b.price;
    }

    if (preference === 'economy') {
      // Sort by price ascending
      return a.price - b.price;
    }

    // Default: Popular > Premium > Cestovní > Economy, then by price
    const orderA = typeOrder[a.params.type] || 5;
    const orderB = typeOrder[b.params.type] || 5;
    if (orderA !== orderB) return orderA - orderB;
    return a.price - b.price;
  });
}

function filterByMultipleSides(products: Product[], sides: string): Product[] {
  if (sides === 'vice') {
    const filtered = products.filter((p) => p.params.supportsMultipleSides);
    return filtered.length > 0 ? filtered : products;
  }
  return products;
}

export function getRecommendations(formData: FormData, sourceProducts?: Product[]): RecommendationResult {
  let products = [...(sourceProducts || FALLBACK_PRODUCTS)];

  // 1. Filter by activity (cestování vs doma)
  products = filterByActivity(products, formData.activity);

  // 2. Filter by period
  products = filterByPeriod(products, formData.period);

  // 3. Filter by budget
  products = filterByBudget(products, formData.budget);

  // 4. Filter by multiple sides support
  products = filterByMultipleSides(products, formData.sides);

  // 5. Filter by length
  const desiredLength = getDesiredLength(formData.length);
  products = filterByLength(products, desiredLength);

  // 6. Sort by preference
  products = sortByPreference(products, formData.preference);

  // Get primary and alternatives
  const primary = products[0];
  const alternatives = products.slice(1, 4);

  // Generate message
  let message = generateMessage(primary, formData);

  return {
    primary,
    alternatives,
    message,
  };
}

function generateMessage(product: Product, formData: FormData): string {
  const messages: string[] = [];

  if (formData.activity === 'cestovani' && product.params.type === 'Cestovní') {
    messages.push('Ideální volba pro rodiny, které často cestují.');
  } else if (product.params.type === 'Premium') {
    messages.push('Prémiová kvalita pro maximální bezpečí a komfort.');
  } else if (product.params.type === 'Popular') {
    messages.push('Nejoblíbenější volba s perfektním poměrem ceny a výkonu.');
  } else if (product.params.type === 'Economy') {
    messages.push('Spolehlivá ochrana za výbornou cenu.');
  }

  if (formData.sides === 'vice') {
    messages.push('Můžete kombinovat více zábran pro kompletní ochranu.');
  }

  return messages.join(' ');
}

export function generateTags(formData: FormData, product: Product): string[] {
  const tags: string[] = ['monkey-mum-selector'];

  // Product tag
  const productTag = `zabrana-${product.params.type.toLowerCase()}-${product.params.length}`;
  tags.push(productTag);

  // Period tag
  const periodTagMap: Record<string, string> = {
    'sestinedeli': 'obdobi-sestinedeli',
    'prvni-rok': 'obdobi-prvni-rok',
    'dva-tri-roky': 'obdobi-dva-tri-roky',
    'starsi-3-roky': 'obdobi-starsi-3-roky',
  };
  if (formData.period && periodTagMap[formData.period]) {
    tags.push(periodTagMap[formData.period]);
  }

  // Activity tag
  if (formData.activity === 'cestovani') {
    tags.push('aktivita-cestovani');
  }

  return tags;
}
