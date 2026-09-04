"use client";

import { useRef } from "react";
import { SearchX } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import OriginDropCard from "@/components/shared/card/OriginDropCard";

gsap.registerPlugin(ScrollTrigger);

export default function CollectionGrid({ products = [] }) {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".og-card", { opacity: 0, y: 28 });
        gsap.to(".og-card", {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [products.length] }
  );

  if (!products || products.length === 0) {
    return (
      <section className="bg-primary px-5 py-20 md:px-8">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 border border-white/10 border-l-2 border-l-secondary bg-white/[0.02] px-8 py-16 text-center">
          <SearchX className="h-8 w-8 text-subtle" strokeWidth={1.5} />
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/70">
            No archive pieces found
          </p>
          <p className="font-sans text-xs text-subtle">
            Try adjusting your filter or search query.
          </p>
        </div>
      </section>
    );
  }

  const countLabel = String(products.length).padStart(2, "0");

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-primary px-5 pb-24 pt-8 md:px-8">
      {/* aura — quiet, fixed, never competes with the artwork */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-secondary/20 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-secondary/10 blur-[160px]"
      />

      <div className="relative mx-auto max-w-[1600px]">
        {/* archive readout — continues the hero/filter-bar language */}
        <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-3 font-sans text-[11px] tracking-[0.2em] text-subtle">
          <span>SHOWING 001–{countLabel}</span>
          <span className="hidden sm:inline">{countLabel} RESULTS // SORTED_BY_DROP</span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-14 sm:gap-x-8">
          {products.map((item, index) => (
            <div key={item.id} className="og-card">
              <OriginDropCard item={item} index={index} totalCount={products.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}