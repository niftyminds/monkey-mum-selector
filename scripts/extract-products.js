const https = require('https');
const url = 'https://feeds.mergado.com/monkeymum-com-google-nakupy-cz-c52ab2782b7b3f3fab53f79672db2a0b.xml';

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    // Find all matching items
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    const items = [];

    while ((match = itemRegex.exec(data)) !== null) {
      const item = match[1];
      if (item.includes('Zábrany na postel') || item.includes('Bezpečnostní ohrádky')) {
        // Extract key fields
        const getId = item.match(/<g:id>([^<]+)<\/g:id>/);
        const getTitle = item.match(/<g:title>([^<]+)<\/g:title>/);
        const getPrice = item.match(/<g:price>([^<]+)<\/g:price>/);
        const getProductType = item.match(/<g:product_type>([^<]+)<\/g:product_type>/);
        const getAvailability = item.match(/<g:availability>([^<]+)<\/g:availability>/);

        // Extract product_details
        const detailsRegex = /<g:product_detail>[\s\S]*?<g:attribute_name>([^<]+)<\/g:attribute_name>[\s\S]*?<g:attribute_value>([^<]+)<\/g:attribute_value>[\s\S]*?<\/g:product_detail>/g;
        let detailMatch;
        const details = {};
        while ((detailMatch = detailsRegex.exec(item)) !== null) {
          const attrName = detailMatch[1];
          const attrValue = detailMatch[2];
          if (!details[attrName]) {
            details[attrName] = [];
          }
          details[attrName].push(attrValue);
        }

        items.push({
          id: getId ? getId[1] : null,
          title: getTitle ? getTitle[1] : null,
          price: getPrice ? getPrice[1] : null,
          productType: getProductType ? getProductType[1] : null,
          availability: getAvailability ? getAvailability[1] : null,
          details: details
        });
      }
    }

    console.log('Total matching products: ' + items.length);
    console.log('\n=== ALL PRODUCTS ===\n');
    items.forEach((item, i) => {
      console.log((i+1) + '. ' + item.title);
      console.log('   ID: ' + item.id);
      console.log('   Price: ' + item.price);
      console.log('   Type: ' + item.productType);
      console.log('   Availability: ' + item.availability);
      console.log('   Details: ' + JSON.stringify(item.details));
      console.log('');
    });
  });
}).on('error', (e) => {
  console.error(e);
});
