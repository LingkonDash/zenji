"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import zenjiLogo from "@/images/zenji-outlook.png";

const NAV_COLUMNS = [
  {
    heading: "DROPS",
    links: [
      { label: "Home", href: "/" },
      { label: "Drop", href: "/drop" },
      { label: "Collection", href: "/collection" },
    ],
  },
  {
    heading: "EXPLORE",
    links: [
      { label: "Lookbook", href: "/lookbook" },
      { label: "Our Story", href: "/our-story" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    heading: "SUPPORT",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Review", href: "/review" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
];

const KANJI_GLYPHS = ["武", "士", "道", "龍", "影", "刃"];

function Instagram({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function Facebook({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.6 5.82c-.9-.83-1.44-1.99-1.5-3.32h-3.02v13.6c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1 0-5.44c.28 0 .55.04.8.12V10.6a5.7 5.7 0 0 0-.8-.06 5.74 5.74 0 1 0 5.74 5.74V9.4a8.6 8.6 0 0 0 5.02 1.6V7.98a5.4 5.4 0 0 1-3.52-2.16z" />
    </svg>
  );
}

function EmberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let embers = [];
    let glyphs = [];
    let rafId = null;

    const EMBER_COUNT = 46;
    const FLARE_RATIO = 0.16;

    function resize() {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeEmber(randomY) {
      const isFlare = Math.random() < FLARE_RATIO;
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : height + Math.random() * 40,
        prevY: 0,
        r: isFlare ? Math.random() * 1.4 + 1.6 : Math.random() * 1.3 + 0.4,
        speed: isFlare
          ? Math.random() * 0.9 + 0.6
          : Math.random() * 0.32 + 0.12,
        drift: Math.random() * 0.6 - 0.3,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.015 + 0.005,
        alpha: isFlare
          ? Math.random() * 0.35 + 0.55
          : Math.random() * 0.4 + 0.2,
        isFlare,
      };
    }

    function makeGlyph() {
      return {
        char: KANJI_GLYPHS[Math.floor(Math.random() * KANJI_GLYPHS.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 60 + 70,
        speed: Math.random() * 0.05 + 0.02,
        alpha: Math.random() * 0.035 + 0.02,
        rotation: (Math.random() - 0.5) * 0.15,
      };
    }

    function init() {
      resize();
      embers = Array.from({ length: EMBER_COUNT }, () => makeEmber(true));
      embers.forEach((p) => (p.prevY = p.y));
      glyphs = Array.from({ length: 5 }, makeGlyph);
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const g of glyphs) {
        g.y -= g.speed;
        if (g.y < -g.size) {
          Object.assign(g, makeGlyph(), { y: height + g.size });
        }
        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rotation);
        ctx.font = `${g.size}px "Noto Serif JP", serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${g.alpha})`;
        ctx.fillText(g.char, 0, 0);
        ctx.restore();
      }

      for (const p of embers) {
        p.prevY = p.y;
        p.y -= p.speed;
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * 0.3 + p.drift * 0.02;

        if (p.y < -20) {
          const fresh = makeEmber(false);
          Object.assign(p, fresh, { prevY: fresh.y });
        }

        const fadeZone = height * 0.18;
        let localAlpha = p.alpha;
        if (p.y < fadeZone) localAlpha *= Math.max(p.y / fadeZone, 0);
        if (p.y > height - fadeZone) {
          localAlpha *= Math.max((height - p.y) / fadeZone, 0);
        }

        if (p.isFlare) {
          const tailLen = 14 + p.speed * 10;
          const gradient = ctx.createLinearGradient(
            p.x,
            p.prevY - tailLen,
            p.x,
            p.y
          );
          gradient.addColorStop(0, `rgba(188, 1, 0, 0)`);
          gradient.addColorStop(1, `rgba(255, 90, 70, ${localAlpha})`);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = p.r;
          ctx.beginPath();
          ctx.moveTo(p.x, p.prevY - tailLen);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 130, 100, ${localAlpha})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(188, 1, 0, ${Math.max(localAlpha, 0)})`;
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    init();

    let running = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduceMotion) {
          if (!running) {
            running = true;
            rafId = requestAnimationFrame(draw);
          }
        } else {
          running = false;
          if (rafId) cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.05 }
    );

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    if (reduceMotion) {
      draw();
      if (rafId) cancelAnimationFrame(rafId);
    }

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}

export default function Footer() {
  const rootRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Register GSAP plugin safely on the client side
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.from("[data-footer-reveal]", {
        opacity: 0,
        y: reduceMotion ? 0 : 20,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={rootRef}
      className="relative w-full bg-primary text-white overflow-hidden border-t border-white/10"
    >
      <EmberCanvas />

      {/* Breathing aura styled directly with dynamic utilities to avoid style jsx hydration mismatch */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-70 animate-[pulse_5s_ease-in-out_infinite] [background:radial-gradient(circle_at_50%_45%,rgba(188,1,0,0.16)_0%,rgba(188,1,0,0.06)_32%,rgba(11,4,4,0)_65%)]"
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-anton text-[20vw] md:text-[13vw] leading-none tracking-tighter text-white/[0.05]">
          ZENJI
        </span>
      </div>

      <div className="relative z-[2] px-6 md:px-16 lg:px-24 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-14 md:gap-8">
          <div data-footer-reveal>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 hover:scale-[1.02]">
              <Image
                src={zenjiLogo}
                alt="ZENJI"
                width={34}
                height={34}
                className="w-12 h-12 object-contain brightness-0 invert"
              />
              <span className="font-anton text-lg tracking-wide">ZENJI</span>
            </Link>

            <p className="font-sans text-sm text-subtle leading-relaxed max-w-[26ch]">
              Anime-inspired streetwear for gamers and otaku. Every drop is
              limited — once it&apos;s gone, it&apos;s gone.
            </p>

            <p className="font-sans text-[10px] tracking-[0.25em] text-muted uppercase mt-8 mb-3">
              Follow the lore
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-subtle hover:text-secondary hover:border-secondary transition-colors duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {NAV_COLUMNS.map((col) => (
            <div key={col.heading} data-footer-reveal>
              <p className="font-sans text-[10px] tracking-[0.25em] text-muted uppercase mb-5">
                {col.heading}
              </p>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-subtle hover:text-secondary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-[2] border-t border-white/10 px-6 md:px-16 lg:px-24 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-sans text-xs text-muted">
            © {mounted ? new Date().getFullYear() : "2026"} ZENJI. All drops are final. No
            restocks. Ever.
          </p>

          <div className="flex items-center gap-6 flex-wrap">
            <a
              href="#"
              className="font-sans text-xs text-muted hover:text-secondary transition-colors duration-300"
            >
              Privacy
            </a>
            <a
              href="#"
              className="font-sans text-xs text-muted hover:text-secondary transition-colors duration-300"
            >
              Terms
            </a>
            <a
              href="#"
              className="font-sans text-xs text-muted hover:text-secondary transition-colors duration-300"
            >
              Cookies
            </a>
            <span className="flex items-center gap-2 font-sans text-xs text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Anime-inspired. Gamer-built. Community-owned.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}