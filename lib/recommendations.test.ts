import { describe, it, expect } from 'vitest';
import { getRecommendations } from './recommendations';
import { FormData } from '@/types/form';
import { Product } from '@/types/product';

// ─── Test product catalog covering all relevant type IDs ────────
const TEST_PRODUCTS: Product[] = [
  // Popular (typeId 1)
  { id: 'pop-120', name: 'Popular 120', description: '', url: '', imageUrl: '', price: 1390, currency: 'CZK', params: { length: 120, type: 'Popular', typeId: 1, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  { id: 'pop-150', name: 'Popular 150', description: '', url: '', imageUrl: '', price: 1490, currency: 'CZK', params: { length: 150, type: 'Popular', typeId: 1, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  { id: 'pop-200', name: 'Popular 200', description: '', url: '', imageUrl: '', price: 1690, currency: 'CZK', params: { length: 200, type: 'Popular', typeId: 1, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  // Premium (typeId 2)
  { id: 'prem-150', name: 'Premium 150', description: '', url: '', imageUrl: '', price: 2290, currency: 'CZK', params: { length: 150, type: 'Premium', typeId: 2, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  { id: 'prem-200', name: 'Premium 200', description: '', url: '', imageUrl: '', price: 2490, currency: 'CZK', params: { length: 200, type: 'Premium', typeId: 2, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  // Economy (typeId 3)
  { id: 'eco-100', name: 'Economy 100', description: '', url: '', imageUrl: '', price: 890, currency: 'CZK', params: { length: 100, type: 'Economy', typeId: 3, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  { id: 'eco-150', name: 'Economy 150', description: '', url: '', imageUrl: '', price: 1090, currency: 'CZK', params: { length: 150, type: 'Economy', typeId: 3, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  // Flip (typeId 4)
  { id: 'flip-150', name: 'Flip 150', description: '', url: '', imageUrl: '', price: 1590, currency: 'CZK', params: { length: 150, type: 'Flip', typeId: 4, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  // Smart (typeId 5)
  { id: 'smart-150', name: 'Smart 150', description: '', url: '', imageUrl: '', price: 1190, currency: 'CZK', params: { length: 150, type: 'Smart', typeId: 5, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  // Short (typeId 6)
  { id: 'short-80', name: 'Short 80', description: '', url: '', imageUrl: '', price: 790, currency: 'CZK', params: { length: 80, type: 'Short', typeId: 6, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  // Bed Bumper (typeId 7)
  { id: 'bumper-120', name: 'Bed Bumper 120', description: '', url: '', imageUrl: '', price: 1290, currency: 'CZK', params: { length: 120, type: 'Bed Bumper', typeId: 7, activity: ['Spánek', 'Cestování'], periods: ['Šestinedělí'], supportsMultipleSides: false } },
  // Nová Zábrana (typeId 8)
  { id: 'nova-150', name: 'Nová Zábrana 150', description: '', url: '', imageUrl: '', price: 1490, currency: 'CZK', params: { length: 150, type: 'Nová Zábrana', typeId: 8, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: true } },
  // Ohrádka (typeId 9)
  { id: 'ohradka-1', name: 'Ohrádka', description: '', url: '', imageUrl: '', price: 3990, currency: 'CZK', params: { length: 0, type: 'Ohrádka', typeId: 9, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: false } },
  // Safety Gate (typeId 10)
  { id: 'gate-1', name: 'Safety Gate', description: '', url: '', imageUrl: '', price: 1990, currency: 'CZK', params: { length: 0, type: 'Safety Gate', typeId: 10, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: false } },
  // Postel (typeId 11)
  { id: 'postel-1', name: 'Postel se zábranou', description: '', url: '', imageUrl: '', price: 8990, currency: 'CZK', params: { length: 160, type: 'Postel', typeId: 11, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: false } },
  // Postýlka (typeId 12)
  { id: 'postylka-1', name: 'Dětská postýlka', description: '', url: '', imageUrl: '', price: 5990, currency: 'CZK', params: { length: 120, type: 'Postýlka', typeId: 12, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: false } },
  // Židlička (typeId 16)
  { id: 'zidlicka-1', name: 'Jídelní židlička', description: '', url: '', imageUrl: '', price: 2990, currency: 'CZK', params: { length: 0, type: 'Židlička', typeId: 16, activity: ['Spánek'], periods: ['Šestinedělí'], supportsMultipleSides: false } },
];

function makeFormData(overrides: Partial<FormData> = {}): FormData {
  return {
    bedType: 'klasicka',
    sleepPosition: 'u-zdi',
    lengths: [{ sideIndex: 0, length: 150 }],
    age: '0-3',
    usage: 'pouze-doma',
    priority: 'pomer-cena-vykon',
    crossSell: [],
    ...overrides,
  };
}

// ─── Intersection logic tests ───────────────────────────────────

describe('Intersection-based type filtering', () => {
  it('klasická + 0-3 + pouze-doma + poměr cena/výkon → Popular (typeId 1)', () => {
    // bedType klasicka: [1,2,3,4,5,7,8]
    // age 0-3: [1,2,3,4,5,6,7,8,12]
    // usage pouze-doma: [1,2,3,4,5,6,7,8]
    // priority pomer-cena-vykon: [1]
    // intersection = [1]
    const form = makeFormData();
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect(result.sides).toHaveLength(1);
    expect(result.sides[0].product.params.typeId).toBe(1); // Popular
  });

  it('klasická + 0-3 + pouze-doma + stabilita → Economy/Flip/Smart (typeId 3,4,5)', () => {
    // bedType klasicka: [1,2,3,4,5,7,8]
    // age 0-3: [1,2,3,4,5,6,7,8,12]
    // usage pouze-doma: [1,2,3,4,5,6,7,8]
    // priority stabilita: [3,4,5]
    // intersection = [3,4,5]
    const form = makeFormData({ priority: 'stabilita' });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect([3, 4, 5]).toContain(result.sides[0].product.params.typeId);
  });

  it('klasická + 0-3 + pouze-doma + premium → Popular+Premium (typeId 1,2)', () => {
    // bedType klasicka: [1,2,3,4,5,7,8]
    // age 0-3: [1,2,3,4,5,6,7,8,12]
    // usage pouze-doma: [1,2,3,4,5,6,7,8]
    // priority premium: [1,2]
    // intersection = [1,2]
    const form = makeFormData({ priority: 'premium' });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect([1, 2]).toContain(result.sides[0].product.params.typeId);
  });

  it('klasická + 0-3 + pouze-doma + nejnižší cena → Economy/Smart/Short (3,5,6)', () => {
    // bedType klasicka: [1,2,3,4,5,7,8]
    // age 0-3: [1,2,3,4,5,6,7,8,12]
    // usage pouze-doma: [1,2,3,4,5,6,7,8]
    // priority nejnizsi-cena: [3,5,6]
    // intersection = [3,5,6]
    const form = makeFormData({ priority: 'nejnizsi-cena' });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect([3, 5, 6]).toContain(result.sides[0].product.params.typeId);
  });

  it('boxspring + 3-plus + pouze-doma + bez-vrtání → Popular/Premium (1,2)', () => {
    // bedType boxspring: [1,2,3,4,5,6,7,8]
    // age 3-plus: [1,2,6,7,12]
    // usage pouze-doma: [1,2,3,4,5,6,7,8]
    // priority bez-vrtani: [1,2,6,7,8]
    // intersection = [1,2,6,7]
    const form = makeFormData({
      bedType: 'boxspring',
      age: '3-plus',
      priority: 'bez-vrtani',
    });
    const result = getRecommendations(form, TEST_PRODUCTS);

    // Should prefer Popular (1) or Premium (2) based on TYPE_PRIORITY_ORDER
    expect([1, 2, 6, 7]).toContain(result.sides[0].product.params.typeId);
  });

  it('valenda + jine usage/priority → Postel/Postýlka (typeId 11,12)', () => {
    // bedType valenda: [11, 12]
    // age jine: ALL_IDS
    // usage jine: ALL_IDS
    // priority not set → no filter
    // intersection = [11, 12]
    const form = makeFormData({
      bedType: 'valenda',
      age: 'jine',
      usage: 'jine',
      priority: '',
    });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect([11, 12]).toContain(result.sides[0].product.params.typeId);
  });

  it('valenda + pouze-doma → empty intersection → fallback to all', () => {
    // bedType valenda: [11, 12]
    // usage pouze-doma: [1,2,3,4,5,6,7,8]
    // intersection = [] → fallback
    const form = makeFormData({ bedType: 'valenda' });
    const result = getRecommendations(form, TEST_PRODUCTS);

    // Falls back to all products, should still return something
    expect(result.sides).toHaveLength(1);
    expect(result.sides[0].product).toBeTruthy();
  });

  it('pouze-cesty usage narrows to travel types (7,8,13,14,15)', () => {
    // bedType klasicka: [1,2,3,4,5,7,8]
    // age 0-3: [1,2,3,4,5,6,7,8,12]
    // usage pouze-cesty: [7,8,13,14,15]
    // priority bez-vrtani: [1,2,6,7,8]
    // intersection = [7,8]
    const form = makeFormData({
      usage: 'pouze-cesty',
      priority: 'bez-vrtani',
    });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect([7, 8]).toContain(result.sides[0].product.params.typeId);
  });
});

// ─── Multi-side tests ───────────────────────────────────────────

describe('Multi-side recommendations', () => {
  it('2 sides → 2 recommendations', () => {
    const form = makeFormData({
      sleepPosition: 'uprostred',
      lengths: [
        { sideIndex: 0, length: 150 },
        { sideIndex: 1, length: 200 },
      ],
    });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect(result.sides).toHaveLength(2);
    expect(result.sides[0].requestedLength).toBe(150);
    expect(result.sides[1].requestedLength).toBe(200);
  });

  it('3 sides with same length → all get products', () => {
    const form = makeFormData({
      sleepPosition: 'aktivni',
      lengths: [
        { sideIndex: 0, length: 150 },
        { sideIndex: 1, length: 150 },
        { sideIndex: 2, length: 150 },
      ],
    });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect(result.sides).toHaveLength(3);
    expect(result.totalPrice).toBe(result.sides[0].product.price * 3);
  });

  it('totalPrice sums all sides', () => {
    const form = makeFormData({
      lengths: [
        { sideIndex: 0, length: 120 },
        { sideIndex: 1, length: 200 },
      ],
    });
    const result = getRecommendations(form, TEST_PRODUCTS);

    const expectedTotal = result.sides.reduce((sum, s) => sum + s.product.price, 0);
    expect(result.totalPrice).toBe(expectedTotal);
  });
});

// ─── Length matching tests ──────────────────────────────────────

describe('Length matching', () => {
  it('exact length match preferred', () => {
    const form = makeFormData({
      lengths: [{ sideIndex: 0, length: 150 }],
    });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect(result.sides[0].product.params.length).toBe(150);
  });

  it('closest longer product when exact not available', () => {
    const form = makeFormData({
      lengths: [{ sideIndex: 0, length: 160 }],
    });
    const result = getRecommendations(form, TEST_PRODUCTS);

    // No 160cm Popular exists, should get 200cm (next longer)
    expect(result.sides[0].product.params.length).toBeGreaterThanOrEqual(160);
  });

  it('custom length (jine) works', () => {
    const form = makeFormData({
      lengths: [{ sideIndex: 0, length: 'jine', customLength: 170 }],
    });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect(result.sides).toHaveLength(1);
    expect(result.sides[0].requestedLength).toBe(170);
  });
});

// ─── Alternative product tests ──────────────────────────────────

describe('Alternative product', () => {
  it('alternative is a different type than primary', () => {
    const form = makeFormData();
    const result = getRecommendations(form, TEST_PRODUCTS);

    if (result.alternativeType) {
      expect(result.alternativeType.params.typeId).not.toBe(
        result.sides[0].product.params.typeId
      );
    }
  });
});

// ─── Cross-sell tests ───────────────────────────────────────────

describe('Cross-sell recommendations', () => {
  it('schodiste → Safety Gate (typeId 10)', () => {
    const form = makeFormData({ crossSell: ['schodiste'] });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect(result.crossSellProducts).toHaveLength(1);
    expect(result.crossSellProducts[0].category).toBe('schodiste');
    expect(result.crossSellProducts[0].product.params.typeId).toBe(10);
  });

  it('ohradka → Ohrádka (typeId 9)', () => {
    const form = makeFormData({ crossSell: ['ohradka'] });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect(result.crossSellProducts).toHaveLength(1);
    expect(result.crossSellProducts[0].product.params.typeId).toBe(9);
  });

  it('stolovani → Židlička (typeId 16)', () => {
    const form = makeFormData({ crossSell: ['stolovani'] });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect(result.crossSellProducts).toHaveLength(1);
    expect(result.crossSellProducts[0].product.params.typeId).toBe(16);
  });

  it('multiple cross-sells work together', () => {
    const form = makeFormData({ crossSell: ['schodiste', 'ohradka', 'stolovani'] });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect(result.crossSellProducts).toHaveLength(3);
    const typeIds = result.crossSellProducts.map((cs) => cs.product.params.typeId);
    expect(typeIds).toContain(10); // Safety Gate
    expect(typeIds).toContain(9);  // Ohrádka
    expect(typeIds).toContain(16); // Židlička
  });

  it('cross-sell does not affect primary recommendation', () => {
    const formWithout = makeFormData({ crossSell: [] });
    const formWith = makeFormData({ crossSell: ['schodiste', 'stolovani'] });

    const resultWithout = getRecommendations(formWithout, TEST_PRODUCTS);
    const resultWith = getRecommendations(formWith, TEST_PRODUCTS);

    expect(resultWith.sides[0].product.id).toBe(resultWithout.sides[0].product.id);
  });
});

// ─── Fallback tests ─────────────────────────────────────────────

describe('Fallback behavior', () => {
  it('empty intersection falls back to all products', () => {
    // Force an impossible intersection
    const form = makeFormData({
      bedType: 'valenda',   // [11, 12]
      priority: 'stabilita', // [3, 4, 5]
      // intersection = [] → should fallback
    });
    const result = getRecommendations(form, TEST_PRODUCTS);

    expect(result.sides).toHaveLength(1);
    expect(result.sides[0].product).toBeTruthy();
  });
});
