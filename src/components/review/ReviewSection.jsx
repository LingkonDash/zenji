"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Star, ShieldCheck, ChevronDown, ArrowRight, Check } from "lucide-react";

import zenjiFull from "@/images/zenji-full-outlook.png";
import zenjiMark from "@/images/zenji-outlook.png";

const PRODUCTS = [
  "Blue Flame Tee",
  "Bushido Tee",
  "Demon Blood Tee",
  "Domain Expansion Tee",
  "Free Soul Tee",
  "Limitless Tee",
  "Paradise Spirit Tee",
  "Warrior Spirit Tee",
  "Water Breathing Tee",
  "Will Of The Sun Tee",
];

const TAGS = [
  "True to size",
  "Runs small",
  "Runs large",
  "Premium quality",
  "Fast shipping",
  "Great packaging",
  "Worth the wait",
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "5", label: "5★" },
  { id: "4", label: "4★" },
  { id: "3", label: "3★" },
  { id: "verified", label: "Verified" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  product: "",
  orderNumber: "",
  rating: 0,
  title: "",
  body: "",
  tags: [],
};

function computeStats(reviews) {
  const total = reviews.length;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({ star, pct: 0, count: 0 }));
  if (!total) return { avg: 0, total: 0, fiveStarPct: 0, recommendPct: 0, breakdown };

  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => counts[r.rating - 1]++);
  breakdown.forEach((row) => {
    row.count = counts[row.star - 1];
    row.pct = Math.round((row.count / total) * 100);
  });

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / total;
  const fiveStarPct = Math.round((counts[4] / total) * 100);
  const recommendPct = Math.round(
    (reviews.filter((r) => r.rating >= 4).length / total) * 100
  );

  return { avg, total, fiveStarPct, recommendPct, breakdown };
}

