"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";


const AUTO_INTERVAL = 3800;

function getCenterIndex(length) {
  return Math.floor((length || 0) / 2);
}

function getBaseTransform(i, activeIndex, centerIndex) {
  const offset = i - centerIndex;
  
  const cardSpacing = 115;
  const angleStep = 9;
  const curveDrop = 6.5;

  const isActive = i === activeIndex;

  return {
    x: offset * cardSpacing + (isActive ? -14 : 0),
    y: Math.pow(offset, 2) * curveDrop - (isActive ? 20 : 0),
    rotation: offset * angleStep,
    scale: isActive ? 1.1 : 1,
  };
}

// Fixed stacking depth — center cards remain visually elevated without z-index jumping on hover
function staticZ(i, centerIndex) {
  return 50 - Math.abs(i - centerIndex);
}

export default function HeroTwo({ data = [] }) {
  const centerIndex = getCenterIndex(data.length);

  const rootRef = useRef(null);
  const ctxRef = useRef(null);
  const layerARef = useRef(null);
  const layerBRef = useRef(null);
  const frontIsA = useRef(true);
  const isFirstBgRender = useRef(true);
  const cardRefs = useRef([]);
  const textRef = useRef(null);
  const intervalRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(centerIndex);
  const [displayIndex, setDisplayIndex] = useState(centerIndex);
  const [paused, setPaused] = useState(false);

  const active = data[displayIndex] || data[0];

  // Scatter intro effect
  useEffect(() => {
    if (!data.length) return;
    ctxRef.current = gsap.context(() => {}, rootRef);

    const finals = data.map((_, i) => getBaseTransform(i, activeIndex, centerIndex));

    data.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const b = finals[i];
      const angle = Math.random() * Math.PI * 2;
      const dist = 420 + Math.random() * 260;

      gsap.set(el, {
        x: b.x + Math.cos(angle) * dist,
        y: b.y + Math.sin(angle) * dist,
        rotation: (Math.random() - 0.5) * 200,
        scale: 0.3,
        opacity: 0,
        zIndex: staticZ(i, centerIndex),
      });
    });

    const tl = gsap.timeline({ delay: 0.15 });
    data.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const b = finals[i];
      tl.to(
        el,
        {
          x: b.x,
          y: b.y,
          rotation: b.rotation,
          scale: b.scale,
          opacity: 1,
          duration: 1.15,
          ease: "expo.out",
        },
        i * 0.07
      );
    });

    return () => ctxRef.current?.revert();
  }, []);

  // Continuous auto-cycle interval
  useEffect(() => {
    if (paused || !data.length) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % data.length);
    }, AUTO_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, data.length]);

  // Dynamic background image crossfade
  useEffect(() => {
    if (!data[activeIndex]) return;
    if (isFirstBgRender.current) {
      isFirstBgRender.current = false;
      return;
    }
    const front = frontIsA.current ? layerARef.current : layerBRef.current;
    const back = frontIsA.current ? layerBRef.current : layerARef.current;
    if (!front || !back) return;

    back.style.backgroundImage = `url(${data[activeIndex].bgImage})`;

    ctxRef.current?.add(() => {
      gsap.to(back, { autoAlpha: 1, duration: 0.9, ease: "power2.inOut" });
      gsap.to(front, { autoAlpha: 0, duration: 0.9, ease: "power2.inOut" });
    });

    frontIsA.current = !frontIsA.current;
  }, [activeIndex, data]);

  // Content text crossfade transition
  useEffect(() => {
    if (!textRef.current) return;
    ctxRef.current?.add(() => {
      const tl = gsap.timeline();
      tl.to(textRef.current, {
        autoAlpha: 0,
        y: 8,
        duration: 0.25,
        ease: "power2.in",
      })
        .call(() => setDisplayIndex(activeIndex))
        .to(textRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        });
    });
  }, [activeIndex]);

  // Smooth card transform positioning on index switch
  useEffect(() => {
    data.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const b = getBaseTransform(i, activeIndex, centerIndex);
      ctxRef.current?.add(() => {
        gsap.to(el, {
          x: b.x,
          y: b.y,
          rotation: b.rotation,
          scale: b.scale,
          duration: 0.5,
          ease: "power3.out",
        });
      });
    });
  }, [activeIndex, data, centerIndex]);

  // Static z-index setup without dynamic hover overriding
  useEffect(() => {
    data.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      gsap.set(el, { zIndex: staticZ(i, centerIndex) });
    });
  }, [data, centerIndex]);

  const handleCardEnter = useCallback((i) => {
    setPaused(true);
    setActiveIndex(i);
  }, []);

  const handleFanLeave = useCallback(() => {
    setPaused(false);
  }, []);

  if (!data.length || !active) return null;

  return (
    <section
      ref={rootRef}
      className="relative h-200 md:h-screen md:min-h-250 w-full overflow-hidden pt-10 md:pt-22 bg-black select-none"
    >
      {/* Background Image Layers */}
      <div
        ref={layerARef}
        className="absolute inset-0 bg-cover bg-top scale-105"
        style={{ backgroundImage: `url(${data[centerIndex]?.bgImage})`, opacity: 1 }}
      />
      <div
        ref={layerBRef}
        className="absolute inset-0 bg-cover bg-top scale-105"
        style={{ opacity: 0 }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" />

      {/* Main Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between pb-12 px-4 text-center">
        
        {/* Collections Header & Product Title */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.35em] text-red-500 uppercase mb-1">
            OUR COLLECTIONS
          </span>
          <p className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-white/50 uppercase mb-1 md:mb-10">
            Collection // {active.collection}
          </p>
          <h1 className="font-anton text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-tight uppercase">
            {active.title}
          </h1>
        </div>

        {/* Floating Arc Card Carousel */}
        <div
          className="relative my-auto flex h-[280px] w-full max-w-[1000px] items-center justify-center"
          style={{ perspective: "1200px" }}
          onMouseLeave={handleFanLeave}
        >
          {data.map((card, i) => (
            <button
              key={card.id}
              type="button"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onMouseEnter={() => handleCardEnter(i)}
              onFocus={() => handleCardEnter(i)}
              aria-label={`Show ${card.title}`}
              aria-pressed={i === activeIndex}
              className="absolute h-[240px] w-[160px] md:h-[260px] md:w-[175px] rounded-lg overflow-hidden outline-none cursor-pointer"
            >
              <Image
                src={card.posterImage}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 160px, 175px"
                className="object-cover"
                priority={i === centerIndex}
              />
            </button>
          ))}
        </div>

        {/* Text & Call to Action */}
        <div
          ref={textRef}
          className="flex flex-col items-center max-w-lg mx-auto"
        >
          <p className="text-sm md:text-base text-white/80 font-light leading-relaxed mb-4 line-clamp-2">
            {active.description}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl font-bold text-white">{active.price}</span>
            {active.originalPrice !== active.price && (
              <span className="text-sm text-white/40 line-through">
                {active.originalPrice}
              </span>
            )}
          </div>

          <Link
            href={`/collection`}
            className="group relative inline-flex items-center gap-3 rounded-none bg-red-600 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-red-500 hover:scale-105 active:scale-95"
          >
            Shop This Piece
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Navigation Dots */}
        <div className="mt-6 flex items-center gap-2">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => handleCardEnter(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-red-600" : "w-2 bg-white/20"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}