"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loading() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = setTimeout(() => setIsVisible(false), 2000);
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => setIsVisible(false),
          });
        },
      });

      // 1. Initial State Setup
      tl.set([logoRef.current, textRef.current], { opacity: 0, y: 20 });

      // 2. Animate Logo and Text Entrance
      tl.to([logoRef.current, textRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      })

        // 3. Hold State
        .to({}, { duration: 1.2 })

        // 4. Subtle Pulse on Completion
        .to(logoRef.current, {
          scale: 1.05,
          duration: 0.2,
          ease: "power1.out",
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-primary p-8 font-sans select-none"
    >
      {/* Top Bar */}
      <div className="flex w-full justify-between items-center text-xs text-muted">
        <span>ZENJI // v1</span>
        <span>SYSTEM LOADING</span>
      </div>

      {/* Main Content Center */}
      <div className="flex flex-col items-center gap-4">
        {/* Animated Ring / Crimson Logo Accent */}
        <div
          ref={logoRef}
          className="relative flex h-16 w-16 items-center justify-center rounded-full border border-muted bg-primary/50"
        >
          <div className="h-8 w-8 rounded-full border-2 border-t-secondary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>

        {/* Text Details */}
        <div ref={textRef} className="text-center space-y-1">
          <h1 className="text-xl font-bold tracking-widest text-secondary uppercase font-anton">
            Zenji
          </h1>
          <p className="text-xs text-subtle">起動中 // INITIALIZING</p>
        </div>
      </div>

      {/* Bottom Spacer (Invisible to maintain layout balance) */}
      <div className="h-4 w-full" />
    </div>
  );
}