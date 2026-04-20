import { Product } from '@/types/product';
import { FormData, SideLength } from '@/types/form';
import { FALLBACK_PRODUCTS } from './products';
import {
  ANSWER_ALLOWED_TYPES,
  CROSS_SELL_TYPE_IDS,
  TYPE_PRIORITY_ORDER,
} from './config';

export interface SideRecommendation {
  sideIndex: number;
  requestedLength: number;
  product: Product;
}

export interface CrossSellRecommendation {
  category: string;
  product: Product;
}

export interface RecommendationResult {
  sides: SideRecommendation[];
  alternativeTypes: Product[];  // Up to 3 alternatives from different types
  crossSellProducts: CrossSellRecommendation[];
  message: string;
  totalPrice: number;
}

// ─── Helpers ────────────────────────────────────────────────────

function getEffectiveLength(side: SideLength): number {
  if (side.length === 'jine') {
    return side.customLength || 150;
  }
  return side.length;
}

function intersect(a: number[], b: number[]): number[] {
  return a.filter((id) => b.includes(id));
}

/**
 * Compute the set of allowed product type IDs by intersecting
 * the allowed sets for each filtering question (Q1, Q4, Q5).
 * Note: Q6 (priority) is now optional and only boosts results, doesn't filter.
 */
function computeAllowedTypeIds(formData: FormData): number[] {
  const filterKeys: Array<{ field: keyof typeof ANSWER_ALLOWED_TYPES; value: string }> = [
    { field: 'bedType', value: formData.bedType },
    { field: 'age', value: formData.age },
    { field: 'usage', value: formData.usage },
    // priority is no longer a filter - it's used for boosting results instead
  ];

  let allowed: number[] | null = null;

  for (const { field, value } of filterKeys) {
    if (!value) continue;
    const mapping = ANSWER_ALLOWED_TYPES[field];
    if (!mapping) continue;
    const ids = mapping[value];
    if (!ids) continue;

    if (allowed === null) {
      allowed = [...ids];
    } else {
      allowed = intersect(allowed, ids);
    }
  }

  // If nothing matched or intersection is empty, fall back to all bed guard types
  if (!allowed || allowed.length === 0) {
    return [1, 2, 3, 4, 5, 6, 7, 8];
  }

  return allowed;
}

/**
 * Filter products to only those whose typeId is in the allowed set.
 */
function filterProductsByTypeIds(products: Product[], allowedIds: number[]): Product[] {
  return products.filter((p) => allowedIds.includes(p.params.typeId));
}

/**
 * Sort products by type priority, preferring types that appear
 * earlier in TYPE_PRIORITY_ORDER.
 */
function sortByTypePriority(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const prioA = TYPE_PRIORITY_ORDER.indexOf(a.params.typeId);
    const prioB = TYPE_PRIORITY_ORDER.indexOf(b.params.typeId);
    const orderA = prioA === -1 ? 99 : prioA;
    const orderB = prioB === -1 ? 99 : prioB;
    if (orderA !== orderB) return orderA - orderB;
    return a.price - b.price;
  });
}

/**
 * Boost products that match the user's priority preference.
 * Products matching the preference are moved to the front while
 * maintaining relative order within each group.
 */
function boostByPriorityPreference(products: Product[], priority: string): Product[] {
  if (!priority) return products;

  const preferredTypeIds = ANSWER_ALLOWED_TYPES.priority?.[priority];
  if (!preferredTypeIds || preferredTypeIds.length === 0) return products;

  // Split into preferred and other products
  const preferred = products.filter((p) => preferredTypeIds.includes(p.params.typeId));
  const others = products.filter((p) => !preferredTypeIds.includes(p.params.typeId));

  // Return preferred products first, then others
  return [...preferred, ...others];
}

/**
 * Find best product matching a requested length from a list.
 * Priority: exact match → closest longer → closest shorter.
 */
function findBestByLength(products: Product[], requestedLength: number): Product | null {
  if (products.length === 0) return null;

  const exact = products.find((p) => p.params.length === requestedLength);
  if (exact) return exact;

  const longer = products
    .filter((p) => p.params.length >= requestedLength)
    .sort((a, b) => a.params.length - b.params.length);
  if (longer.length > 0) return longer[0];

  const shorter = [...products].sort((a, b) => b.params.length - a.params.length);
  return shorter[0];
}

/**
 * Find up to N alternative products from different types than the primary.
 * Returns one product per alternative type, sorted by priority.
 */
