import { Product } from '@/types/product';
import { FormData, SideLength } from '@/types/form';
import { FALLBACK_PRODUCTS } from './products';

export interface SideRecommendation {
  sideIndex: number;
  requestedLength: number;
  product: Product;
}

export interface RecommendationResult {
  sides: SideRecommendation[];
  alternativeType: Product | null;
  message: string;
  totalPrice: number;
}

function getEffectiveLength(side: SideLength): number {
  if (side.length === 'jine') {
    return side.customLength || 150;
  }
  return side.length;
}

function determineProductType(formData: FormData): string {
  // Usage takes priority for travel
  if (formData.usage === 'pouze-cesty') return 'Cestovní';

  // Priority determines type
  switch (formData.priority) {
    case 'premium':
    case 'stabilita':
      return 'Premium';
    case 'pomer-cena-vykon':
    case 'bez-vrtani':
      return 'Popular';
    case 'nejnizsi-cena':
      return 'Economy';
    default:
      return 'Popular';
  }
}

function findBestProduct(
  products: Product[],
  targetType: string,
  requestedLength: number
): Product | null {
  const typeProducts = products.filter((p) => p.params.type === targetType);
  if (typeProducts.length === 0) return null;

  // Exact match
  const exact = typeProducts.find((p) => p.params.length === requestedLength);
  if (exact) return exact;

  // Closest longer
  const longer = typeProducts
    .filter((p) => p.params.length >= requestedLength)
    .sort((a, b) => a.params.length - b.params.length);
  if (longer.length > 0) return longer[0];

  // Closest shorter
  const shorter = typeProducts
    .sort((a, b) => b.params.length - a.params.length);
  return shorter[0] || null;
}

function findAlternativeProduct(
  products: Product[],
  primaryType: string,
  requestedLength: number,
  formData: FormData
): Product | null {
  // Pick a different type as alternative
  let altType: string;
  if (primaryType === 'Premium') {
    altType = 'Popular';
  } else if (primaryType === 'Popular') {
    altType = 'Premium';
  } else if (primaryType === 'Economy') {
    altType = 'Popular';
  } else if (primaryType === 'Cestovní') {
    altType = 'Popular';
  } else {
    altType = 'Popular';
  }

  // If usage includes travel, offer travel as alternative
  if (formData.usage === 'doma-i-cesty' && primaryType !== 'Cestovní') {
    const travelProduct = findBestProduct(products, 'Cestovní', requestedLength);
    if (travelProduct) return travelProduct;
  }

  return findBestProduct(products, altType, requestedLength);
}

function generateMessage(productType: string, formData: FormData): string {
  const messages: string[] = [];

  if (productType === 'Cestovní') {
    messages.push('Ideální volba pro rodiny, které často cestují.');
  } else if (productType === 'Premium') {
    messages.push('Prémiová kvalita pro maximální bezpečí a komfort.');
  } else if (productType === 'Popular') {
    messages.push('Nejoblíbenější volba s perfektním poměrem ceny a výkonu.');
  } else if (productType === 'Economy') {
    messages.push('Spolehlivá ochrana za výbornou cenu.');
  }

  if (formData.lengths.length > 1) {
    messages.push(`Připravili jsme nákupní seznam pro ${formData.lengths.length} strany vaší postele.`);
  }

  return messages.join(' ');
}

export function getRecommendations(formData: FormData, sourceProducts?: Product[]): RecommendationResult {
  const products = sourceProducts || FALLBACK_PRODUCTS;
  const targetType = determineProductType(formData);
  const sides: SideRecommendation[] = [];

  // For each side, find the best product
  for (const side of formData.lengths) {
    const requestedLength = getEffectiveLength(side);
    let product = findBestProduct(products, targetType, requestedLength);

    // Fallback: try any type
    if (!product) {
      product = findBestProduct(products, 'Popular', requestedLength)
        || findBestProduct(products, 'Premium', requestedLength)
        || findBestProduct(products, 'Economy', requestedLength)
        || products[0];
    }

    if (product) {
      sides.push({
        sideIndex: side.sideIndex,
        requestedLength,
        product,
      });
    }
  }

  // Find alternative of different type
  const firstLength = sides.length > 0 ? sides[0].requestedLength : 150;
  const alternativeType = findAlternativeProduct(products, targetType, firstLength, formData);

  const totalPrice = sides.reduce((sum, s) => sum + s.product.price, 0);
  const message = generateMessage(targetType, formData);

  return {
    sides,
    alternativeType,
    message,
    totalPrice,
  };
}

export function generateTags(formData: FormData, sides: SideRecommendation[]): string[] {
  const tags: string[] = ['monkey-mum-selector'];

  // Product tags
  for (const side of sides) {
    const productTag = `zabrana-${side.product.params.type.toLowerCase()}-${side.product.params.length}`;
    if (!tags.includes(productTag)) {
      tags.push(productTag);
    }
  }

  // Age tag
  if (formData.age) {
    tags.push(`vek-${formData.age}`);
  }

  // Usage tag
  if (formData.usage) {
    tags.push(`pouziti-${formData.usage}`);
  }

  // Priority tag
  if (formData.priority) {
    tags.push(`priorita-${formData.priority}`);
  }

  // Cross-sell tags
  for (const cs of formData.crossSell) {
    tags.push(`cross-sell-${cs}`);
  }

  // Side count
  tags.push(`strany-${formData.lengths.length}`);

  return tags;
}
