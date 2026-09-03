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
      "Engineered in 240gsm heavyweight cotton with a precision-cut blue flame graphic — a statement of quiet intensity.",
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
      "A Japanese warrior motif rendered on an oversized heavyweight silhouette. Strictly limited, no restocks.",
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
      "High-contrast graphic composition where technical precision meets street-level conviction.",
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
      "Samurai discipline etched into 100% heavyweight cotton — built for those who move with purpose.",
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
      "Restrained front typography paired with a high-impact reverse graphic. Subtlety meets presence.",
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
      "An archival-grade anime graphic piece — once the allocation clears, it's gone.",
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
      "Fluid Japanese iconography distilled into a dark, contemplative silhouette.",
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
      <BookStackSection data={DATA.slice(0, 4)} />
      <OriginDropSection data={DATA} />
      <HeroTwo data={DATA} />
      <EthosSection />
    </>
  );
}
