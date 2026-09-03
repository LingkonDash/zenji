"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flame, ArrowRight, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BookStackSection({ data }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      const totalCards = cards.length;

      // Pin the section while scrolling through cards
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalCards * 100}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return; // Keep the first card anchored

        // Slide card up from bottom and stack onto the pile
        tl.fromTo(
          card,
          {
            yPercent: 120,
            rotateX: 10,
            scale: 0.95,
          },
          {
            yPercent: 0,
            rotateX: 0,
            scale: 1,
            ease: "power2.out",
            duration: 1,
          },
          `card-${i}`
        );

        // Slightly scale down the card beneath and let the new card cast
        // a soft shadow downward onto it (instead of blacking it out)
        if (i > 0) {
          tl.to(
            cards[i - 1],
            {
              scale: 0.97,
              boxShadow: "0px -40px 60px -20px rgba(0,0,0,0.7)",
              duration: 1,
            },
            `card-${i}`
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full bg-primary text-white overflow-hidden flex flex-col items-center justify-between py-8 px-4"
    >
      {/* Background Wordmark */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] flex items-center justify-center">
        <span className="font-anton text-[18vw] tracking-tighter uppercase text-white select-none">
          LOOKBOOK
        </span>
      </div>

      {/* Section Header */}
      <div className="relative z-20 text-center max-w-xl mx-auto mt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/30 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span className="text-[10px] font-sans tracking-widest text-secondary uppercase font-bold">
            SYSTEM // ZENJI_VISUAL_ARCHIVE
          </span>
        </div>
        <h2 className="font-anton text-3xl md:text-5xl uppercase tracking-wider text-white">
          LOOKBOOK
        </h2>
        <p className="text-xs font-sans text-subtle mt-1">
          SCROLL TO EXPLORE THE COLLECTION, FRAME BY FRAME
        </p>
      </div>

      {/* Stacked Cards Frame */}
      <div className="relative w-full max-w-3xl h-[68vh] z-10 my-auto flex items-center justify-center perspective-1000">
        {data.map((item, index) => {
          const isOnSale = item.price !== item.originalPrice;

          return (
            <div
              key={item.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/15 bg-primary flex flex-col justify-end transition-colors duration-300 hover:border-white/30"
              style={{
                zIndex: index + 1,
                boxShadow: "0px 0px 0px rgba(0,0,0,0)",
              }}
            >
              {/* Full Background Cover Art */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.bgImage}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover object-center"
                />
                {/* Red Frame Border Line Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-secondary z-20" />
                {/* Darkness Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              </div>

              {/* Page Number & Sale Ribbon */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                <span className="px-3 py-1 bg-primary/80 backdrop-blur-md border border-white/20 text-xs font-sans tracking-widest text-white rounded-md">
                  VOL. 0{index + 1}
                </span>
                {isOnSale && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-secondary text-white text-xs font-sans font-bold tracking-widest uppercase rounded-md">
                    <Flame className="w-3 h-3 fill-white" />
                    SALE
                  </span>
                )}
              </div>

              {/* Card Footer Content Overlay */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 bg-gradient-to-t from-primary via-primary/90 to-transparent pt-12">
                <div className="max-w-md">
                  <span className="text-[10px] font-sans tracking-widest text-secondary uppercase block mb-1">
                    {item.collection}
                  </span>
                  <h3 className="font-anton text-3xl md:text-4xl uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs font-sans text-subtle mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-anton text-2xl text-secondary">
                      {item.price}
                    </span>
                    {isOnSale && (
                      <span className="text-xs font-sans text-subtle line-through">
                        {item.originalPrice}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/drop/${item.id}`}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary font-sans text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-secondary hover:text-white transition-all duration-300"
                  >
                    <span>VIEW PIECE</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Indicator */}
      <div className="relative z-20 flex items-center gap-2 text-xs font-sans text-muted">
        <span>[ SCROLL TO CONTINUE ]</span>
      </div>
    </section>
  );
}