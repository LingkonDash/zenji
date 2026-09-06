"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

export default function ProductDetails({ product }) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          "[data-gallery-frame]",
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 0.7 }
        )
        .fromTo(
          "[data-crumb]",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.4"
        )
        .fromTo(
          "[data-title]",
          { clipPath: "inset(0 0 0 100%)" },
          { clipPath: "inset(0 0 0 0%)", duration: 0.6 },
          "-=0.2"
        )
        .fromTo(
          "[data-info-panel] > *:not([data-crumb]):not([data-title])",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 },
          "-=0.25"
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <div className="lg:sticky lg:top-10 lg:self-start">
        <ProductGallery product={product} />
      </div>
      <ProductInfo product={product} />
    </div>
  );
}
