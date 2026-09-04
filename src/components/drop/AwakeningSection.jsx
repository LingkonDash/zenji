"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function AwakeningSection({ dropConfig }) {
  const sectionRef = useRef(null);
  const statusRef = useRef(null);
  const dotRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);
  const metaRef = useRef(null);

  const formattedShort = dropConfig?.formattedShort || "01 oct 2026";
  const targetMs = new Date(dropConfig?.targetDate || "2026-10-01T00:00:00+06:00").getTime();
  const isLive = Date.now() >= targetMs;

  // Entrance timeline
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [
        statusRef.current,
        line1Ref.current,
        line2Ref.current,
        subRef.current,
        metaRef.current,
      ];

      if (reduceMotion) {
        gsap.set(targets, { clearProps: "all" });
        return;
      }

      gsap.set([line1Ref.current, line2Ref.current], {
        clipPath: "inset(0 0 100% 0)",
      });
      gsap.set([statusRef.current, subRef.current, metaRef.current], {
        opacity: 0,
        y: 16,
      });

      gsap
        .timeline({ delay: 0.2, defaults: { ease: "power3.out" } })
        .to(statusRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(
          line1Ref.current,
          { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power4.inOut" },
          "-=0.1"
        )
        .to(
          line2Ref.current,
          { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power4.inOut" },
          "-=0.55"
        )
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .to(metaRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

      if (!reduceMotion && dotRef.current) {
        gsap.to(dotRef.current, {
          opacity: 0.25,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pause the ambient status-dot pulse when off-screen
  useEffect(() => {
    if (!dotRef.current || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const tweens = gsap.getTweensOf(dotRef.current);
        tweens.forEach((t) => (entry.isIntersecting ? t.resume() : t.pause()));
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex py-30 w-full items-center justify-center overflow-hidden bg-[var(--color-primary)]"
    >
      <Image
        src={"/images/background/bg_2.avif"}
        alt={'Background'}
        fill
        priority
        className="object-cover object-center"
      />

      {/* Scrim — heavier at edges, content stays legible */}
      <div className="absolute inset-0 bg-[var(--color-primary)]/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-transparent to-[var(--color-primary)]/40" />

      {/* Fine scanline texture — depth without glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--color-subtle) 0px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Corner accent — quiet, single detail */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 right-8 hidden h-28 w-px rotate-[14deg] bg-gradient-to-t from-[var(--color-secondary)]/70 to-transparent sm:block"
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
        <div
          ref={statusRef}
          className="mb-6 flex items-center gap-2 font-sans text-xs tracking-[0.25em] text-[var(--color-subtle)]"
        >
          <span
            ref={dotRef}
            className={`h-1.5 w-1.5 rounded-full ${
              isLive ? "bg-[var(--color-secondary)]" : "bg-[var(--color-subtle)]"
            }`}
          />
          {isLive ? "transmission_active" : "incoming transmission"}
        </div>

        <h1 className="font-anton uppercase leading-[0.9] text-white">
          <span
            ref={line1Ref}
            className="block text-[clamp(3rem,10vw,7.5rem)]"
          >
            Awakening
          </span>
          <span
            ref={line2Ref}
            className="block text-[clamp(3rem,10vw,7.5rem)] text-[var(--color-secondary)]"
          >
            Is Live.
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-6 max-w-md font-sans text-sm text-[var(--color-subtle)] sm:text-base"
        >
          The next chapter begins. Are you ready?
        </p>

        <div
          ref={metaRef}
          className="mt-10 flex w-full flex-col items-center justify-center"
        >
          <span className="font-sans text-xs tracking-[0.2em] text-[var(--color-subtle)]">
            drop date: {formattedShort}
          </span>
        </div>
      </div>
    </section>
  );
}