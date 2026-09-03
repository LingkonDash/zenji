"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EthosSection() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(eyebrowRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: "power2.out",
      })
        .from(
          headingRef.current.children,
          {
            opacity: 0,
            y: 32,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .from(
          copyRef.current,
          {
            opacity: 0,
            y: 16,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[85vh] md:min-h-screen overflow-hidden flex items-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background/background_2.avif"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Scrim for legibility — heavier on the left where copy sits */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />
        <div className="absolute inset-0 bg-primary/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-xl">
          <div ref={eyebrowRef} className="mb-4">
            <span className="text-xs font-sans tracking-[0.25em] text-secondary uppercase font-bold">
              MANIFESTO // 001
            </span>
            <div className="w-10 h-px bg-secondary mt-3" />
          </div>

          <h2
            ref={headingRef}
            className="font-anton uppercase leading-[0.9] text-5xl md:text-7xl lg:text-8xl text-white"
          >
            <span className="block">THE</span>
            <span className="block text-secondary">ZENJI</span>
            <span className="block">ETHOS</span>
          </h2>

          <p
            ref={copyRef}
            className="font-sans text-sm md:text-base text-subtle leading-relaxed mt-8 max-w-md"
          >
            We operate at the intersection of technical precision and cultural
            identity. Every garment is conceived for those who navigate complexity
            with intention — rooted in Japanese craftsmanship, shaped by anime
            heritage, refined through modern streetwear discipline.
          </p>
        </div>
      </div>
    </section>
  );
}