function StarRow({ rating, size = "h-4 w-4" }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          strokeWidth={1.5}
          className={`${size} ${
            n <= rating ? "fill-secondary text-secondary" : "text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function RatingPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-2" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          aria-label={`${n} star`}
          className="p-1"
        >
          <Star
            strokeWidth={1.5}
            className={`h-6 w-6 transition-colors ${
              n <= (hover || value) ? "fill-secondary text-secondary" : "text-muted"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const STORAGE_KEY = "zenji_reviews";

function loadReviews() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function ReviewSection() {
  const root = useRef(null);
  const [reviews, setReviews] = useState(loadReviews);
  const [filter, setFilter] = useState("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  // Persist reviews to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // storage full or unavailable — silently ignore
    }
  }, [reviews]);

  const stats = useMemo(() => computeStats(reviews), [reviews]);

  const visible = useMemo(() => {
    let list = [...reviews];
    if (filter === "verified") list = list.filter((r) => r.verified);
    else if (filter !== "all") list = list.filter((r) => r.rating === Number(filter));
    list.sort((a, b) => (sortDesc ? b.date - a.date : a.date - b.date));
    return list;
  }, [reviews, filter, sortDesc]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".rev-hero-el",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const toggleTag = (tag) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.product || !form.rating || !form.title || !form.body) {
      return;
    }
    const newReview = {
      id: Date.now(),
      name: form.name,
      product: form.product,
      rating: form.rating,
      title: form.title,
      body: form.body,
      tags: form.tags,
      verified: true,
      date: Date.now(),
    };
    setReviews((r) => [newReview, ...r]);
    setForm(EMPTY_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <main ref={root} className="relative overflow-hidden bg-primary font-sans text-[#EFEDE8]">
      {/* stable, low-opacity wordmark backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-[0.055]"
      >
        <div className="relative h-[90vh] w-[95vw] md:h-[80vh] md:w-[60vw]">
          <Image src={zenjiFull} alt="" fill priority className="object-contain brightness-0 invert" sizes="100vw" />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-10%] left-[-10%] z-0 h-[34rem] w-[34rem] rounded-full bg-secondary/[0.06] blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-15%] right-[-10%] z-0 h-[28rem] w-[28rem] rounded-full bg-secondary/[0.05] blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ---------------- MAIN CONTENT WRAPPER (1500px MAX-WIDTH) ---------------- */}
      <div className="mx-auto max-w-[1500px] relative z-10">
        {/* ---------------- HERO ---------------- */}
        <section className="relative border-b border-muted/25 px-6 pt-28 pb-16 md:px-16 md:pt-36 md:pb-20">
          <div className="rev-hero-el mb-6 flex items-center gap-3">
            <span className="relative block h-7 w-7 shrink-0">
              <Image src={zenjiMark} alt="ZENJI mark" fill className="object-contain brightness-0 invert" />
            </span>
            <p className="text-xs tracking-[0.3em] text-subtle">COMMUNITY // ZENJI</p>
          </div>
          <h1 className="rev-hero-el font-anton max-w-3xl text-[15vw] leading-[0.9] tracking-tight md:text-[5.5vw]">
            REVIEWS
          </h1>
          <p className="rev-hero-el mt-6 max-w-md text-sm leading-relaxed text-subtle">
            What the community says about fit, print quality and fabric weight.
          </p>
        </section>

        {/* ---------------- RATING SUMMARY ---------------- */}
        <section className="rev-hero-el relative border-b border-muted/25 px-6 py-16 md:px-16">
          <div className="grid gap-12 md:grid-cols-[240px_1fr_1fr]">
            {/* big score */}
            <div>
              <div className="font-anton text-6xl md:text-7xl">
                {stats.total ? stats.avg.toFixed(1) : "—"}
              </div>
              <p className="mt-2 text-xs tracking-[0.25em] text-subtle">OUT OF 5</p>
              <div className="mt-4">
                <StarRow rating={Math.round(stats.avg)} size="h-5 w-5" />
              </div>
            </div>

            {/* breakdown bars */}
            <div className="flex flex-col justify-center gap-3">
              {stats.breakdown.map((row) => (
                <div key={row.star} className="flex items-center gap-3">
                  <span className="w-8 shrink-0 text-xs text-subtle">{row.star}★</span>
                  <div className="h-2 flex-1 bg-muted/20">
                    <div
                      className="h-full bg-secondary transition-all duration-500"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-xs text-subtle">{row.pct}%</span>
                </div>
              ))}
            </div>

            {/* side stats */}
            <div className="grid grid-cols-3 gap-6 md:grid-cols-1 md:gap-4">
              <div>
                <div className="font-anton text-2xl">{stats.total}</div>
                <p className="text-xs tracking-[0.2em] text-subtle">PUBLISHED REVIEWS</p>
              </div>
              <div>
                <div className="font-anton text-2xl">
                  {stats.total ? `${Math.round((stats.avg / 5) * 100)}%` : "0%"}
                </div>
                <p className="text-xs tracking-[0.2em] text-subtle">AVERAGE RATING</p>
              </div>
              <div>
                <div className="font-anton text-2xl">{stats.fiveStarPct}%</div>
                <p className="text-xs tracking-[0.2em] text-subtle">FIVE STAR</p>
              </div>
              <div>
                <div className="font-anton text-2xl">{stats.recommendPct}%</div>
                <p className="text-xs tracking-[0.2em] text-subtle">RECOMMEND</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- FILTER / SORT ---------------- */}
        <section className="relative flex flex-wrap items-center justify-between gap-4 border-b border-muted/25 px-6 py-6 md:px-16">
          <div className="flex flex-wrap gap-px">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`border-b-2 px-4 py-2 text-xs tracking-[0.15em] transition-colors duration-300 ${
                  filter === f.id
                    ? "border-secondary text-[#EFEDE8]"
                    : "border-transparent text-subtle hover:text-[#EFEDE8]"
                }`}
              >
                {f.label.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setSortDesc((s) => !s)}
              className="flex items-center gap-2 text-xs tracking-[0.15em] text-subtle transition-colors hover:text-[#EFEDE8]"
            >
              {sortDesc ? "NEWEST FIRST" : "OLDEST FIRST"}
              <ChevronDown
                strokeWidth={1.5}
                className={`h-3.5 w-3.5 transition-transform ${sortDesc ? "" : "rotate-180"}`}
              />
            </button>
            <span className="text-xs tracking-[0.15em] text-subtle">
              SHOWING {visible.length} OF {reviews.length}
            </span>
          </div>
        </section>

        {/* ---------------- REVIEW LIST ---------------- */}
        <section className="relative border-b border-muted/25 px-6 py-16 md:px-16">
          {visible.length === 0 ? (
            <div className="flex flex-col items-start gap-6 py-12">
              <p className="text-subtle">No reviews published yet. Be the first.</p>
              <a
                href="#leave-review"
                className="inline-flex items-center gap-2 border border-[#EFEDE8]/70 px-6 py-3 text-xs tracking-[0.2em] transition-colors duration-300 hover:border-secondary hover:bg-secondary"
              >
                LEAVE THE FIRST REVIEW
                <ArrowRight strokeWidth={1.5} className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <div className="grid gap-px bg-muted/25 md:grid-cols-2">
              {visible.map((r) => (
                <article key={r.id} className="flex flex-col gap-4 bg-primary p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <StarRow rating={r.rating} />
                    {r.verified && (
                      <span className="flex items-center gap-1.5 text-xs tracking-[0.15em] text-subtle">
                        <ShieldCheck strokeWidth={1.5} className="h-3.5 w-3.5 text-secondary" />
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <h3 className="font-anton text-xl leading-tight">{r.title}</h3>
                  <p className="text-sm leading-relaxed text-subtle">{r.body}</p>
                  {r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {r.tags.map((t) => (
                        <span
                          key={t}
                          className="border border-muted/40 px-2.5 py-1 text-[11px] tracking-[0.1em] text-subtle"
                        >
                          {t.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between border-t border-muted/25 pt-4 text-xs text-subtle">
                    <span>{r.name}</span>
                    <span>{r.product}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ---------------- LEAVE A REVIEW ---------------- */}
        <section id="leave-review" className="relative px-6 py-24 md:px-16">
          <h2 className="font-anton mb-2 text-[9vw] leading-[0.95] md:text-[3.2vw]">
            LEAVE YOUR VERDICT
          </h2>
          <p className="mb-12 text-xs tracking-[0.2em] text-subtle">VERIFIED PURCHASES ONLY</p>

          <form onSubmit={handleSubmit} className="grid max-w-3xl gap-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs tracking-[0.2em] text-subtle">NAME</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="border border-muted/40 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-secondary"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs tracking-[0.2em] text-subtle">EMAIL</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="border border-muted/40 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-secondary"
                />
              </label>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs tracking-[0.2em] text-subtle">PRODUCT PURCHASED</span>
                <select
                  value={form.product}
                  onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
                  required
                  className="border border-muted/40 bg-primary px-4 py-3 text-sm outline-none transition-colors focus:border-secondary"
                >
                  <option value="">Select a piece</option>
                  {PRODUCTS.map((p) => (
                    <option key={p} value={p}>
                      {p.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs tracking-[0.2em] text-subtle">ORDER NUMBER</span>
                <input
                  type="text"
                  value={form.orderNumber}
                  onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))}
                  className="border border-muted/40 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-secondary"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs tracking-[0.2em] text-subtle">STAR RATING</span>
              <RatingPicker value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-[0.2em] text-subtle">REVIEW TITLE</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                className="border border-muted/40 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-secondary"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-[0.2em] text-subtle">YOUR REVIEW</span>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                required
                rows={4}
                className="border border-muted/40 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-secondary"
              />
            </label>

            <div className="flex flex-col gap-3">
              <span className="text-xs tracking-[0.2em] text-subtle">TAGS (OPTIONAL)</span>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => {
                  const active = form.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`flex items-center gap-1.5 border px-3 py-2 text-xs tracking-[0.1em] transition-colors duration-300 ${
                        active
                          ? "border-secondary bg-secondary text-[#EFEDE8]"
                          : "border-muted/40 text-subtle hover:border-[#EFEDE8]/50 hover:text-[#EFEDE8]"
                      }`}
                    >
                      {active && <Check strokeWidth={2} className="h-3 w-3" />}
                      {tag.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                type="submit"
                className="group inline-flex items-center gap-3 border border-[#EFEDE8]/70 px-8 py-4 text-sm tracking-[0.2em] transition-colors duration-300 hover:border-secondary hover:bg-secondary"
              >
                SUBMIT REVIEW
                <ArrowRight
                  strokeWidth={1.5}
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
              {submitted && (
                <span className="text-xs tracking-[0.15em] text-secondary">
                  REVIEW PUBLISHED. THANK YOU.
                </span>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}