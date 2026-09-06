'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          '.nf-label',
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.5 }
        )
          .fromTo(
            '.nf-headline',
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: 0.9 },
            '-=0.2'
          )
          .fromTo(
            '.nf-sub',
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.3'
          )
          .fromTo(
            '.nf-cta',
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.3'
          );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-primary px-6 text-center text-white selection:bg-secondary selection:text-white"
    >
      {/* Radial gradient background accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,1,0,0.12)_0%,transparent_70%)]" />

      {/* Ambient watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
      >
        <span className="font-anton text-[38vw] leading-none text-white/[0.02] sm:text-[24vw]">
          404
        </span>
      </span>

      {/* Grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <p className="nf-label mb-4 flex items-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-secondary sm:text-sm">
          <span className="text-muted">[</span>
          Error // 404
          <span className="text-muted">]</span>
        </p>

        <h1 className="nf-headline font-anton text-6xl uppercase tracking-wider text-white sm:text-7xl md:text-8xl">
          Signal
          <span className="text-secondary animate-pulse motion-reduce:animate-none">
            _
          </span>
          Lost
        </h1>

        <p className="nf-sub mt-6 max-w-md font-sans text-sm leading-relaxed text-subtle sm:text-base">
          The coordinates you requested do not exist in this sector. Verify the route or re-establish link with command center.
        </p>

        <Link
          href="/"
          className="nf-cta group relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-md border border-secondary/40 bg-primary/80 px-8 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-all duration-300 hover:border-secondary hover:bg-secondary/20 hover:shadow-[0_0_25px_rgba(188,1,0,0.4)] active:scale-95"
        >
          <ArrowLeft
            size={16}
            className="text-secondary transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-white"
          />
          <span>Return_To_Base</span>
        </Link>
      </div>
    </main>
  );
}