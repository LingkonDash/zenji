"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Search, Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import gsap from "gsap";
import logo from "@/images/zenji-full-outlook.png";

export default function MobileNav({
  open,
  onClose,
  onSearchOpen,
  links,
  cartCount = 0,
  wishlistCount = 0,
}) {
  const panelRef = useRef(null);
  const itemsRef = useRef([]);
  const hasOpenedRef = useRef(false);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const items = itemsRef.current.filter(Boolean);

    const ctx = gsap.context(() => {
      if (open) {
        hasOpenedRef.current = true;
        gsap.set(panel, { display: "flex" });

        const tl = gsap.timeline();
        tl.fromTo(
          panel,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.5, ease: "power3.out" }
        ).fromTo(
          items,
          { autoAlpha: 0, x: 24 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.045,
            ease: "power2.out",
          },
          "-=0.25"
        );

        document.body.style.overflow = "hidden";
      } else if (hasOpenedRef.current) {
        // Mirrors the opening sequence: items exit first, then the panel follows —
        // same easing families, same feel, run in reverse.
        const tl = gsap.timeline({
          onComplete: () => gsap.set(panel, { display: "none" }),
        });

        tl.to([...items].reverse(), {
          autoAlpha: 0,
          x: 24,
          duration: 0.3,
          stagger: 0.035,
          ease: "power2.in",
        }).to(
          panel,
          { xPercent: 100, duration: 0.5, ease: "power3.out" },
          "-=0.15"
        );

        document.body.style.overflow = "";
      }
    });

    return () => ctx.revert();
  }, [open]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[70] hidden flex-col bg-primary md:hidden"
      style={{ display: "none" }}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-5">
        {/* Logo — pure white mark + Japanese subtext, anime-style hover */}
          <Link
            href="/"
            className="group flex flex-col items-center leading-none"
            aria-label="ZenJi home"
          >
            <Image
              src={logo}
              alt="ZenJi"
              className="w-20 brightness-0 invert transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              priority
            />

            <span className="mt-1 flex items-center gap-1.5 font-sans text-[10px] tracking-[0.25em] text-secondary transition-colors duration-300 md:text-white/85 md:group-hover:text-secondary">
              <span
                aria-hidden="true"
                className="h-px w-3 bg-current opacity-100 transition-all duration-300 md:opacity-60 group-hover:w-4 md:group-hover:opacity-100"
              />
              ゼンジ
              <span
                aria-hidden="true"
                className="h-px w-3 bg-current opacity-100 transition-all duration-300 md:opacity-60 group-hover:w-4 md:group-hover:opacity-100"
              />
            </span>
          </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="text-white transition-colors hover:text-secondary"
        >
          <X className="h-6 w-6" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-8">
        <ul className="flex flex-col">
          {links.map((link, i) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href} ref={(el) => (itemsRef.current[i] = el)}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center justify-between border-b border-white/10 py-4 transition-colors ${
                    active ? "text-secondary" : "text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`font-sans text-[11px] tabular-nums ${
                        active ? "text-secondary" : "text-subtle"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xl tracking-wide">
                      {link.label}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rotate-45 bg-secondary transition-opacity duration-300 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSearchOpen?.();
            }}
            className="flex items-center gap-2 text-[13px] uppercase tracking-[0.08em] text-white/85 transition-colors hover:text-secondary"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Search
          </button>
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center gap-2 text-[13px] uppercase tracking-[0.08em] text-white/85 transition-colors hover:text-secondary"
          >
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
          </Link>
          <button
            type="button"
            className="flex items-center gap-2 text-[13px] uppercase tracking-[0.08em] text-white/85 transition-colors hover:text-secondary"
          >
            <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}