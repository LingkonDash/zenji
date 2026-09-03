"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

const DATA = [
  {
    id: "blue-flame-tee",
    title: "Blue Flame Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Premium 240gsm heavyweight cotton tee featuring custom anime streetwear blue flame graphic artwork.",
    price: "A$33.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Blue-flame.avif",
    bgImage: "/images/hero/Blue-flame.avif",
  },
  {
    id: "demon-blood-tee",
    title: "Demon Blood Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Japanese-inspired warrior graphic on heavy oversized silhouette. Limited release drop.",
    price: "A$33.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Demon-blood.avif",
    bgImage: "/images/hero/Demon-blood.avif",
  },
  {
    id: "will-of-the-sun-tee",
    title: "Will Of The Sun Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "High-contrast anime graphic tee engineered for technical precision and street culture.",
    price: "A$33.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Will-of-the-sun.avif",
    bgImage: "/images/hero/Will-of-the-sun.avif",
  },
  {
    id: "warrior-spirit-tee",
    title: "Warrior Spirit Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Iconic samurai discipline artwork printed on 100% heavyweight cotton canvas structure.",
    price: "A$33.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Warrior-spirit.avif",
    bgImage: "/images/hero/Warrior-spirit.avif",
  },
  {
    id: "bushido-tee",
    title: "Bushido Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Minimalist streetwear front paired with a high-impact back anime design.",
    price: "A$39.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Bushido.avif",
    bgImage: "/images/hero/Bushido.avif",
  },
  {
    id: "domain-expansion-tee",
    title: "Domain Expansion Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Gamer-built anime graphic streetwear piece. No restocks, limited quantities.",
    price: "A$39.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Domain-expansion.avif",
    bgImage: "/images/hero/Domain-expansion.avif",
  },
  {
    id: "water-breathing-tee",
    title: "Water Breathing Tee",
    collection: "THE_ORIGIN_DROP",
    description:
      "Fluid Japanese iconography and dark anime streetwear aesthetic.",
    price: "A$39.99",
    originalPrice: "A$39.99",
    posterImage: "/images/hero/card/Water-breathing.avif",
    bgImage: "/images/hero/Water-breathing.avif",
  },
];

const AUTO_INTERVAL = 3800;
const CENTER = Math.floor(DATA.length / 2);

function getBaseTransform(i, activeIndex) {
  const offset = i - CENTER;

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
function staticZ(i) {
  return 50 - Math.abs(i - CENTER);
}

export default function HeroTwo() {
  const rootRef = useRef(null);
  const ctxRef = useRef(null);
  const layerARef = useRef(null);
  const layerBRef = useRef(null);
  const frontIsA = useRef(true);
  const isFirstBgRender = useRef(true);
  const cardRefs = useRef([]);
  const textRef = useRef(null);
  const intervalRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(CENTER);
  const [displayIndex, setDisplayIndex] = useState(CENTER);
  const [paused, setPaused] = useState(false);

  const active = DATA[displayIndex];

  // Scatter intro effect
  useEffect(() => {
    ctxRef.current = gsap.context(() => {}, rootRef);

    const finals = DATA.map((_, i) => getBaseTransform(i, activeIndex));

    DATA.forEach((_, i) => {
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
        zIndex: staticZ(i),
      });
    });

    const tl = gsap.timeline({ delay: 0.15 });
    DATA.forEach((_, i) => {
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
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % DATA.length);
    }, AUTO_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  // Dynamic background image crossfade
  useEffect(() => {
    if (isFirstBgRender.current) {
      isFirstBgRender.current = false;
      return;
    }
    const front = frontIsA.current ? layerARef.current : layerBRef.current;
    const back = frontIsA.current ? layerBRef.current : layerARef.current;
    if (!front || !back) return;

    back.style.backgroundImage = `url(${DATA[activeIndex].bgImage})`;

    ctxRef.current?.add(() => {
      gsap.to(back, { autoAlpha: 1, duration: 0.9, ease: "power2.inOut" });
      gsap.to(front, { autoAlpha: 0, duration: 0.9, ease: "power2.inOut" });
    });

    frontIsA.current = !frontIsA.current;
  }, [activeIndex]);

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
    DATA.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const b = getBaseTransform(i, activeIndex);
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
  }, [activeIndex]);

  // Static z-index setup without dynamic hover overriding
  useEffect(() => {
    DATA.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      gsap.set(el, { zIndex: staticZ(i) });
    });
  }, []);

  const handleCardEnter = useCallback((i) => {
    setPaused(true);
    setActiveIndex(i);
  }, []);

  const handleFanLeave = useCallback(() => {
    setPaused(false);
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative h-200 md:h-screen md:min-h-250 w-full overflow-hidden pt-10 md:pt-22 bg-black select-none"
    >
      {/* Background Image Layers */}
      <div
        ref={layerARef}
        className="absolute inset-0 bg-cover bg-top scale-105"
        style={{ backgroundImage: `url(${DATA[CENTER].bgImage})`, opacity: 1 }}
      />
      <div
        ref={layerBRef}
        className="absolute inset-0 bg-cover bg-top scale-105"
        style={{ opacity: 0 }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50" />

      {/* Main Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between pb-12 px-4 text-center">
        
        {/* Collections Header & Product Title */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.35em] text-red-500 uppercase mb-1">
            COLLECTIONS WE HAVE
          </span>
          <p className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-white/50 uppercase mb-1 md:mb-10">
            Collection // {active.collection}
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase">
            {active.title}
          </h1>
        </div>

        {/* Floating Arc Card Carousel */}
        <div
          className="relative my-auto flex h-[280px] w-full max-w-[1000px] items-center justify-center"
          style={{ perspective: "1200px" }}
          onMouseLeave={handleFanLeave}
        >
          {DATA.map((card, i) => (
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
                priority={i === CENTER}
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
            className="group relative inline-flex items-center gap-3 rounded-full bg-red-600 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-red-500 hover:scale-105 active:scale-95"
          >
            Shop This Piece
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Navigation Dots */}
        <div className="mt-6 flex items-center gap-2">
          {DATA.map((_, i) => (
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