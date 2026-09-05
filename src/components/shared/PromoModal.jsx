'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

const CATEGORIES = [
  'JUJUTSU KAISEN',
  'DEMON SLAYER',
  'ONE PIECE',
  'NARUTO',
  'DRAGON BALL',
  'OTHER',
];

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Check if the modal has already been shown in this tab/session
    const hasSeenModal = sessionStorage.getItem('hasSeenPromoModal');

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000); // 5 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Entrance Animation
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 }
      );
    }
  }, [isOpen]);

  const handleClose = (selectedCategory = null) => {
    if (selectedCategory) {
      // Store user preference or dispatch actions here if needed
      sessionStorage.setItem('userAnimePreference', selectedCategory);
    }

    // Mark as seen so route changes/re-renders won't trigger it again
    sessionStorage.setItem('hasSeenPromoModal', 'true');

    // Exit Animation
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 10,
      duration: 0.3,
      ease: 'power2.in',
    });

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      delay: 0.1,
      onComplete: () => setIsOpen(false),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="relative flex w-full max-w-4xl overflow-hidden rounded-none shadow-2xl border border-[var(--color-muted)]/30 bg-[var(--color-primary)] text-white"
      >
        {/* Left Side - Image Banner */}
        <div className="relative hidden w-1/2 md:block">
          <Image
            src="/images/background/bg_2.avif"
            alt="Anime Apparel Banner"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 via-transparent to-transparent md:hidden" />
        </div>

        {/* Right Side - Content & Selection */}
        <div className="relative flex w-full flex-col justify-center p-8 md:w-1/2 md:p-10">
          {/* Close Button */}
          <button
            onClick={() => handleClose()}
            aria-label="Close Modal"
            className="absolute top-4 right-4 cursor-pointer flex h-8 w-8 items-center justify-center border border-[var(--color-muted)] text-[var(--color-subtle)] transition-colors hover:border-white hover:text-white"
          >
            ✕
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="font-anton text-4xl uppercase tracking-wider text-white md:text-5xl">
              ZENJI
            </h2>
            <p className="font-anton mt-1 text-xl tracking-wide text-white md:text-2xl">
              FREE SHIPPING ON FIRST ORDER
            </p>
            <p className="font-sans mt-2 text-xs tracking-widest uppercase text-[var(--color-subtle)]">
              CHOOSE YOUR FIGHTER
            </p>
          </div>

          {/* Category List Buttons */}
          <div className="flex flex-col gap-2.5">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleClose(category)}
                className="font-sans w-full border cursor-pointer border-[var(--color-muted)] bg-transparent py-2.5 text-xs tracking-widest text-white transition-all duration-200 hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 hover:text-white"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}