function findAlternatives(
  eligible: Product[],
  primaryTypeId: number,
  requestedLength: number,
  maxAlternatives: number = 3
): Product[] {
  const altProducts = eligible.filter((p) => p.params.typeId !== primaryTypeId);
  const sorted = sortByTypePriority(altProducts);

  const alternatives: Product[] = [];
  const usedTypeIds = new Set<number>();

  for (const product of sorted) {
    if (alternatives.length >= maxAlternatives) break;
    if (usedTypeIds.has(product.params.typeId)) continue;

    // Find best product of this type for the requested length
    const productsOfType = sorted.filter((p) => p.params.typeId === product.params.typeId);
    const bestForLength = findBestByLength(productsOfType, requestedLength);

    if (bestForLength) {
      alternatives.push(bestForLength);
      usedTypeIds.add(product.params.typeId);
    }
  }

  return alternatives;
}

function generateMessage(primaryType: string, sideCount: number): string {
  const messages: string[] = [];

  switch (primaryType) {
    case 'Premium':
      messages.push('Prémiová kvalita pro maximální bezpečí a komfort.');
      break;
    case 'Popular':
      messages.push('Nejoblíbenější volba s perfektním poměrem ceny a výkonu.');
      break;
    case 'Economy':
      messages.push('Spolehlivá ochrana za výbornou cenu.');
      break;
    case 'Flip':
    case 'Smart':
      messages.push('Stabilní řešení s pevným uchycením k posteli.');
      break;
    case 'Bed Bumper':
      messages.push('Přenosné řešení ideální na cesty i doma.');
      break;
    case 'Short':
      messages.push('Kompaktní zábrana pro menší postele.');
      break;
    default:
      messages.push('Doporučení na míru vaší situaci.');
  }

  if (sideCount > 1) {
    messages.push(`Připravili jsme nákupní seznam pro ${sideCount} strany vaší postele.`);
  }

  return messages.join(' ');
}

// ─── Main recommendation function ──────────────────────────────

export function getRecommendations(formData: FormData, sourceProducts?: Product[]): RecommendationResult {
  const allProducts = sourceProducts || FALLBACK_PRODUCTS;

  // Step 1: Compute intersection of allowed type IDs
  const allowedIds = computeAllowedTypeIds(formData);

  // Step 2: Filter products to eligible set
  let eligible = filterProductsByTypeIds(allProducts, allowedIds);

  // Fallback: if no products match the intersection, relax to all products
  if (eligible.length === 0) {
    eligible = allProducts;
  }

  // Step 3: Sort eligible products by type priority, then boost by user's priority preference
  let sorted = sortByTypePriority(eligible);
  sorted = boostByPriorityPreference(sorted, formData.priority);

  // Step 4: For each side, find best product by length
  const sides: SideRecommendation[] = [];
  for (const side of formData.lengths) {
    const requestedLength = getEffectiveLength(side);
    const product = findBestByLength(sorted, requestedLength);

    if (product) {
      sides.push({
        sideIndex: side.sideIndex,
        requestedLength,
        product,
      });
    }
  }

  // Step 5: Find up to 3 alternatives from different types
  const primaryTypeId = sides.length > 0 ? sides[0].product.params.typeId : 1;
  const firstLength = sides.length > 0 ? sides[0].requestedLength : 150;
  const alternativeTypes = findAlternatives(eligible, primaryTypeId, firstLength, 3);

  // Step 6: Cross-sell products (from Q7)
  const crossSellProducts: CrossSellRecommendation[] = [];
  for (const cs of formData.crossSell) {
    const csTypeIds = CROSS_SELL_TYPE_IDS[cs];
    if (!csTypeIds) continue;

    const csProducts = filterProductsByTypeIds(allProducts, csTypeIds);
    if (csProducts.length > 0) {
      // Pick cheapest cross-sell product
      const cheapest = [...csProducts].sort((a, b) => a.price - b.price)[0];
      crossSellProducts.push({ category: cs, product: cheapest });
    }
  }

  const totalPrice = sides.reduce((sum, s) => sum + s.product.price, 0);
  const primaryTypeName = sides.length > 0 ? sides[0].product.params.type : 'Popular';
  const message = generateMessage(primaryTypeName, formData.lengths.length);

  return {
    sides,
    alternativeTypes,
    crossSellProducts,
    message,
    totalPrice,
  };
}

export function generateTags(formData: FormData, sides: SideRecommendation[]): string[] {
  const tags: string[] = ['monkey-mum-selector'];

  for (const side of sides) {
    const productTag = `zabrana-${side.product.params.type.toLowerCase().replace(/\s+/g, '-')}-${side.product.params.length}`;
    if (!tags.includes(productTag)) {
      tags.push(productTag);
    }
  }

  if (formData.age) tags.push(`vek-${formData.age}`);
  if (formData.usage) tags.push(`pouziti-${formData.usage}`);
  if (formData.priority) tags.push(`priorita-${formData.priority}`);

  for (const cs of formData.crossSell) {
    tags.push(`cross-sell-${cs}`);
  }

  tags.push(`strany-${formData.lengths.length}`);

  return tags;
}
