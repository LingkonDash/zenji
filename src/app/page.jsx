import { getProducts } from "@/lib/getProducts";
import BookStackSection from "@/components/home/BookStackSection";
import EthosSection from "@/components/home/EthosSection";
import Hero from "@/components/home/Hero";
import HeroTwo from "@/components/home/HeroTwo";
import OriginDropSection from "@/components/home/OriginDropSection";
import RestockSection from "@/components/home/RestockSection";
import ShopSection from "@/components/home/ShopSection";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <BookStackSection data={products.slice(0, 4)} />
      <OriginDropSection data={products} />
      <HeroTwo data={products} />
      <ShopSection products={products} />
      {/* <RestockSection /> */}
      <EthosSection />
    </>
  );
}
