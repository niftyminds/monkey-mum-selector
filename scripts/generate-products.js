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

const ALLOWED_PRODUCT_TYPES = [
  'Zábrany na postel',
  'Bezpečnostní ohrádky',
];

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

function extractValue(item, tagName) {
  const regex = new RegExp(`<g:${tagName}>([^<]*)<\\/g:${tagName}>`);
  const match = item.match(regex);
  return match ? match[1] : null;
}

function extractProductDetails(item) {
  const detailsRegex = /<g:product_detail>[\s\S]*?<g:attribute_name>([^<]+)<\/g:attribute_name>[\s\S]*?<g:attribute_value>([^<]+)<\/g:attribute_value>[\s\S]*?<\/g:product_detail>/g;
  const details = {};
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

function parsePrice(priceStr) {
  const match = priceStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseLength(lengthStr) {
  if (!lengthStr) return 0;
  const match = lengthStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function mapProductType(typeStr) {
  if (!typeStr) return 'Popular';
  const typeLower = typeStr.toLowerCase();
  if (typeLower.includes('premium')) return 'Premium';
  if (typeLower.includes('popular')) return 'Popular';
  if (typeLower.includes('economy')) return 'Economy';
  if (typeLower.includes('cestovní')) return 'Cestovní';
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
    'Šestinedělí',
    'První rok s miminkem',
    'Dva až tři roky s batoletem',
    'Starší než 3 roky',
  ];
  return periods.filter(p => validPeriods.includes(p));
}

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
      const price = extractValue(itemContent, 'price') || '0 CZK';
      const availability = extractValue(itemContent, 'availability') || 'out_of_stock';
      const productType = extractValue(itemContent, 'product_type');
      const details = extractProductDetails(itemContent);

      // Check availability
      if (availability !== 'in_stock') continue;

      // Check product type
      const hasValidType = productType && ALLOWED_PRODUCT_TYPES.some(
        (type) => productType.includes(type)
      );
      if (!hasValidType) continue;

      // Check excluded keywords (case insensitive)
      const titleLower = title.toLowerCase();
      let excluded = false;
      for (const keyword of EXCLUDED_KEYWORDS) {
        if (titleLower.includes(keyword)) {
          excluded = true;
          break;
        }
      }
      if (excluded) continue;

      // Must have length
      const lengthStr = details['Délka postele']?.[0];
      if (!lengthStr) continue;

      const typeStr = details['Typ zábran']?.[0];

      products.push({
        id,
        name: title,
        description: description.substring(0, 500), // Truncate long descriptions
        url: link,
        imageUrl: imageLink,
        price: parsePrice(price),
        currency: 'CZK',
        params: {
          length: parseLength(lengthStr),
          type: mapProductType(typeStr),
          activity: mapActivities(details['Aktivita']),
          periods: mapPeriods(details['Období']),
          supportsMultipleSides: !typeStr?.toLowerCase().includes('cestovní'),
        },
      });
    }

    // Sort by type priority and then by length
    const typePriority = { Popular: 1, Premium: 2, Cestovní: 3, Economy: 4 };
    products.sort((a, b) => {
      const priorityDiff = typePriority[a.params.type] - typePriority[b.params.type];
      if (priorityDiff !== 0) return priorityDiff;
      return a.params.length - b.params.length;
    });

    console.log(`Found ${products.length} products`);

    // Group by type for summary
    const byType = {};
    products.forEach(p => {
      if (!byType[p.params.type]) byType[p.params.type] = 0;
      byType[p.params.type]++;
    });
    console.log('By type:', byType);

    // Ensure data directory exists
    const dataDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write JSON file
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
  process.exit(1);
});
