"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DEMO_PRODUCTS = [
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

function formatCollectionName(products) {
  if (!products?.length) return "New arrivals";
  const first = products[0].collection;
  const allSame = products.every((p) => p.collection === first);
  if (!allSame || !first) return "New arrivals";
  return first
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ShopSection({
  products = DEMO_PRODUCTS,
  eyebrow = "DROP // 002",
}) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const railRef = useRef(null);

  const heading = formatCollectionName(products);

  useEffect(() => {
    if (!sectionRef.current || !railRef.current) return;

    const ctx = gsap.context(() => {
      const cards = railRef.current ? Array.from(railRef.current.children) : [];
      
      gsap.fromTo(
        [headerRef.current, ...cards],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [products]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black overflow-hidden py-20 md:py-32 border-t border-b border-white/10"
    >
      {/* Editorial Watermark Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   font-anton uppercase text-white/[0.02] whitespace-nowrap tracking-tighter"
        style={{
          fontSize: "28vw",
          lineHeight: 0.8,
        }}
      >
        ZENJI ARCHIVE
      </div>

      {/* Responsive full-width container without max-w limits */}
      <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20">
        
        {/* Gen-Z Brutalist Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-12 border-b border-white/10"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.3em] text-secondary uppercase font-semibold">
                {eyebrow}
              </span>
            </div>
            <h2 className="font-anton uppercase leading-[0.88] text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white mt-3 tracking-tight">
              {heading}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
                [ {products.length} ARCHIVE {products.length === 1 ? "ITEM" : "ITEMS"} ]
              </p>
              <p className="font-sans text-xs text-secondary tracking-wider uppercase font-medium mt-0.5">
                LIMITED QUANTITIES
              </p>
            </div>
            <Link
              href="/drop"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 bg-white/5 hover:bg-secondary hover:border-secondary text-white hover:text-black font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-none shrink-0"
            >
              <span>SEE ALL</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Product Cards Rail */}
        <div
          ref={railRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product, idx) => {
            const onSale =
              product.originalPrice && product.originalPrice !== product.price;

            return (
              <Link
                key={product.id}
                href={`/drop/${product.id}`}
                className="group relative shrink-0 w-[280px] sm:w-[340px] md:w-[380px] snap-start border border-white/10 bg-zinc-950/80 hover:border-secondary transition-all duration-500 block z-10"
              >
                {/* Dynamic Image Canvas */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-900">
                  <Image
                    src={product.bgImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 380px"
                    className="object-cover object-center md:grayscale md:contrast-125 md:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Index Counter Pill */}
                  <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white tracking-widest uppercase">
                    0{idx + 1} // LTD
                  </div>

                  {/* Quick Action Overlay Tag */}
                  <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="font-mono text-[10px] uppercase tracking-widest bg-secondary text-black font-bold px-3 py-1.5 shadow-lg">
                      VIEW DROP →
                    </span>
                  </div>
                </div>

                {/* Product Metadata Footer */}
                <div className="p-5 border-t border-white/10 bg-black/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[10px] text-secondary uppercase tracking-widest">
                      {formatCollectionName([product])}
                    </p>
                    <span className="font-mono text-[10px] text-white/40 uppercase">
                      IN STOCK
                    </span>
                  </div>

                  <h3 className="font-anton uppercase text-white text-xl sm:text-2xl mt-1 tracking-wide group-hover:text-secondary transition-colors">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`font-mono text-base font-bold ${
                          onSale ? "text-secondary" : "text-white"
                        }`}
                      >
                        {product.price}
                      </span>
                      {onSale && (
                        <span className="font-mono text-xs text-white/40 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-[11px] text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">
                      GET PIECE
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}