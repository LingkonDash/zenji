import LookbookGallery from '@/components/lookbook/LookbookGallery';
import LookbookHeader from '@/components/lookbook/LookbookHeader';
import { getProducts } from '@/lib/getProducts';
import React, { Suspense } from 'react';

export const metadata = {
  title: "Lookbook — ZENJI Neo Tokyo Streetwear",
  description: "Shop the collection from The Origin Drop. Featuring Japanese anime-inspired graphic tees, oversized fits, and limited edition streetwear.",
};

export default async function LookbookPage({ searchParams }) {
  const query = await searchParams;
  const products = await getProducts(query);

  return (
    <main className="bg-primary min-h-screen pb-24">
      <LookbookHeader pieceCount={products.length} />
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 pt-10">
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <LookbookGallery products={products} />
        </Suspense>
      </section>
    </main>
  );
}