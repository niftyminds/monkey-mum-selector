import { FALLBACK_PRODUCTS } from '@/lib/products';
import { Product } from '@/types/product';
import ClientApp from '@/components/ClientApp';
import productsData from '@/data/products.json';

export default function Home() {
  // Load products from pre-generated JSON file
  let products: Product[] = [];

  try {
    if (productsData && productsData.products && productsData.products.length > 0) {
      products = productsData.products as Product[];
    }
  } catch (error) {
    console.error('Error loading products from JSON:', error);
  }

  // Fall back to static products if JSON is empty
  if (products.length === 0) {
    console.log('Using fallback products');
    products = FALLBACK_PRODUCTS;
  }

  return <ClientApp products={products} />;
}
