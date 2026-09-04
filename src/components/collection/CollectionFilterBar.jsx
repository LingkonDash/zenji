"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

const FILTERS = [
  { label: "ALL", value: "all" },
  { label: "SALE", value: "sale" },
  { label: "NEW_ARRIVAL", value: "new_arrival" },
  { label: "LIMITED", value: "limited" },
  { label: "ZANGETSU", value: "zangetsu" },
];

const NAVBAR_HEIGHT = 72;
const SCROLL_THRESHOLD = 40;

export default function CollectionFilterBar({ totalItems = 0 }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeFilter = searchParams.get("category") || "all";
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debounceRef = useRef(null);

  // Mirrors the navbar's own show/hide logic so this bar rides up to
  // top: 0 the instant the navbar translates away, and drops back to
  // top: 72px the instant it returns — no gap, no lag between the two.
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

  const updateParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all") params.delete(key);
        else params.set(key, value);
      });
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const handleFilterClick = (value) => updateParams({ category: value });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ q: value.trim() || null });
    }, 400);
  };

  const clearSearch = () => {
    setQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateParams({ q: null });
  };

  useEffect(() => () => debounceRef.current && clearTimeout(debounceRef.current), []);

  return (
    <div
      style={{ top: navVisible ? NAVBAR_HEIGHT : 0 }}
      className="sticky z-40 border-b border-white/10 bg-primary/95 backdrop-blur transition-[top] duration-300 ease-in-out supports-[backdrop-filter]:bg-primary/85"
    >
      <div className="mx-auto max-w-[1600px] flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleFilterClick(filter.value)}
                aria-pressed={isActive}
                className={`whitespace-nowrap cursor-pointer border px-4 py-2 font-sans text-xs tracking-wide transition-colors duration-200 ${
                  isActive
                    ? "border-secondary bg-secondary text-white"
                    : "border-white/15 bg-transparent text-white/70 hover:border-secondary/50 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
              strokeWidth={1.75}
            />
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-48 border border-white/15 bg-white/5 py-2 pl-9 pr-8 font-sans text-xs text-white placeholder:text-subtle focus:border-secondary focus:outline-none sm:w-56"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-subtle hover:text-secondary"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            )}
          </div>
          <span className="whitespace-nowrap font-sans text-xs text-subtle">
            {isPending ? "UPDATING..." : `${totalItems} ITEMS`}
          </span>
        </div>
      </div>
    </div>
  );
}