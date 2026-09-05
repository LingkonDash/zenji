"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { HeartCrack } from "lucide-react";
import OriginDropCard from "../shared/card/OriginDropCard";
import { getWishlist, onStoreChange } from "@/lib/cartStore";

export default function WishlistGallery() {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    setItems(getWishlist());
    setMounted(true);

    return onStoreChange(() => {
      setItems(getWishlist());
    });
  }, []);

  useGSAP(
    () => {
      if (!items.length) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const cards = gridRef.current?.querySelectorAll("[data-wishlist-card]");
      if (!cards || !cards.length) return;

      if (reduceMotion) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
        }
      );
    },
    { scope: gridRef, dependencies: [items.length] }
  );

  if (!mounted) {
    return (
      <section className="relative overflow-hidden bg-primary px-5 pb-24 pt-8 md:px-8">
        <div className="mx-auto max-w-[1600px] min-h-[300px]" />
      </section>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 px-6 py-24 text-center md:py-32">
        <HeartCrack size={32} strokeWidth={1.5} className="text-muted" />
        <p className="font-sans text-sm text-subtle">
          Your loadout is empty.
        </p>
        <p className="max-w-[38ch] font-sans text-xs text-muted">
          Browse the collection and tap the heart on pieces you want to keep
          for the next drop.
        </p>
        <Link
          href="/collection"
          className="mt-2 border border-muted/40 px-6 py-3 font-sans text-[11px] tracking-[0.15em] text-white/40 transition-colors duration-200 hover:border-secondary hover:bg-secondary hover:text-white"
        >
          BROWSE COLLECTION
        </Link>
      </div>
    );
  }

  const countLabel = String(items.length).padStart(2, "0");

  return (
    <section ref={gridRef} className="relative overflow-hidden bg-primary px-5 pb-24 pt-8 md:px-8">
      {/* Background Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-secondary/20 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-secondary/10 blur-[160px]"
      />

      <div className="relative mx-auto max-w-[1600px]">
        {/* Wishlist Status Bar */}
        <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-3 font-sans text-[11px] tracking-[0.2em] text-subtle">
          <span>SHOWING 001–{countLabel}</span>
          <span className="hidden sm:inline">{countLabel} ITEMS // WISHLIST_LOADOUT</span>
        </div>

        {/* Centered flexbox layout matching Collection page */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-14 sm:gap-x-8">
          {items.map((item, index) => (
            <div key={item.id} data-wishlist-card className="og-card">
              <OriginDropCard item={item} index={index} totalCount={items.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}