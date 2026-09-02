"use client";

import { useEffect, useState } from "react";
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
import MobileNav from "./Mobilenav";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Drop", href: "/drop" },
  { label: "Collection", href: "/collection" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Our Story", href: "/our-story" },
];

const MORE_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Reviews", href: "/review" },
];

const SCROLL_THRESHOLD = 40;

export default function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;

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
        className={`sticky top-0 z-50 transition-colors duration-500 ${solid
          ? "bg-primary border-b border-white/10"
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
                className="h-px w-3 bg-current opacity-100 transition-all duration-300 md:opacity-60 group-hover:w-4 md:group-hover:opacity-100"
              />
              ゼンジ
              <span
                aria-hidden="true"
                className="h-px w-3 bg-current opacity-100 transition-all duration-300 md:opacity-60 group-hover:w-4 md:group-hover:opacity-100"
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
                        className={`mr-1 font-sans text-secondary transition-all duration-300 ${active
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                      >
                        [
                      </span>
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={`ml-1 font-sans text-secondary transition-all duration-300 ${active
                          ? "translate-x-0 opacity-100"
                          : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                      >
                        ]
                      </span>
                      <span
                        className={`absolute -bottom-1.5 left-0 h-[1.5px] w-full origin-left bg-secondary transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
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
                    className={`mr-1 font-sans text-secondary transition-all duration-300 ${moreOpen || moreActive
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                  >
                    [
                  </span>
                  More
                  <span
                    aria-hidden="true"
                    className={`ml-1 font-sans text-secondary transition-all duration-300 ${moreOpen || moreActive
                      ? "translate-x-0 opacity-100"
                      : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                  >
                    ]
                  </span>
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180 text-secondary" : "text-white/85"
                    }`}
                  strokeWidth={1.75}
                />
              </button>

              <div
                className={`absolute left-1/2 top-full w-44 -translate-x-1/2 border border-white/10 bg-primary transition-all duration-200 ${moreOpen
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
                      className={`block border-l-2 px-4 py-2.5 text-[13px] uppercase tracking-[0.06em] transition-colors ${active
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
              onClick={() => setSearchOpen((s) => !s)}
              className={`transition-colors ${searchOpen ? "text-secondary" : "text-white/90 hover:text-secondary"
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
              className={`relative transition-colors ${isActive("/wishlist")
                ? "text-secondary"
                : "text-white/90 hover:text-secondary"
                }`}
            >
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.75} />
              {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
            </Link>

            <div
              aria-label="Cart"
              className={`relative cursor-pointer transition-colors text-white/90 hover:text-secondary`}
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

        {/* Search overlay — solid bg regardless of scroll state so it stays legible on the transparent home header */}
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-400 ease-out ${searchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="mx-auto flex max-w-[1600px] items-center gap-3 border-t border-white/10 bg-primary px-5 py-4 md:px-8">
            <Search className="h-[18px] w-[18px] shrink-0 text-subtle" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Search products, drops, styles..."
              autoFocus={searchOpen}
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