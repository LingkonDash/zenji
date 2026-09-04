import { Suspense } from 'react';
import CollectionFilterBar from '@/components/collection/CollectionFilterBar';
import CollectionHeading from '@/components/collection/CollectionHeading';
import { getProducts } from '@/lib/getProducts';

const CollectionPage = async () => {
  const products = await getProducts();
  return (
    <main className="bg-primary">
      <CollectionHeading totalProduct={products.length} />
      <Suspense
        fallback={
          <div className="sticky top-18 z-40 h-16.25 border-b border-white/10 bg-primary" />
        }
      >
        <CollectionFilterBar totalItems={products.length} />
      </Suspense>
      {/* product grid goes here */}
    </main>
  );
};

export default CollectionPage;