const https = require('https');

const FEED_URL = 'https://feeds.mergado.com/monkeymum-com-google-nakupy-cz-c52ab2782b7b3f3fab53f79672db2a0b.xml';

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

https.get(FEED_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const products = [];
    let match;

    while ((match = itemRegex.exec(data)) !== null) {
      const itemContent = match[1];

      const id = extractValue(itemContent, 'id') || '';
      const title = extractValue(itemContent, 'title') || '';
      const link = extractValue(itemContent, 'link') || '';
      const imageLink = extractValue(itemContent, 'image_link') || '';
      const price = extractValue(itemContent, 'price') || '0 CZK';
      const availability = extractValue(itemContent, 'availability') || 'out_of_stock';
      const productType = extractValue(itemContent, 'product_type');
      const details = extractProductDetails(itemContent);

      // Check if should include
      if (availability !== 'in_stock') continue;

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
        url: link,
        imageUrl: imageLink,
        price: parsePrice(price),
        type: mapProductType(typeStr),
        length: parseLength(lengthStr),
        activities: details['Aktivita'] || [],
        periods: details['Období'] || [],
      });
    }

    console.log(`\n=== PARSED PRODUCTS (${products.length} total) ===\n`);

    // Group by type
    const byType = {};
    products.forEach(p => {
      if (!byType[p.type]) byType[p.type] = [];
      byType[p.type].push(p);
    });

    Object.keys(byType).sort().forEach(type => {
      console.log(`\n--- ${type} (${byType[type].length}) ---`);
      byType[type].forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
        console.log(`   ID: ${p.id}, Length: ${p.length}cm, Price: ${p.price} CZK`);
      });
    });

    // Summary by length
    console.log('\n=== LENGTHS AVAILABLE ===');
    const lengths = [...new Set(products.map(p => p.length))].sort((a, b) => a - b);
    console.log(lengths.join(', ') + ' cm');
  });
}).on('error', (e) => {
  console.error(e);
});
