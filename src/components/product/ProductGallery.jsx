"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DiscountBadge from "@/components/shared/badge/DiscountBadge";

export default function ProductGallery({ product }) {
  const images = [product.bgImage, product.posterImage, ...(product.gallery ?? [])].filter(
    (src, index, arr) => Boolean(src) && arr.indexOf(src) === index
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const frameRef = useRef(null);
  const imageRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const thumbnailsRef = useRef([]);
  const hasMounted = useRef(false);

  // Auto-play loop
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  // Active state animations & isolated scroll containment
  useGSAP(
    () => {
      if (!hasMounted.current) {
        hasMounted.current = true;
        return;
      }

      // Smooth opacity & scale transition
      gsap.fromTo(
        imageRef.current,
        { opacity: 0.2, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
      );

      // Scroll thumbnail isolated ONLY to the internal container (prevents window layout shift)
      const activeThumb = thumbnailsRef.current[activeIndex];
      const scrollContainer = scrollContainerRef.current;

      if (activeThumb && scrollContainer) {
        const thumbLeft = activeThumb.offsetLeft;
        const thumbWidth = activeThumb.clientWidth;
        const containerWidth = scrollContainer.clientWidth;

        scrollContainer.scrollTo({
          left: thumbLeft - containerWidth / 2 + thumbWidth / 2,
          behavior: "smooth",
        });
      }
    },
    { dependencies: [activeIndex], scope: frameRef }
  );

  const handleSelectImage = (index) => {
    setActiveIndex(index);
  };

  return (
    <div 
      className="relative w-full max-w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Main Image Frame */}
      <div
        ref={frameRef}
        className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 bg-primary"
        data-gallery-frame
      >
        <div ref={imageRef} className="relative h-full w-full">
          <Image
            key={images[activeIndex]}
            src={images[activeIndex]}
            alt={`${product.title} — view ${activeIndex + 1}`}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Halftone texture overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Gradient vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/10"
        />

        <div className="absolute left-3 top-3 sm:left-4 sm:top-4 -rotate-6 z-10">
          <DiscountBadge
            price={product.price}
            originalPrice={product.originalPrice}
            variant="stamp"
          />
        </div>
      </div>

      {/* Thumbnail Navigation Rail */}
      {images.length > 1 && (
        <div 
          ref={scrollContainerRef}
          className="mt-3 flex max-w-full gap-2.5 overflow-x-auto pb-2 pt-0.5 no-scrollbar"
        >
          {images.map((src, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={src}
                ref={(el) => (thumbnailsRef.current[index] = el)}
                type="button"
                onClick={() => handleSelectImage(index)}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={isActive}
                className={`relative h-16 w-14 sm:h-20 sm:w-16 shrink-0 cursor-pointer overflow-hidden border transition-all duration-200 ${
                  isActive
                    ? "border-secondary ring-1 ring-secondary"
                    : "border-white/10 hover:border-white/40 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                {isActive && (
                  <span className="absolute inset-0 bg-secondary/10 pointer-events-none" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
