"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useCountdown, pad } from "./useCountdown";

const UNITS = ["days", "hours", "minutes", "seconds"];

export default function CountdownSection({ dropConfig }) {
  const sectionRef = useRef(null);
  const revealRefs = useRef([]);
  revealRefs.current = [];
  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const targetDate = dropConfig?.targetDate || "2026-10-01T00:00:00+06:00";
  const formattedDate = dropConfig?.formattedDate || "01 October 2026";
  const location = dropConfig?.location || "Australia";

  const { time, isLive } = useCountdown(targetDate);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(revealRefs.current, { opacity: 0, y: 20 });
    }, sectionRef);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(revealRefs.current, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-[var(--color-subtle)]/20 bg-[var(--color-primary)] px-6 py-24 sm:py-32"
    >
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <div
          ref={addRevealRef}
          className="mb-10 flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-[var(--color-secondary)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" />
          {isLive ? "awakening // is live" : "countdown // active"}
        </div>

        <div ref={addRevealRef} className="flex items-center justify-center gap-3 sm:gap-6">
          {UNITS.map((unit, i) => (
            <div key={unit} className="flex items-center gap-3 sm:gap-6">
              <div className="flex flex-col items-center justify-center border border-[var(--color-secondary)]/50 bg-white/[0.02] px-4 py-6 sm:px-8 sm:py-9 backdrop-blur-xs transition-colors hover:border-[var(--color-secondary)]">
                <span className="font-anton text-3xl tabular-nums text-white sm:text-5xl">
                  {time ? pad(time[unit]) : "00"}
                </span>
                <span className="mt-2 font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-subtle)] sm:text-xs">
                  {unit}
                </span>
              </div>
              {i < UNITS.length - 1 && (
                <span className="hidden font-anton text-2xl text-[var(--color-secondary)] sm:block">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        <h2
          ref={addRevealRef}
          className="mt-12 font-anton text-3xl uppercase tracking-wider text-white sm:text-4xl"
        >
          The drop is coming
        </h2>

        <p
          ref={addRevealRef}
          className="mt-3 font-sans text-xs uppercase tracking-[0.2em] text-[var(--color-subtle)] sm:text-sm"
        >
          {formattedDate} — {location}
        </p>

        <Link
          ref={addRevealRef}
          href="/collection"
          className="mt-10 inline-flex items-center justify-center gap-3 border border-[var(--color-secondary)] bg-[var(--color-secondary)] px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-transparent hover:text-white hover:shadow-[0_0_20px_rgba(188,1,0,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          the wait is over — enter the archive →
        </Link>
      </div>
    </section>
  );
}