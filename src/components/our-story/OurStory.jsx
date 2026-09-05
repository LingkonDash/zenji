"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  Swords,
  Palette,
  Flame,
  Shirt,
  Ban,
  Truck,
  MapPin,
  ArrowRight,
} from "lucide-react";

import zenjiFull from "@/images/zenji-full-outlook.png";
import zenjiMark from "@/images/zenji-outlook.png";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AUDIENCE = [
  { label: "Dreamers", icon: Compass },
  { label: "Fighters", icon: Swords },
  { label: "Creators", icon: Palette },
  { label: "Outsiders", icon: Flame },
];

const SIGNAL = [
  { label: "Founded", value: "2024" },
  { label: "Fabric", value: "240gsm heavyweight cotton", icon: Shirt },
  { label: "Restocks", value: "None. Ever.", icon: Ban },
  { label: "Free shipping", value: "Orders over A$100", icon: Truck },
  { label: "Ships to", value: "Every AU state & territory", icon: MapPin },
  { label: "Tee price", value: "From A$33.99" },
];

// wraps each word in an overflow-hidden mask so it can rise into view
function RevealLine({ text, className = "" }) {
  const words = text.split(" ");
  return (
    <span className={`block overflow-hidden ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span
            data-word
            className="word inline-block will-change-transform"
            style={{ marginRight: "0.28em" }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function OurStory() {
  const root = useRef(null);
  const heroSection = useRef(null);
  const heroLabel = useRef(null);
  const heroSub = useRef(null);
  const heroMark = useRef(null);
  const spineFill = useRef(null);
  const markerRefs = useRef([]);
  const ctaRef = useRef(null);

  const registerMarker = (el) => {
    if (el && !markerRefs.current.includes(el)) markerRefs.current.push(el);
  };

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const words = root.current.querySelectorAll(".word");

      if (prefersReduced) {
        gsap.set(words, { yPercent: 0, opacity: 1, filter: "blur(0px)" });
        gsap.set([heroLabel.current, heroSub.current, heroMark.current], {
          opacity: 1,
        });
        return;
      }

      gsap.set(words, { yPercent: 115, opacity: 0, filter: "blur(10px)" });
      gsap.set(heroLabel.current, { opacity: 0, x: -12 });
      gsap.set(heroSub.current, { opacity: 0, y: 10 });
      gsap.set(heroMark.current, { opacity: 0, rotate: -25, scale: 0.7 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(heroMark.current, { opacity: 1, rotate: 0, scale: 1, duration: 0.9, ease: "back.out(1.6)" })
        .to(heroLabel.current, { opacity: 1, x: 0, duration: 0.6 }, "-=0.7")
        .to(
          words,
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.045,
          },
          "-=0.4"
        )
        .to(heroSub.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5");

      // slow emblem rotation — a living seal, not a static logo
      gsap.to(heroMark.current, {
        rotate: 360,
        duration: 50,
        repeat: -1,
        ease: "none",
      });

      // the blade — one continuous scroll-linked spine
      if (spineFill.current) {
        gsap.fromTo(
          spineFill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
            },
          }
        );
      }

      markerRefs.current.forEach((m) => {
        gsap.set(m, { backgroundColor: "#4B4B4B" });
        ScrollTrigger.create({
          trigger: m,
          start: "top 65%",
          onEnter: () => gsap.to(m, { backgroundColor: "#BC0100", scale: 1.6, duration: 0.3 }),
          onLeaveBack: () => gsap.to(m, { backgroundColor: "#4B4B4B", scale: 1, duration: 0.3 }),
        });
      });

      // origin — the blade wipes the text into view
      gsap.fromTo(
        ".origin-copy",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".origin-copy", start: "top 78%" },
        }
      );

      // philosophy — mask reveal + underline draw
      gsap.fromTo(
        ".manifesto-text",
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".manifesto-text", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".manifesto-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power3.inOut",
          transformOrigin: "left",
          scrollTrigger: { trigger: ".manifesto-rule", start: "top 85%" },
        }
      );

      // audience chips — flip in with stagger
      gsap.fromTo(
        ".audience-card",
        { opacity: 0, rotateX: -35, y: 20 },
        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".audience-grid", start: "top 78%" },
        }
      );

      // signal cells — alternating slide with glow
      gsap.utils.toArray(".signal-cell").forEach((cell, i) => {
        gsap.fromTo(
          cell,
          { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: cell, start: "top 85%" },
          }
        );
      });

      // cta rise
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 90%" },
        }
      );
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main ref={root} className="relative overflow-hidden bg-primary font-sans text-[#EFEDE8]">
      {/* film grain, whole page */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* single centered fixed viewport background logo */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-[0.05]"
      >
        <div className="relative h-[65vh] w-[90vw] md:h-[80vh] md:w-[65vw]">
          <Image
            src={zenjiFull}
            alt=""
            fill
            priority
            className="object-contain brightness-0 invert"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ---------------- MAIN CONTENT WRAPPER (1500px MAX-WIDTH) ---------------- */}
      <div className="mx-auto max-w-[1500px] relative">
        {/* the blade — a single scroll-linked spine running through the page */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-6 z-10 hidden w-px bg-muted/25 md:block">
          <div
            ref={spineFill}
            className="w-full origin-top bg-secondary"
            style={{ height: "100%", transform: "scaleY(0)" }}
          />
        </div>

        {/* ---------------- HERO ---------------- */}
        <section
          ref={heroSection}
          className="relative flex flex-col justify-center overflow-hidden border-b border-muted/25 px-6 md:pl-16 py-18 md:py-24"
        >
          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-4">
              <span
                ref={heroMark}
                className="relative block h-9 w-9 shrink-0 drop-shadow-[0_0_10px_rgba(188,1,0,0.55)]"
              >
                <Image src={zenjiMark} alt="ZENJI mark" fill className="object-contain brightness-0 invert" />
              </span>
              <p ref={heroLabel} className="text-xs tracking-[0.3em] text-subtle">
                OUR STORY // ZENJI
              </p>
            </div>

            <h1 className="font-anton max-w-4xl text-[14vw] leading-[0.88] tracking-tight md:text-[6vw]">
              <RevealLine text="BORN FROM" />
              <RevealLine text="THE WARRIOR" />
              <RevealLine text="SPIRIT." />
            </h1>

            <p
              ref={heroSub}
              className="mt-8 max-w-md border-l-2 border-secondary pl-4 text-sm leading-relaxed text-subtle"
            >
              What you wear should tell a story. ZENJI began with that one
              belief — and built a brand around it, in Australia, from nothing.
            </p>
          </div>
        </section>

        {/* ---------------- ORIGIN ---------------- */}
        <section className="relative z-10 border-b border-muted/25 px-6 py-24 md:pr-16 md:pl-24">
          <div className="grid gap-10 md:grid-cols-[220px_1fr] md:gap-16">
            <div className="flex items-start gap-3">
              <span ref={registerMarker} className="mt-1 hidden h-2.5 w-2.5 shrink-0 md:block" />
              <h2 className="text-xs tracking-[0.3em] text-subtle">ORIGIN</h2>
            </div>
            <div className="origin-copy max-w-2xl space-y-6 text-lg leading-relaxed text-[#EFEDE8]/90">
              <p>
                ZENJI sits at the crossing point of samurai discipline, anime
                art and modern street culture. Every graphic starts as original
                artwork — no studio license, no stock design — built in-house
                and printed on 100% heavyweight 240gsm cotton.
              </p>
              <p className="text-subtle">
                No two drops repeat. Once a piece sells out, it&apos;s gone — a
                permanent record of the moment it existed, not a SKU that comes
                back next season.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- PHILOSOPHY / MANIFESTO ---------------- */}
        <section className="relative z-10 overflow-hidden border-b border-muted/25 px-6 py-24 md:pr-16 md:pl-24">
          <div className="relative flex items-start gap-3">
            <span ref={registerMarker} className="mt-1 hidden h-2.5 w-2.5 shrink-0 md:block" />
            <h2 className="mb-10 text-xs tracking-[0.3em] text-subtle">PHILOSOPHY</h2>
          </div>
          <blockquote className="manifesto-text font-anton relative max-w-3xl text-[9vw] leading-[1.02] md:text-[3.4vw]">
            ZENJI IS THE WARRIOR WITHIN — THE PART OF YOU THAT KEEPS MOVING
            FORWARD, STAYS TRUE TO ITSELF, AND REFUSES TO FADE INTO THE CROWD.
          </blockquote>
          <div className="manifesto-rule mt-8 h-px w-full max-w-xl bg-secondary/60" />
          <p className="mt-6 max-w-xl text-sm text-subtle">
            We design for the dreamers, fighters, creators and outsiders
            shaping their own future.
          </p>
        </section>

        {/* ---------------- WHO WE MAKE THIS FOR ---------------- */}
        <section className="relative z-10 border-b border-muted/25 px-6 py-24 md:pr-16 md:pl-24">
          <div className="flex items-start gap-3">
            <span ref={registerMarker} className="mt-1 hidden h-2.5 w-2.5 shrink-0 md:block" />
            <h2 className="mb-10 text-xs tracking-[0.3em] text-subtle">
              WHO WE MAKE THIS FOR
            </h2>
          </div>
          <div className="audience-grid grid grid-cols-2 gap-px bg-muted/25 [perspective:900px] md:grid-cols-4">
            {AUDIENCE.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="audience-card group flex flex-col justify-between gap-8 bg-primary p-6 transition-colors duration-300 hover:bg-[#150808] md:p-8"
              >
                <Icon
                  strokeWidth={1.5}
                  className="h-6 w-6 text-subtle transition-all duration-300 group-hover:scale-110 group-hover:text-secondary group-hover:drop-shadow-[0_0_8px_rgba(188,1,0,0.6)]"
                />
                <span className="text-lg">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- SIGNAL / FACTS ---------------- */}
        <section className="relative z-10 border-b border-muted/25 px-6 py-24 md:pr-16 md:pl-24">
          <div className="flex items-start gap-3">
            <span ref={registerMarker} className="mt-1 hidden h-2.5 w-2.5 shrink-0 md:block" />
            <h2 className="mb-10 text-xs tracking-[0.3em] text-subtle">THE SIGNAL</h2>
          </div>
          <div className="grid grid-cols-1 gap-px bg-muted/25 sm:grid-cols-2 md:grid-cols-3">
            {SIGNAL.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="signal-cell flex flex-col gap-4 border-l-2 border-transparent bg-primary p-6 transition-all duration-300 hover:border-secondary hover:bg-[#150808] md:p-8"
              >
                <div className="flex items-center justify-between text-subtle">
                  <span className="text-xs tracking-[0.25em]">{label.toUpperCase()}</span>
                  {Icon ? <Icon strokeWidth={1.5} className="h-4 w-4" /> : null}
                </div>
                <span className="font-anton text-2xl leading-tight md:text-3xl">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- CLOSE ---------------- */}
        <section className="relative z-10 flex flex-col items-start gap-10 overflow-hidden px-6 py-28 md:pr-16 md:pl-24">
          <h2 className="font-anton relative max-w-2xl text-[11vw] leading-[0.95] md:text-[4.2vw]">
            WEAR YOUR STORY.
            <br />
            WEAR YOUR SPIRIT.
            <br />
            WEAR ZENJI.
          </h2>
          <a
            ref={ctaRef}
            href="/collection"
            className="group relative inline-flex items-center gap-3 border border-[#EFEDE8]/70 px-8 py-4 text-sm tracking-[0.2em] transition-colors duration-300 hover:border-secondary hover:bg-secondary hover:shadow-[0_0_30px_rgba(188,1,0,0.45)]"
          >
            EXPLORE THE COLLECTION
            <ArrowRight
              strokeWidth={1.5}
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </section>
      </div>
    </main>
  );
}