"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/images/zenji-full-outlook.png";
import {
  Search,
  Heart,
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import MobileNav from "./MobileNav";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Drop", href: "/drop" },
  { label: "Collection", href: "/collection" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Our Story", href: "/our-story" },
];

const MORE_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Collaboration", href: "/collaboration" },
  { label: "Reviews", href: "/review" },
];

const SCROLL_THRESHOLD = 40;

export default function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = Math.max(0, window.scrollY);

    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const scrollDiff = currentScrollY - lastScrollY.current;

      if (isHome) {
        setScrolled(currentScrollY > SCROLL_THRESHOLD);
      }

      if (currentScrollY <= SCROLL_THRESHOLD) {
        setVisible(true);
      } else if (scrollDiff > 8) {
        setVisible(false);
      } else if (scrollDiff < -8) {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Make navbar visible when mouse or touch gets close to top of viewport
  useEffect(() => {
    const handlePointerMove = (e) => {
      const clientY = e.touches ? e.touches[0]?.clientY : e.clientY;
      if (clientY !== undefined && clientY <= 80) {
        setVisible(true);
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchstart", handlePointerMove);
    };
  }, []);

  // Focus the input every time the overlay opens, not just on first mount —
  // the field stays in the DOM (opacity/translate driven) so a plain
  // `autoFocus` prop would only ever fire once.
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Close search with Escape.
  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const solid = !isHome || scrolled;
  const isVisible = visible || mobileOpen || searchOpen || moreOpen;

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const moreActive = MORE_LINKS.some((link) => isActive(link.href));

  const openSearch = () => {
    setMobileOpen(false);
    setSearchOpen(true);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
        } ${
          solid
            ? "border-b border-white/10 bg-primary"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 md:px-8">
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
                className="h-px w-3 bg-current opacity-100 transition-all duration-300 group-hover:w-4 md:opacity-60 md:group-hover:opacity-100"
              />
              ゼンジ
              <span
                aria-hidden="true"
                className="h-px w-3 bg-current opacity-100 transition-all duration-300 group-hover:w-4 md:opacity-60 md:group-hover:opacity-100"
              />
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 py-2"
                  >
                    <span className="relative flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-white/85 transition-colors duration-300 group-hover:text-white">
                      <span
                        aria-hidden="true"
                        className={`mr-1 font-sans text-secondary transition-all duration-300 ${
                          active
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }`}
                      >
                        [
                      </span>
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={`ml-1 font-sans text-secondary transition-all duration-300 ${
                          active
                            ? "translate-x-0 opacity-100"
                            : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }`}
                      >
                        ]
                      </span>
                      <span
                        className={`absolute -bottom-1.5 left-0 h-[1.5px] w-full origin-left bg-secondary transition-transform duration-300 ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </span>
                  </Link>
                </li>
              );
            })}

            {/* More dropdown */}
            <li
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                type="button"
                className="group flex items-center gap-2 py-2"
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                <span className="flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-white/85 transition-colors duration-300 group-hover:text-white">
                  <span
                    aria-hidden="true"
                    className={`mr-1 font-sans text-secondary transition-all duration-300 ${
                      moreOpen || moreActive
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  >
                    [
                  </span>
                  More
                  <span
                    aria-hidden="true"
                    className={`ml-1 font-sans text-secondary transition-all duration-300 ${
                      moreOpen || moreActive
                        ? "translate-x-0 opacity-100"
                        : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  >
                    ]
                  </span>
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    moreOpen ? "rotate-180 text-secondary" : "text-white/85"
                  }`}
                  strokeWidth={1.75}
                />
              </button>

              <div
                className={`absolute left-1/2 top-full w-44 -translate-x-1/2 border border-white/10 bg-primary transition-all duration-200 ${
                  moreOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                {MORE_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block border-l-2 px-4 py-2.5 text-[13px] uppercase tracking-[0.06em] transition-colors ${
                        active
                          ? "border-secondary bg-white/5 text-white"
                          : "border-transparent text-white/80 hover:border-secondary/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </li>
          </ul>

          {/* Utility icons */}
          <div className="flex items-center gap-5 md:gap-6">
            <button
              type="button"
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((s) => !s)}
              className={`transition-colors ${
                searchOpen ? "text-secondary" : "text-white/90 hover:text-secondary"
              }`}
            >
              {searchOpen ? (
                <X className="h-[19px] w-[19px]" strokeWidth={1.75} />
              ) : (
                <Search className="h-[19px] w-[19px]" strokeWidth={1.75} />
              )}
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={`relative transition-colors ${
                isActive("/wishlist") ? "text-secondary" : "text-white/90 hover:text-secondary"
              }`}
            >
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.75} />
              {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
            </Link>

            <div
              aria-label="Cart"
              className="relative cursor-pointer text-white/90 transition-colors hover:text-secondary"
            >
              <ShoppingCart className="h-[19px] w-[19px]" strokeWidth={1.75} />
              {cartCount > 0 && <CountBadge count={cartCount} />}
            </div>

            <button
              type="button"
              aria-label="Account"
              className="hidden text-white/90 transition-colors hover:text-secondary lg:block"
            >
              <UserRound className="h-[19px] w-[19px] cursor-pointer" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="text-white/90 transition-colors hover:text-secondary lg:hidden"
            >
              <Menu className="h-[22px] w-[22px]" strokeWidth={1.75} />
            </button>
          </div>
        </nav>

        {/*
          Search overlay — absolutely positioned against `header` (a sticky
          element is a valid containing block), so it floats over whatever
          is beneath it instead of pushing the page down. `header` already
          clips nothing, so this can safely sit right under the nav row.
        */}
        <div
          className={`absolute inset-x-0 top-full border-t border-white/10 bg-primary shadow-xl transition-all duration-300 ease-out ${
            searchOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 py-4 md:px-8">
            <Search className="h-[18px] w-[18px] shrink-0 text-subtle" strokeWidth={1.75} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products, drops, styles..."
              tabIndex={searchOpen ? 0 : -1}
              className="flex-1 bg-transparent font-sans text-sm text-white outline-none placeholder:text-subtle"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="shrink-0 text-subtle transition-colors hover:text-secondary"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSearchOpen={openSearch}
        links={[...NAV_LINKS, ...MORE_LINKS]}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </>
  );
}

function CountBadge({ count }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-secondary px-[3px] text-[10px] font-semibold leading-none text-white">
      {count}
    </span>
  );
}