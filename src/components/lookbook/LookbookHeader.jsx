"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * LookbookHeader
 * Editorial hero banner for /lookbook. Purely presentational — no data
 * fetching. Piece count / labels are passed in by the page so the copy
 * can stay accurate as the local dataset grows.
 */
export default function LookbookHeader({
  eyebrow = "THE_ORIGIN_DROP // EDITORIAL",
  pieceCount = 10,
  archiveLabel = "THE_ORIGIN_DROP",
  originLabel = "ANIME STREETWEAR // AUSTRALIA",
}) {
  const scope = useRef(null);

  const padded = String(pieceCount).padStart(2, "0");

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          ["[data-eyebrow]", "[data-title-line]", "[data-sub]", "[data-meta]", "[data-year]"],
          { opacity: 1, y: 0, yPercent: 0, scale: 1 }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-eyebrow]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(
          "[data-title-line]",
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12 },
          "-=0.2"
        )
        .fromTo(
          "[data-sub]",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.35"
        )
        .fromTo(
          "[data-meta]",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.25"
        )
        .fromTo(
          "[data-year]",
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" },
          0.15
        );
    },
    { scope }
  );

  return (
    <header
      ref={scope}
      className="relative mx-auto max-w-[1600px] overflow-hidden bg-primary px-6 pb-10 pt-16 sm:px-10 sm:pt-20 lg:px-16"
    >
      {/* ghost mark aligned to the 1600px box */}
      <span
        data-year
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-0 select-none font-anton leading-none text-white/[0.05] text-[9rem] sm:right-10 sm:text-[13rem] lg:right-16 lg:text-[17rem]"
      >
        2024
      </span>

      <div className="relative z-10 max-w-5xl">
        <p
          data-eyebrow
          className="mb-4 font-sans text-xs tracking-[0.25em] text-secondary sm:text-sm"
        >
          {eyebrow}
        </p>

        <h1 className="font-anton uppercase leading-[0.92] text-white">
          <span className="block overflow-hidden">
            <span data-title-line className="block text-[2.5rem] sm:text-6xl lg:text-7xl">
              Anime Streetwear —
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-title-line className="block text-[2.5rem] sm:text-6xl lg:text-7xl">
              Look Book
            </span>
          </span>
        </h1>

        <p
          data-sub
          className="mt-6 max-w-md font-sans text-sm text-subtle"
        >
          The Origin Drop, the full visual archive.
        </p>
      </div>

      <div
        data-meta
        className="relative z-10 mt-14 flex flex-col gap-2 border-t border-white/10 pt-5 font-sans text-[11px] tracking-wide text-subtle sm:flex-row sm:items-center sm:justify-between sm:text-xs"
      >
        <span>
          {padded} PIECES // {archiveLabel} // EST_2024
        </span>
        <span>{originLabel}</span>
      </div>
    </header>
  );
}