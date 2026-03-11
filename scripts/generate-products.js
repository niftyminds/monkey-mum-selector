#!/usr/bin/env node
/**
 * Script to fetch products from XML feed and save as JSON
 * Run: node scripts/generate-products.js
 * Or: npm run generate-products
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FEED_URL = 'https://feeds.mergado.com/monkeymum-com-google-nakupy-cz-c52ab2782b7b3f3fab53f79672db2a0b.xml';
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'products.json');

// Product types to include from the feed
const ALLOWED_PRODUCT_TYPES = [
  'Zábrany na postel',
  'Bezpečnostní ohrádky',
  'Bezpečnostní zábrany',
  'Jídelní židličky',
  'Dětské postýlky',
];

// Exclude only truly unwanted items
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

// ─── Type ID mapping (must match lib/config.ts) ─────────────────
const TYPE_ID_MAP = {
  'Popular': 1, 'Premium': 2, 'Economy': 3, 'Flip': 4, 'Smart': 5,
  'Short': 6, 'Bed Bumper': 7, 'Nová Zábrana': 8, 'Ohrádka': 9,
  'Safety Gate': 10, 'Postel': 11, 'Postýlka': 12, 'Cestovní Vak': 13,
  'Cestovní Vak Malý': 14, 'Cestovní Vak Bumper': 15, 'Židlička': 16,
};

function extractValue(item, tagName) {
  const regex = new RegExp(`<g:${tagName}>([^<]*)<\\/g:${tagName}>`);
  const match = item.match(regex);
  return match ? match[1] : null;
}

function extractAllValues(item, tagName) {
  const regex = new RegExp(`<g:${tagName}>([^<]*)<\\/g:${tagName}>`, 'g');
  const values = [];
  let match;
  while ((match = regex.exec(item)) !== null) {
    values.push(match[1]);
  }
  return values;
}

function extractProductDetails(item) {
  const detailsRegex = /<g:product_detail>[\s\S]*?<g:attribute_name>([^<]+)<\/g:attribute_name>[\s\S]*?<g:attribute_value>([^<]+)<\/g:attribute_value>[\s\S]*?<\/g:product_detail>/g;
  const details = {};
  let match;
  while ((match = detailsRegex.exec(item)) !== null) {
    const attrName = match[1];
    const attrValue = match[2];
    if (!details[attrName]) details[attrName] = [];
    details[attrName].push(attrValue);
  }
  return details;
}

function parsePrice(priceStr) {
  const match = priceStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseLength(lengthStr) {
  if (!lengthStr) return 0;
  const match = lengthStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function mapProductType(title, typeStr) {
  const titleLower = title.toLowerCase();

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

  if (titleLower.includes('premium')) return 'Premium';
  if (titleLower.includes('economy')) return 'Economy';
  if (titleLower.includes('popular')) return 'Popular';

  return 'Popular';
}

function mapActivities(activities) {
  if (!activities || activities.length === 0) return ['Spánek'];
  const mapped = [];
  for (const activity of activities) {
    if (activity.toLowerCase().includes('spánek')) mapped.push('Spánek');
    if (activity.toLowerCase().includes('cestování')) mapped.push('Cestování');
  }
  return mapped.length > 0 ? mapped : ['Spánek'];
}

function mapPeriods(periods) {
  if (!periods || periods.length === 0) {
    return ['Šestinedělí', 'První rok s miminkem', 'Dva až tři roky s batoletem'];
  }
  const validPeriods = [
    'Šestinedělí', 'První rok s miminkem',
    'Dva až tři roky s batoletem', 'Starší než 3 roky',
  ];
  return periods.filter(p => validPeriods.includes(p));
}

function shouldIncludeProduct(title, availability, productType) {
  if (availability !== 'in_stock') return false;

  const titleLower = title.toLowerCase();
  for (const keyword of EXCLUDED_KEYWORDS) {
    if (titleLower.includes(keyword)) return false;
  }

  const hasValidType = productType && ALLOWED_PRODUCT_TYPES.some(
    (type) => productType.includes(type)
  );

  const recognizable = titleLower.includes('zábrana')
    || titleLower.includes('mantinel')
    || titleLower.includes('ohrádka')
    || titleLower.includes('safety gate')
    || titleLower.includes('židlička')
    || titleLower.includes('postýlka')
    || titleLower.includes('cestovní vak');

  return hasValidType || recognizable;
}

const TYPE_PRIORITY_ORDER = [1, 2, 8, 4, 5, 7, 3, 6];

console.log('Fetching XML feed...');
console.log('URL:', FEED_URL);

https.get(FEED_URL, (res) => {
  let data = '';
  let downloadedMB = 0;

  res.on('data', (chunk) => {
    data += chunk;
    downloadedMB = (data.length / 1024 / 1024).toFixed(1);
    process.stdout.write(`\rDownloading: ${downloadedMB} MB`);
  });

  res.on('end', () => {
    console.log(`\nDownloaded ${downloadedMB} MB`);
    console.log('Parsing products...');

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const products = [];
    let match;

    while ((match = itemRegex.exec(data)) !== null) {
      const itemContent = match[1];

      const id = extractValue(itemContent, 'id') || '';
      const title = extractValue(itemContent, 'title') || '';
      const description = extractValue(itemContent, 'description') || '';
      const link = extractValue(itemContent, 'link') || '';
      const imageLink = extractValue(itemContent, 'image_link') || '';
      const additionalImageLinks = extractAllValues(itemContent, 'additional_image_link');
      const price = extractValue(itemContent, 'price') || '0 CZK';
      const availability = extractValue(itemContent, 'availability') || 'out_of_stock';
      const productType = extractValue(itemContent, 'product_type');
      const details = extractProductDetails(itemContent);

      if (!shouldIncludeProduct(title, availability, productType)) continue;

      const typeStr = details['Typ zábran']?.[0];
      const lengthStr = details['Délka postele']?.[0];
      const mappedType = mapProductType(title, typeStr);
      const typeId = TYPE_ID_MAP[mappedType] || 1;

      products.push({
        id,
        name: title,
        description: description.substring(0, 500),
        url: link,
        imageUrl: imageLink,
        additionalImages: additionalImageLinks,
        price: parsePrice(price),
        currency: 'CZK',
        params: {
          length: parseLength(lengthStr),
          type: mappedType,
          typeId,
          activity: mapActivities(details['Aktivita']),
          periods: mapPeriods(details['Období']),
          supportsMultipleSides: !['Bed Bumper', 'Cestovní Vak', 'Cestovní Vak Malý', 'Cestovní Vak Bumper'].includes(mappedType),
        },
      });
    }

    // Sort by type priority then by length
    products.sort((a, b) => {
      const prioA = TYPE_PRIORITY_ORDER.indexOf(a.params.typeId);
      const prioB = TYPE_PRIORITY_ORDER.indexOf(b.params.typeId);
      const orderA = prioA === -1 ? 99 : prioA;
      const orderB = prioB === -1 ? 99 : prioB;
      if (orderA !== orderB) return orderA - orderB;
      return a.params.length - b.params.length;
    });

    console.log(`Found ${products.length} products`);

    const byType = {};
    products.forEach(p => {
      if (!byType[p.params.type]) byType[p.params.type] = 0;
      byType[p.params.type]++;
    });
    console.log('By type:', byType);

    const withAdditional = products.filter(p => p.additionalImages.length > 0).length;
    console.log(`Products with additional images: ${withAdditional}/${products.length}`);

    const dataDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const output = {
      generatedAt: new Date().toISOString(),
      feedUrl: FEED_URL,
      productCount: products.length,
      products,
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    console.log(`\nSaved to: ${OUTPUT_PATH}`);
    console.log(`File size: ${(fs.statSync(OUTPUT_PATH).size / 1024).toFixed(1)} KB`);
  });
}).on('error', (e) => {
  console.error('Error fetching feed:', e);
  process.exitCode = 1;
});
