"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import ProductCard from "@/components/shared/card/ProductCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


export default function OriginDropSection({ products = [] }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const railRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !railRef.current) return;

    const ctx = gsap.context(() => {
      const cards = railRef.current
        ? Array.from(railRef.current.children)
        : [];

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
  }, []);

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

      <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20">
        <div className="max-w-[1600px] mx-auto">

        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-12 border-b border-white/10"
        >
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.3em] text-secondary uppercase font-semibold">
                THE_ORIGIN_DROP // STILL AVAILABLE
              </span>
            </div>

            {/* Main heading */}
            <h2 className="font-anton uppercase leading-[0.88] text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight">
              WHILE YOU WAIT.
            </h2>

            {/* Sub-copy */}
            <p className="font-sans text-white/50 text-sm sm:text-base mt-4 max-w-md leading-relaxed">
              Shop The Origin Drop, our current collection.
            </p>
          </div>

          {/* Right side — count + link */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="hidden sm:block text-right">
              <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
                [ {products.length} ARCHIVE ITEMS ]
              </p>
              <p className="font-sans text-xs text-secondary tracking-wider uppercase font-medium mt-0.5">
                LIMITED QUANTITIES
              </p>
            </div>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 bg-white/5 hover:bg-secondary hover:border-secondary text-white hover:text-black font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-none"
            >
              <span>VIEW ALL COLLECTION</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Product Cards Rail — scrollable on mobile, centered grid on desktop */}
        <div
          ref={railRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none md:overflow-x-visible md:flex-wrap md:justify-center md:snap-none"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
            />
          ))}
        </div>

        {/* Bottom "View All" link */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/collection"
            className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-secondary transition-colors duration-300 group"
          >
            <span className="w-8 h-px bg-white/20 group-hover:bg-secondary group-hover:w-12 transition-all duration-300" />
            VIEW ALL COLLECTION
            <span className="w-8 h-px bg-white/20 group-hover:bg-secondary group-hover:w-12 transition-all duration-300" />
          </Link>
        </div>

        </div>
      </div>
    </section>
  );
}
