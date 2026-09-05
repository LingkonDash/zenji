"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import WishlistHeart from "../shared/card/WishlistHeart";
import { toggleWishlist } from "@/lib/cartStore";
import { useIsWishlisted } from "@/lib/useCartStore";

gsap.registerPlugin(ScrollTrigger);

const formatLabel = (value) => value.replace(/_/g, " ");
const FILTERS = ["all", "front", "back", "on_model"];

const NAVBAR_HEIGHT = 72;
const SCROLL_THRESHOLD = 40;

export default function LookbookGallery({ products = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = (searchParams.get("q") || "all").toLowerCase();
  const gridRef = useRef(null);
  const reducedMotion = useRef(false);

  const galleryItems = useMemo(() => {
    return products.flatMap((product) => {
      const plates = [];
      if (product.posterImage) {
        plates.push({
          key: `${product.id}-studio`,
          id: product.id,
          title: product.title,
          collection: product.collection,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.posterImage,
          variant: "STUDIO",
        });
      }
      if (product.bgImage) {
        plates.push({
          key: `${product.id}-campaign`,
          id: product.id,
          title: product.title,
          collection: product.collection,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.bgImage,
          variant: "CAMPAIGN",
        });
      }
      return plates;
    });
  }, [products]);

  useGSAP(
    () => {
      reducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const curtains = gsap.utils.toArray("[data-reveal-curtain]");
      if (curtains.length === 0) return;

      if (reducedMotion.current) {
        gsap.set(curtains, { scaleY: 0 });
        return;
      }

      gsap.set(curtains, { scaleY: 1, transformOrigin: "bottom" });

      const triggers = [];

      const reveal = (curtain, delay = 0) =>
        gsap.to(curtain, {
          scaleY: 0,
          duration: 0.85,
          ease: "power3.inOut",
          delay,
        });

      // THE ACTUAL FIX:
      // ScrollTrigger's onEnter only fires when scroll crosses the start line.
      // Since filter changes use router.push(..., { scroll: false }), no scroll
      // event ever happens — so any curtain already sitting above the "top 90%"
      // line at creation time would NEVER fire and stays stuck covering the image.
      // We check each curtain's real position first: if it's already inside the
      // reveal zone, animate it immediately instead of waiting on a scroll event.
      const setupReveals = () => {
        ScrollTrigger.refresh();
        const revealLine = window.innerHeight * 0.9;

        curtains.forEach((curtain, i) => {
          const rect = curtain.getBoundingClientRect();
          const alreadyInView = rect.top <= revealLine;

          if (alreadyInView) {
            reveal(curtain, i * 0.03); // tiny stagger so it doesn't feel like a "flash"
          } else {
            const st = ScrollTrigger.create({
              trigger: curtain,
              start: "top 90%",
              once: true,
              onEnter: () => reveal(curtain),
            });
            triggers.push(st);
          }
        });
      };

      // Layout isn't final until lazy images load (CSS-column masonry reflows
      // as each image resolves its height), so wait for them before measuring.
      const imgs = gsap.utils.toArray("img", gridRef.current);
      let pending = imgs.filter((img) => !img.complete).length;

      if (pending === 0) {
        requestAnimationFrame(setupReveals);
      } else {
        const onSettle = () => {
          pending -= 1;
          if (pending <= 0) requestAnimationFrame(setupReveals);
        };
        imgs.forEach((img) => {
          if (!img.complete) {
            img.addEventListener("load", onSettle, { once: true });
            img.addEventListener("error", onSettle, { once: true });
          }
        });
      }

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: gridRef, dependencies: [galleryItems] }
  );

  const handleFilterChange = (nextFilter) => {
    const filterVal = nextFilter.toLowerCase();
    if (filterVal === activeFilter) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    if (filterVal === "all") {
      params.delete("q");
    } else {
      params.set("q", filterVal);
    }
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (reducedMotion.current) {
      router.push(newUrl, { scroll: false });
      return;
    }

    const cards = gsap.utils.toArray("[data-lookbook-card]");
    if (cards.length > 0) {
      gsap.to(cards, {
        opacity: 0,
        y: 14,
        duration: 0.2,
        ease: "power2.in",
        stagger: 0.015,
        onComplete: () => {
          router.push(newUrl, { scroll: false });
        },
      });
    } else {
      router.push(newUrl, { scroll: false });
    }
  };

  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = Math.max(0, window.scrollY);

    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY <= SCROLL_THRESHOLD) setNavVisible(true);
      else if (diff > 8) setNavVisible(false);
      else if (diff < -8) setNavVisible(true);

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const countLabel = String(galleryItems.length).padStart(2, "0");

  return (
    <div className="w-full">
      <div
        style={{ top: navVisible ? NAVBAR_HEIGHT : 0 }}
        className="sticky z-40 mb-10 border-b border-red-900/30 bg-primary/95 backdrop-blur transition-[top] duration-300 ease-in-out supports-[backdrop-filter]:bg-primary/85 pb-6 pt-4 sm:mb-14"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => {
              const isActive = filter.toLowerCase() === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterChange(filter)}
                  aria-pressed={isActive}
                  className={`whitespace-nowrap cursor-pointer border px-4 py-2 font-sans text-xs tracking-wide transition-all duration-300 ${
                    isActive
                      ? "border-secondary bg-secondary text-white shadow-[0_0_12px_rgba(229,9,20,0.35)]"
                      : "border-red-900/40 bg-transparent text-white/70 hover:border-secondary hover:text-white"
                  }`}
                >
                  {formatLabel(filter).toUpperCase()}
                </button>
              );
            })}
          </div>

          <span className="whitespace-nowrap font-sans text-xs tracking-wide text-subtle">
            SHOWING {countLabel} {galleryItems.length === 1 ? "PIECE" : "PIECES"}
          </span>
        </div>
      </div>


      {galleryItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-red-900/40 border-l-4 border-l-secondary bg-white/[0.02] px-8 py-20 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/70">
            No archive pieces found
          </p>
          <p className="mt-2 font-sans text-xs text-subtle">
            Try another filter to see more of the archive.
          </p>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3 lg:gap-6"
        >
          {galleryItems.map((item) => {
            return (
              <LookbookCard key={item.key} item={item} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function LookbookCard({ item }) {
  const onSale =
    Boolean(item.originalPrice) && item.originalPrice !== item.price;
  const wishlisted = useIsWishlisted(item?.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item);
  };

  return (
    <Link
      href={`/drop/${item.id}`}
      data-lookbook-card
      className="group relative mb-4 block break-inside-avoid border border-red-900/30 hover:border-secondary transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:mb-5 lg:mb-6"
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full select-none transition-transform duration-500 group-hover:scale-105"
        />

        <div
          data-reveal-curtain
          className="absolute inset-0 z-20 origin-bottom scale-y-100 border border-white/5 bg-primary"
        />

        {onSale && (
          <span className="absolute left-3 top-3 z-10 border border-red-500/50 bg-secondary px-2.5 py-1 font-sans text-[10px] font-bold tracking-[0.15em] text-white shadow-md">
            SALE
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 z-30 flex flex-col justify-between bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-5 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
          <div className="flex justify-end">
            <WishlistHeart
              wishlisted={wishlisted}
              handleToggleWishlist={handleToggleWishlist}
            />
          </div>

          <div>
            <p className="font-sans text-[10px] tracking-[0.2em] text-red-400/90 font-medium">
              {item.variant}
            </p>
            <h3 className="mt-1 font-anton text-lg uppercase leading-tight text-white sm:text-xl">
              {item.title}
            </h3>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="font-sans text-xs text-white">
                {item.price}
                {onSale && (
                  <span className="ml-2 text-subtle line-through">
                    {item.originalPrice}
                  </span>
                )}
              </p>
              <span className="flex shrink-0 items-center gap-1 border border-secondary bg-secondary/20 px-2.5 py-1 font-sans text-[10px] tracking-[0.15em] text-white transition-colors duration-300 group-hover:bg-secondary">
                VIEW
                <ArrowUpRight size={12} strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}