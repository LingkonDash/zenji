import BookStackSection from "@/components/home/BookStackSection";
import EthosSection from "@/components/home/EthosSection";
import Hero from "@/components/home/Hero";
import HeroTwo from "@/components/home/HeroTwo";
import OriginDropSection from "@/components/home/OriginDropSection";


const DATA = [
  {
    id: "blue-flame-tee",
    title: "Blue Flame Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Premium 240gsm heavyweight cotton tee featuring custom anime streetwear blue flame graphic artwork.",
    price: "A$33.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Blue-flame.avif",
    bgImage: "/images/hero/Blue-flame.avif",
  },
  {
    id: "demon-blood-tee",
    title: "Demon Blood Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Japanese-inspired warrior graphic on heavy oversized silhouette. Limited release drop.",
    price: "A$33.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Demon-blood.avif",
    bgImage: "/images/hero/Demon-blood.avif",
  },
  {
    id: "will-of-the-sun-tee",
    title: "Will Of The Sun Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "High-contrast anime graphic tee engineered for technical precision and street culture.",
    price: "A$33.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Will-of-the-sun.avif",
    bgImage: "/images/hero/Will-of-the-sun.avif",
  },
  {
    id: "warrior-spirit-tee",
    title: "Warrior Spirit Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Iconic samurai discipline artwork printed on 100% heavyweight cotton canvas structure.",
    price: "A$33.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Warrior-spirit.avif",
    bgImage: "/images/hero/Warrior-spirit.avif",
  },
  {
    id: "bushido-tee",
    title: "Bushido Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Minimalist streetwear front paired with a high-impact back anime design.",
    price: "A$39.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Bushido.avif",
    bgImage: "/images/hero/Bushido.avif",
  },
  {
    id: "domain-expansion-tee",
    title: "Domain Expansion Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Gamer-built anime graphic streetwear piece. No restocks, limited quantities.",
    price: "A$39.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Domain-expansion.avif",
    bgImage: "/images/hero/Domain-expansion.avif",
  },
  {
    id: "water-breathing-tee",
    title: "Water Breathing Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Fluid Japanese iconography and dark anime streetwear aesthetic.",
    price: "A$39.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Water-breathing.avif",
    bgImage: "/images/hero/Water-breathing.avif",
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <OriginDropSection data={DATA} />
      <BookStackSection data={DATA} />
      <HeroTwo data={DATA} />
      <EthosSection />
    </>
  );
}
