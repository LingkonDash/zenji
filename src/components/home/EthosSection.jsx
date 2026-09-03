"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PILLARS = [
  {
    num: "01",
    label: "Craftsmanship",
    copy: "Construction and pattern-making rooted in Japanese ateliers.",
  },
  {
    num: "02",
    label: "Heritage",
    copy: "Anime's visual language, shaped into wearable form.",
  },
  {
    num: "03",
    label: "Discipline",
    copy: "Streetwear silhouettes, refined for modern movement.",
  },
];

export default function EthosSection() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const copyRef = useRef(null);
  const pillarsRef = useRef(null);
  const formRef = useRef(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

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
        )
        .from(
          pillarsRef.current.children,
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .from(
          formRef.current,
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

  function handleSubmit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    setTimeout(() => setStatus("success"), 700);
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center py-20"
    >
      {/* Background & Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background/background_2.avif"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Main Manifesto Title & Concept */}
          <div className="lg:col-span-6 flex flex-col">
            <div ref={eyebrowRef} className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-secondary" />
              <span className="text-[11px] font-sans tracking-[0.3em] text-secondary uppercase font-semibold">
                MANIFESTO // 001
              </span>
            </div>

            <h2
              ref={headingRef}
              className="font-anton uppercase leading-[0.88] text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight"
            >
              <span className="block">THE</span>
              <span className="block text-secondary">ZENJI</span>
              <span className="block">ETHOS</span>
            </h2>

            <p
              ref={copyRef}
              className="font-sans text-sm md:text-base text-white/70 leading-relaxed mt-8 max-w-lg font-light tracking-wide"
            >
              We operate at the intersection of technical precision and cultural
              identity. Every garment is conceived for those who navigate complexity
              with intention — rooted in Japanese craftsmanship, shaped by anime
              heritage, refined through modern streetwear discipline.
            </p>
          </div>

          {/* RIGHT COLUMN: Pillars & Know First Form */}
          <div className="lg:col-span-6 lg:pl-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-10 lg:pt-0 flex flex-col justify-between">
            
            {/* Pillars */}
            <div ref={pillarsRef} className="flex flex-col gap-8 md:gap-10">
              {PILLARS.map((pillar) => (
                <div key={pillar.label} className="group flex flex-col">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="font-sans text-xs font-bold text-secondary/80 tracking-widest">
                      {pillar.num}
                    </span>
                    <h3 className="font-anton uppercase text-white text-2xl md:text-3xl tracking-wider group-hover:text-secondary transition-colors duration-300">
                      {pillar.label}
                    </h3>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-white/60 leading-relaxed font-light pl-8">
                    {pillar.copy}
                  </p>
                </div>
              ))}
            </div>

            {/* Know First Signup Form */}
            <div className="mt-12 md:mt-16 pt-8 border-t border-white/10 max-w-md">
              <h3 className="font-anton uppercase text-white text-xl tracking-wider">
                Know first
              </h3>
              <p className="font-sans text-xs text-white/50 leading-relaxed mt-1 font-light">
                Drops move fast and don't restock. Get the notice before the site does.
              </p>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-6 flex items-center gap-4 border-b border-white/20 focus-within:border-secondary transition-colors pb-1"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder="enter your email address"
                  aria-label="Email address"
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-transparent text-white placeholder:text-white/30 
                             font-sans text-xs tracking-wider uppercase py-2 outline-none
                             disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="shrink-0 font-sans text-xs uppercase tracking-[0.2em] font-bold
                             text-secondary hover:text-white transition-colors py-2 disabled:opacity-50"
                >
                  {status === "loading"
                    ? "Joining..."
                    : status === "success"
                    ? "Joined"
                    : "Join"}
                </button>
              </form>

              <p
                role="status"
                className="font-sans text-xs mt-2 h-4 tracking-wide"
                style={{
                  color:
                    status === "error"
                      ? "var(--color-secondary)"
                      : "rgba(255, 255, 255, 0.5)",
                }}
              >
                {status === "error" && "Enter a valid email address."}
                {status === "success" && "You're on the list — watch your inbox."}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}