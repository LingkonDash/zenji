"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useStoreCounts } from "@/lib/useCartStore";

/**
 * WishlistHeader
 *
 * Props:
 * - count (number, optional): override count if provided.
 */
export default function WishlistHeader({ count }) {
  const rootRef = useRef(null);
  const { wishlistCount } = useStoreCounts();
  const itemCount = count ?? wishlistCount;

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const eyebrow = rootRef.current.querySelector("[data-eyebrow]");
      const rule = rootRef.current.querySelector("[data-rule]");
      const headlineInner = rootRef.current.querySelector("[data-headline-inner]");
      const sub = rootRef.current.querySelector("[data-sub]");

      if (reduceMotion) {
        gsap.set([eyebrow, rule, headlineInner, sub], { clearProps: "all" });
        return;
      }

      gsap.set(headlineInner, { yPercent: 110 });
      gsap.set([eyebrow, sub], { autoAlpha: 0, x: -12 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to(eyebrow, { autoAlpha: 1, x: 0, duration: 0.5 })
        .to(rule, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, "<0.05")
        .to(headlineInner, { yPercent: 0, duration: 0.9 }, "<0.1")
        .to(sub, { autoAlpha: 1, x: 0, duration: 0.5 }, "<0.35");
    },
    { scope: rootRef, dependencies: [] }
  );

  return (
    <header ref={rootRef} className="border-b border-muted/30 bg-primary px-6 pb-10 pt-16 md:px-10 md:pb-14 md:pt-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center gap-3">
          <span
            data-eyebrow
            className="font-sans text-[11px] tracking-[0.25em] text-secondary"
          >
            SYSTEM // SAVED_ITEMS
          </span>
          <span
            data-rule
            className="h-px flex-1 bg-muted/40"
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-4 overflow-hidden">
          <span
            data-headline-inner
            className="block font-anton text-[15vw] leading-[0.9] text-white sm:text-[9vw] md:text-[6.5vw] lg:text-[88px]"
          >
            YOUR LOADOUT
          </span>
        </h1>

        <p
          data-sub
          className="mt-4 max-w-[46ch] font-sans text-sm text-muted md:text-base"
        >
          {itemCount > 0
            ? `${itemCount} ${itemCount === 1 ? "piece" : "pieces"} saved for the next drop.`
            : "Nothing saved yet — mark pieces from the collection to build your loadout."}
        </p>
      </div>
    </header>
  );
}