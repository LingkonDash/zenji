"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap"; 
// import { getDiscountPercent } from "@/lib/product/formatters";

/**
 * Image viewer for a single product.
 * Renders bgImage first, then posterImage, then anything in `gallery` —
 * all deduped into one array the thumbnail rail maps over.
 */
export default function ProductGallery({ product }) {
  const images = [product.bgImage, product.posterImage, ...(product.gallery ?? [])].filter(
    (src, index, arr) => Boolean(src) && arr.indexOf(src) === index
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const frameRef = useRef(null);
  const hasMounted = useRef(false);
  const discount = 10 //getDiscountPercent(product.price, product.originalPrice);

  useGSAP(() => {
    // Skip the crossfade punch on first paint — the page-load timeline
    // (in ProductDetails) already handles the entrance for this frame.
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    gsap.fromTo(
      frameRef.current,
      { opacity: 0.25, scale: 1.03 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
    );
  }, [activeIndex]);

  return (
    <div className="w-full">
      {/* Main frame */}
      <div
        ref={frameRef}
        className="relative aspect-[3/4] w-full overflow-hidden border border-white/10 bg-primary sm:aspect-[4/5]"
        data-gallery-frame
      >
        <Image
          key={images[activeIndex]}
          src={images[activeIndex]}
          alt={`${product.title} — view ${activeIndex + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />

        {/* Screentone texture — anime print halftone, not a decorative gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Vignette so the badge / thumbnails have contrast on any photo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/10"
        />

        {discount > 0 && (
          <div className="absolute left-4 top-4 -rotate-6">
            <div className="flex h-16 w-16 flex-col items-center justify-center border-2 border-secondary bg-primary/90 text-center leading-none text-secondary sm:h-20 sm:w-20">
              <span className="font-anton text-xl sm:text-2xl">-{discount}%</span>
              <span className="font-sans text-[8px] tracking-[0.15em] text-secondary/80 sm:text-[9px]">
                LIMITED
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail rail */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border transition-colors sm:h-24 sm:w-20 ${
                activeIndex === index
                  ? "border-secondary"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
              {activeIndex === index && (
                <span className="absolute inset-0 bg-secondary/10" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
