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
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2"
        )
        .fromTo(
          "[data-info-panel] > *:not([data-crumb]):not([data-title])",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 },
          "-=0.25"
        );
    },
    { scope: containerRef }
  );

  return (
    <div className="w-full overflow-x-hidden">
      <div
        ref={containerRef}
        className="mx-auto grid w-full max-w-6xl min-w-0 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16"
      >
        <div className="w-full min-w-0 lg:sticky lg:top-10 lg:self-start">
          <ProductGallery product={product} />
        </div>
        <div className="w-full min-w-0">
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}