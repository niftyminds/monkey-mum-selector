import { FALLBACK_PRODUCTS } from '@/lib/products';
import { Product } from '@/types/product';
import ClientApp from '@/components/ClientApp';
import IframeResizeProvider from '@/components/IframeResizeProvider';
import { EmbedProvider } from '@/components/EmbedContext';
import productsData from '@/data/products.json';

export default function EmbedPage() {
  let products: Product[] = [];

  try {
    if (productsData && productsData.products && productsData.products.length > 0) {
      products = productsData.products as Product[];
    }
  } catch (error) {
    console.error('Error loading products from JSON:', error);
  }

  if (products.length === 0) {
    products = FALLBACK_PRODUCTS;
  }

  return (
    <EmbedProvider>
      <IframeResizeProvider>
        <ClientApp products={products} isEmbed />
      </IframeResizeProvider>
    </EmbedProvider>
  );
}
