"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Volume2, VolumeX, ArrowRight, ChevronDown } from "lucide-react";
import gsap from "gsap";

/**
 * Height strategy:
 * - Mobile / tablet: aspect-ratio driven (4:5 → 16:10), same as before —
 *   locking these to 100svh made the video crop in far too tight on
 *   narrow, tall phone screens.
 * - Desktop (lg+): full `100svh`, since there's enough width for the
 *   video's natural framing to hold even at a tall viewport ratio.
 *
 * Content is composed as an asymmetric editorial block — left-aligned,
 * generous margins from every edge, vertically centered on the tall
 * desktop canvas instead of pinned to the bottom corner. On mobile it
 * stays bottom-anchored, where the shorter aspect box keeps it close
 * enough to the fold without feeling cramped.
 */
export default function Hero() {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const eyebrowRef = useRef(null);
  const lineOneRef = useRef(null);
  const lineTwoRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollCueRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(
          [
            eyebrowRef.current,
            lineOneRef.current,
            lineTwoRef.current,
            subRef.current,
            ctaRef.current,
          ],
          { autoAlpha: 1, y: 0, yPercent: 0 }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        videoRef.current,
        { scale: 1.12 },
        { scale: 1, duration: 2.4, ease: "power2.out" },
        0
      )
        .fromTo(
          eyebrowRef.current,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          0.3
        )
        .fromTo(
          [lineOneRef.current, lineTwoRef.current],
          { yPercent: 100 },
          { yPercent: 0, duration: 0.9, stagger: 0.12 },
          0.45
        )
        .fromTo(
          subRef.current,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          0.95
        )
        .fromTo(
          ctaRef.current,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          1.1
        );

      gsap.to(scrollCueRef.current, {
        y: 6,
        repeat: -1,
        yoyo: true,
        duration: 1.1,
        ease: "sine.inOut",
        delay: 1.7,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section
      ref={rootRef}
      className="relative -mt-[108px] aspect-[4/5] min-h-[520px] w-full overflow-hidden bg-primary sm:aspect-[16/10] lg:aspect-auto lg:h-[100svh]"
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Legibility scrims — bottom for copy, top for the transparent navbar */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/15 to-transparent lg:from-primary/80 lg:via-primary/10" />
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/55 to-transparent lg:h-48" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end px-6 pb-14 sm:px-10 sm:pb-16 lg:justify-end lg:p-16 lg:pb-16 xl:p-20 xl:pb-20">
        <div className="max-w-xl xl:max-w-3xl">
          <p
            ref={eyebrowRef}
            className="mb-5 flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-secondary opacity-0 lg:mb-6 lg:text-[12px]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            @the_origin_drop // loading
          </p>

          <h1 className="font-anton text-[clamp(2.75rem,8vw,6.5rem)] uppercase leading-[0.88] text-white">
            <span className="block overflow-hidden">
              <span ref={lineOneRef} className="block">
                Wear Your
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={lineTwoRef} className="block">
                Story
              </span>
            </span>
          </h1>

          <p
            ref={subRef}
            className="mt-6 max-w-sm font-sans text-[14px] leading-relaxed text-white/75 opacity-0 lg:mt-7 lg:max-w-md lg:text-base"
          >
            Anime-driven streetwear built for the culture. Limited runs, made
            to be worn hard and remembered longer.
          </p>

          <div
            ref={ctaRef}
            className="mt-9 flex flex-wrap items-center gap-6 opacity-0 lg:mt-10"
          >
            <Link
              href="/drop"
              className="inline-flex items-center gap-2 bg-secondary px-7 py-3.5 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-primary"
            >
              Shop the Drop
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <Link
              href="/collection"
              className="font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            >
              View Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Sound toggle */}
      {/* <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        className="absolute bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-10 lg:right-16 xl:right-20"
      >
        {muted ? (
          <VolumeX className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          <Volume2 className="h-4 w-4" strokeWidth={1.75} />
        )}
      </button> */}

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/50 sm:block"
        aria-hidden="true"
      >
        <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
      </div>
    </section>
  );
}