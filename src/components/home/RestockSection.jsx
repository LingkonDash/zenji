"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const RESTOCK_ITEMS = [
  { id: "noh-hoodie", name: "Noh mask hoodie", size: "M / L back in stock", hours: 2 },
  { id: "tech-cargo", name: "Tech cargo pant", size: "All sizes", hours: 18 },
  { id: "sashiko-bomber", name: "Sashiko bomber", size: "S / M / XL", hours: 61 },
  { id: "gi-tee", name: "Gi tee, crimson", size: "All sizes", hours: 6 },
];

const TICKER_TEXT = RESTOCK_ITEMS.map(
  (item) => `${item.name.toUpperCase()} — BACK IN ${formatHoursShort(item.hours)}`
).join("   /   ");

function formatHoursShort(hours) {
  if (hours < 24) return `${hours}H`;
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  return rem ? `${days}D ${rem}H` : `${days}D`;
}

function formatCountdown(ms) {
  if (ms <= 0) return "LIVE NOW";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hrs = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (days > 0) return `${days}D ${pad(hrs)}H ${pad(mins)}M`;
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export default function RestockSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);
  const tickerTrackRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [targets, setTargets] = useState(null);
  const [now, setNow] = useState(null);
  const [notified, setNotified] = useState({});

  useEffect(() => {
    const start = Date.now();
    setTargets(
      RESTOCK_ITEMS.reduce((acc, item) => {
        acc[item.id] = start + item.hours * 60 * 60 * 1000;
        return acc;
      }, {})
    );
    setNow(start);
    setMounted(true);

    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      gsap.from([headerRef.current, ...listRef.current.children], {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      if (!reduceMotion && tickerTrackRef.current) {
        gsap.to(tickerTrackRef.current, {
          xPercent: -50,
          duration: 22,
          ease: "none",
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function toggleNotify(id) {
    setNotified((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section ref={sectionRef} className="relative w-full bg-primary overflow-hidden">
      {/* Ticker */}
      <div className="relative w-full bg-secondary py-3 overflow-hidden border-y border-black/20">
        <div ref={tickerTrackRef} className="flex whitespace-nowrap w-max">
          {[0, 1].map((rep) => (
            <span
              key={rep}
              className="font-anton uppercase text-primary text-sm md:text-base tracking-wide px-4"
            >
              {TICKER_TEXT}
              {"   /   "}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-16 lg:px-24 py-20 md:py-28">
        <div ref={headerRef} className="max-w-xl mb-14">
          <span className="text-xs font-sans tracking-[0.25em] text-secondary uppercase font-bold">
            RESTOCK // 002
          </span>
          <h2 className="font-anton uppercase leading-[0.95] text-4xl md:text-6xl text-white mt-4">
            SOLD OUT ISN&apos;T GONE
          </h2>
          <p className="font-sans text-sm md:text-base text-subtle leading-relaxed mt-5">
            Limited runs move fast and every piece comes back exactly once.
            Set an alert and you&apos;ll know the second it&apos;s live — before it&apos;s
            gone again.
          </p>
        </div>

        <div ref={listRef} className="max-w-3xl divide-y divide-white/10 border-t border-white/10">
          {RESTOCK_ITEMS.map((item) => {
            const target = targets?.[item.id];
            const remaining = mounted && target && now ? target - now : null;
            const isLive = remaining !== null && remaining <= 0;
            const isNotified = !!notified[item.id];

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-5"
              >
                <div>
                  <p className="font-sans text-white text-sm md:text-base">
                    {item.name}
                  </p>
                  <p className="font-mono text-xs text-subtle mt-1">
                    {item.size}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <span
                    className={`font-mono text-xs md:text-sm tabular-nums ${
                      isLive ? "text-secondary" : "text-muted"
                    }`}
                  >
                    {mounted && remaining !== null
                      ? formatCountdown(remaining)
                      : "— — : — —"}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleNotify(item.id)}
                    disabled={isLive}
                    className="font-sans text-xs uppercase tracking-[0.15em] font-bold
                               text-white border-b border-secondary hover:text-secondary
                               transition-colors py-1 disabled:opacity-50 disabled:border-muted"
                  >
                    {isLive ? "Shop now" : isNotified ? "You're on it" : "Notify me"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}