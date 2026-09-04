"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function CollectionHeading({ totalProduct = 0 }) {
  const containerRef = useRef(null);
  const padded = String(totalProduct).padStart(2, "0");

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.set(".ch-line", { yPercent: 110 })
        .set([".ch-eyebrow", ".ch-sub", ".ch-meta", ".ch-num"], { opacity: 0 })
        .to(".ch-eyebrow", { opacity: 1, duration: 0.5 })
        .to(".ch-line", { yPercent: 0, duration: 0.9, stagger: 0.12 }, "-=0.2")
        .to(".ch-num", { opacity: 1, duration: 1.4 }, "-=0.7")
        .to(".ch-sub", { opacity: 1, duration: 0.6 }, "-=0.5")
        .to(".ch-meta", { opacity: 1, duration: 0.6 }, "-=0.3");
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-primary px-6 pb-10 pt-16 sm:px-10 sm:pt-20 lg:px-16"
    >
      {/* ghost index number, purely tonal */}
      <span
        aria-hidden="true"
        className="ch-num pointer-events-none absolute -right-4 top-4 select-none font-anton leading-none text-white/[0.05] text-[9rem] sm:text-[13rem] lg:text-[17rem]"
      >
        {padded}
      </span>

      <div className="relative z-10 max-w-5xl">
        <p className="ch-eyebrow mb-4 font-sans text-xs tracking-[0.25em] text-secondary sm:text-sm">
          THE_ORIGIN_DROP // COMPLETE ARCHIVE
        </p>

        <h1 className="font-anton uppercase leading-[0.92] text-white">
          <span className="block overflow-hidden">
            <span className="ch-line block text-[2.5rem] sm:text-6xl lg:text-7xl">
              Anime Graphic Tees —
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="ch-line block text-[2.5rem] sm:text-6xl lg:text-7xl">
              The Full Collection
            </span>
          </span>
        </h1>

        <p className="ch-sub mt-6 max-w-md font-sans text-sm text-subtle">
          Every drop. Every arc. Documented.
        </p>
      </div>

      <div className="ch-meta relative z-10 mt-14 flex flex-col gap-2 border-t border-white/10 pt-5 font-sans text-[11px] tracking-wide text-subtle sm:flex-row sm:items-center sm:justify-between sm:text-xs">
        <span>{padded} PIECES // THE_ORIGIN_DROP // EST_2024</span>
        <span>AUSTRALIA-WIDE SHIPPING</span>
      </div>
    </section>
  );
}