"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Flame } from "lucide-react";
import OriginDropCard from "@/components/shared/card/OriginDropCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function OriginDropSection({ data }) {
  const targetRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.config({ force3D: true });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = containerRef.current;
        if (!track) return;

        const getScrollAmount = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: targetRef.current,
            pin: true,
            pinType: "transform",
            scrub: 1,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            invalidateOnRefresh: true,
          },
        });

        // No cleanup returned here — useGSAP's own context revert
        // automatically tears down this matchMedia instance, its
        // ScrollTrigger, and the pin-spacer on unmount/dependency change.
      });

      const pendingImgs = Array.from(
        targetRef.current?.querySelectorAll("img") || []
      ).filter((img) => !img.complete);

      if (pendingImgs.length > 0) {
        let loadedCount = 0;
        const onImageLoad = () => {
          loadedCount++;
          if (loadedCount === pendingImgs.length) {
            ScrollTrigger.refresh();
          }
        };

        pendingImgs.forEach((img) => {
          img.addEventListener("load", onImageLoad, { once: true });
          img.addEventListener("error", onImageLoad, { once: true });
        });
      }
    },
    { scope: targetRef, dependencies: [data] }
  );

  return (
    <section
      ref={targetRef}
      className="relative md:h-screen w-full bg-[#0B0404] text-white overflow-hidden font-sans py-8 md:py-6 flex flex-col justify-between"
    >
      {/* Background Graphic Watermark */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none flex items-center justify-center">
        <span className="font-anton text-[25vw] uppercase tracking-tighter text-white select-none">
          ORIGIN
        </span>
      </div>

      {/* Section Header */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4 bg-[#0B0404] px-4 md:px-8 mx-4 md:mx-8 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#BC0100]">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>COLLECTION // THE_ORIGIN_DROP</span>
          </div>
          <h2 className="font-anton leading-[0.88] text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-wider text-white mt-1">
            LIMITED SALES
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-xs font-mono text-[#9D9D9D] max-w-xs">
            HEAVYWEIGHT COTTON ARCHIVAL EDITIONS. ONCE THE ALLOCATION IS EXHAUSTED, THEY ARE RETIRED.
          </p>
          <Link
            href="/collection"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-white/20 bg-white/5 hover:bg-[#BC0100] hover:border-[#BC0100] text-white hover:text-black font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-none shrink-0"
          >
            <span>SEE ALL</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar px-4 md:px-8 pt-4 md:pt-6 pb-4 md:pb-6 z-10 relative flex-1 flex items-center">
        <div
          ref={containerRef}
          className="flex items-center md:h-full gap-4 md:gap-8 w-max"
        >
          {data.map((item, index) => (
            <OriginDropCard
              key={item.id}
              item={item}
              index={index}
              totalCount={data.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}