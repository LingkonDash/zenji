import { Suspense } from "react";
import CollectionFilterBar from "@/components/collection/CollectionFilterBar";
import CollectionHeading from "@/components/collection/CollectionHeading";
import CollectionGrid from "@/components/collection/CollectionGrid";
import { CollectionGridSkeleton } from "@/components/collection/CollectionGridSkeleton";
import { getProducts } from "@/lib/getProducts";

const CollectionPage = async ({ searchParams }) => {
  const query = await searchParams;
  const products = await getProducts(query);
  const totalAllProducts = (await getProducts()).length;

  return (
    <main className="bg-primary min-h-screen pb-24">
      <CollectionHeading totalProduct={totalAllProducts} />
      <Suspense
        fallback={
          <div className="sticky top-18 z-40 h-16 border-b border-white/10 bg-primary" />
        }
      >
        <CollectionFilterBar totalItems={products.length} />
      </Suspense>

      <section className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 pt-10">
        <Suspense fallback={<CollectionGridSkeleton count={6} />}>
          <CollectionGrid products={products} />
        </Suspense>
      </section>
    </main>
  );
};

export default CollectionPage;