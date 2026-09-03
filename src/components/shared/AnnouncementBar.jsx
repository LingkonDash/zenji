"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const MESSAGES = [
  "New drop: Blue Flame Tee now available",
  "Limited stock",
  "The Origin Drop collection live",
  "Free shipping Australia-wide on orders over A$100",
];

function Track({ innerRef, ariaHidden }) {
  return (
    <div
      ref={innerRef}
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden}
    >
      {MESSAGES.map((msg, i) => (
        <span key={i} className="flex items-center">
          <span className="px-4 whitespace-nowrap">{msg}</span>
          <span className="text-white/40" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </div>
  );
}

export default function AnnouncementBar() {
  const containerRef = useRef(null);
  const singleTrackRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const singleTrack = singleTrackRef.current;
    if (!container || !singleTrack) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const initAnimation = () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      gsap.set(container, { x: 0 });

      const singleSetWidth = singleTrack.offsetWidth;

      if (singleSetWidth === 0) return;

      tweenRef.current = gsap.to(container, {
        x: -singleSetWidth,
        duration: singleSetWidth / 42,
        ease: "none",
        repeat: -1,
      });
    };

    initAnimation();

    if (document.fonts) {
      document.fonts.ready.then(initAnimation);
    }

    window.addEventListener("resize", initAnimation);

    return () => {
      tweenRef.current?.kill();
      window.removeEventListener("resize", initAnimation);
    };
  }, []);

  return (
    <div
      className="relative z-40 h-9 overflow-hidden bg-secondary text-white"
      role="marquee"
      aria-label="Store announcements"
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.resume()}
    >
      <div
        ref={containerRef}
        className="flex h-full w-max items-center whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.14em] will-change-transform"
      >
        <Track innerRef={singleTrackRef} ariaHidden={false} />
        <Track ariaHidden={true} />
        <Track ariaHidden={true} />
        <Track ariaHidden={true} />
        <Track ariaHidden={true} />
        <Track ariaHidden={true} />
      </div>
    </div>
  );
}