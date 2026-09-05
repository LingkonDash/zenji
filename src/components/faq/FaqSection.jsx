"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Truck,
  PackageSearch,
  Shirt,
  RotateCcw,
  Info,
  Plus,
  Mail,
} from "lucide-react";

import zenjiFull from "@/images/zenji-full-outlook.png";
import zenjiMark from "@/images/zenji-outlook.png";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FAQ_DATA = [
  {
    id: "orders-shipping",
    title: "Orders & Shipping",
    icon: Truck,
    items: [
      {
        q: "Do you ship Australia-wide?",
        a: "Yes. Free shipping on all orders over A$100, otherwise a flat A$9.99. Standard delivery is 5-10 business days.",
      },
      {
        q: "Do you ship internationally?",
        a: "Not yet. Australia only for now — international drops are coming in Season 03.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Orders are final once placed. No changes, no cancellations — every drop is limited.",
      },
      {
        q: "How do I track my order?",
        a: "A tracking link is sent via email once your order is dispatched. Check spam if it hasn't landed.",
      },
    ],
  },
  {
    id: "stock-drops",
    title: "Stock & Drops",
    icon: PackageSearch,
    items: [
      {
        q: "When does my order ship?",
        a: "Every piece is in stock and ships now. Standard delivery is 5-10 business days.",
      },
      {
        q: "Will sold-out pieces restock?",
        a: "No restocks. Ever. Once a piece is gone, it's gone.",
      },
      {
        q: "How long does a sale run?",
        a: "Until the discounted pieces sell through. There are no restocks, so the sale ends with the stock.",
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    icon: Shirt,
    items: [
      {
        q: "What sizes do you offer?",
        a: "XS / S / M / L / XL / XXL. Oversized fit — size down if you're unsure.",
      },
      {
        q: "Are the designs limited?",
        a: "Every piece is limited. No restocks. Once it's gone, it's gone.",
      },
      {
        q: "How do I care for my ZENJI tee?",
        a: "Cold wash inside out. No tumble dry — hang dry only. Iron inside out on low heat.",
      },
      {
        q: "What material are the tees?",
        a: "100% heavyweight cotton, 240gsm, cut for an oversized streetwear fit.",
      },
    ],
  },
  {
    id: "returns-refunds",
    title: "Returns & Refunds",
    icon: RotateCcw,
    items: [
      {
        q: "Do you accept returns?",
        a: "We accept returns on unworn, unwashed items within 14 days of delivery. Sale items are final sale — no change-of-mind returns.",
      },
      {
        q: "My item arrived damaged — what do I do?",
        a: "Email support@zenji.shop with your order number and a photo. We'll sort it.",
      },
      {
        q: "How long do refunds take?",
        a: "5-10 business days after we receive the returned item.",
      },
    ],
  },
  {
    id: "brand",
    title: "Brand",
    icon: Info,
    items: [
      {
        q: "What is ZENJI?",
        a: "ZENJI is an Australian anime-inspired streetwear brand founded in 2024, creating limited-edition graphic tees inspired by Japanese culture, samurai discipline and anime art.",
      },
      {
        q: "What anime series does ZENJI draw inspiration from?",
        a: "Japanese culture, samurai tradition and modern anime art. The Origin Drop includes designs like Blue Flame, Bushido, Demon Blood, Domain Expansion, Water Breathing and Limitless.",
      },
      {
        q: "How much do ZENJI products cost?",
        a: "ZENJI tees are A$39.99, with selected pieces on sale at A$33.99. Free shipping on orders over A$100.",
      },
      {
        q: "Where is ZENJI based?",
        a: "Australia. Built for those who wear their story.",
      },
      {
        q: "How do I stay updated on new drops?",
        a: "Follow @zenji_.shop on Instagram and TikTok, or join the waitlist on the Drop page.",
      },
      {
        q: "Can I collaborate with ZENJI?",
        a: "Email us at collabs@zenji.shop.",
      },
    ],
  },
];

function AccordionItem({ id, q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-muted/25">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-6 py-6 text-left"
      >
        <span className="text-base leading-snug md:text-lg">{q}</span>
        <Plus
          strokeWidth={1.5}
          className={`mt-1 h-4 w-4 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-45 text-secondary" : "text-subtle"
          }`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 text-sm leading-relaxed text-subtle">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const root = useRef(null);
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const [openItems, setOpenItems] = useState(() => new Set(["orders-shipping-0"]));
  const [activeCategory, setActiveCategory] = useState(FAQ_DATA[0].id);

  const toggle = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const scrollToCategory = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      // single hero entrance — no repeating motion after this
      gsap.fromTo(
        ".faq-hero-el",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }
      );

      gsap.fromTo(
        ".faq-nav-chip",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out", delay: 0.3 }
      );

      // each category block settles into place once, as it enters
      gsap.utils.toArray(".faq-category").forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: block, start: "top 85%" },
          }
        );
      });

      // track which category is in view to highlight the quick-nav
      FAQ_DATA.forEach(({ id }) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setActiveCategory(id),
          onEnterBack: () => setActiveCategory(id),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="relative overflow-hidden bg-primary font-sans text-[#EFEDE8]">
      {/* stable, low-opacity wordmark backdrop — fixed, no drift */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-[0.05]"
      >
        <div className="relative h-[90vh] w-[95vw] md:h-[80vh] md:w-[60vw]">
          <Image src={zenjiFull} alt="" fill priority className="object-contain brightness-0 invert" sizes="100vw" />
        </div>
      </div>

      {/* film grain */}
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
        <section ref={heroRef} className="relative border-b border-muted/25 px-6 pt-28 pb-16 md:px-16 md:pt-36 md:pb-20">
          <div className="faq-hero-el mb-6 flex items-center gap-3">
            <span className="relative block h-7 w-7 shrink-0">
              <Image src={zenjiMark} alt="ZENJI mark" fill className="object-contain brightness-0 invert" />
            </span>
            <p className="text-xs tracking-[0.3em] text-subtle">SUPPORT // ZENJI</p>
          </div>

          <h1 className="faq-hero-el font-anton max-w-3xl text-[15vw] leading-[0.9] tracking-tight md:text-[5.5vw]">
            FAQ
          </h1>
          <p className="faq-hero-el mt-6 max-w-md text-sm leading-relaxed text-subtle">
            Everything you need to know about orders, drops, sizing and returns.
          </p>
        </section>

        {/* ---------------- QUICK NAV ---------------- */}
        <nav
          ref={navRef}
          className="sticky top-0 z-20 flex gap-px overflow-x-auto border-b border-muted/25 bg-primary/95 px-6 backdrop-blur-sm md:px-16"
        >
          {FAQ_DATA.map(({ id, title, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToCategory(id)}
              className={`faq-nav-chip flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-xs tracking-[0.15em] whitespace-nowrap transition-colors duration-300 ${
                activeCategory === id
                  ? "border-secondary text-[#EFEDE8]"
                  : "border-transparent text-subtle hover:text-[#EFEDE8]"
              }`}
            >
              <Icon strokeWidth={1.5} className="h-3.5 w-3.5" />
              {title.toUpperCase()}
            </button>
          ))}
        </nav>

        {/* ---------------- CATEGORIES ---------------- */}
        <div className="relative">
          {FAQ_DATA.map(({ id, title, icon: Icon, items }) => (
            <section
              key={id}
              id={id}
              className="faq-category border-b border-muted/25 px-6 py-20 md:px-16"
            >
              <div className="mb-10 flex items-center gap-3">
                <Icon strokeWidth={1.5} className="h-5 w-5 text-secondary" />
                <h2 className="font-anton text-2xl tracking-tight md:text-3xl">{title}</h2>
              </div>
              <div className="max-w-3xl">
                {items.map((item, i) => {
                  const itemId = `${id}-${i}`;
                  return (
                    <AccordionItem
                      key={itemId}
                      id={itemId}
                      q={item.q}
                      a={item.a}
                      isOpen={openItems.has(itemId)}
                      onToggle={toggle}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* ---------------- STILL HAVE QUESTIONS ---------------- */}
        <section className="relative flex flex-col items-start gap-8 px-6 py-24 md:px-16">
          <h2 className="font-anton max-w-xl text-[9vw] leading-[0.95] md:text-[3.2vw]">
            STILL HAVE QUESTIONS?
          </h2>
          <a
            href="mailto:support@zenji.shop"
            className="group inline-flex items-center gap-3 border border-[#EFEDE8]/70 px-8 py-4 text-sm tracking-[0.2em] transition-colors duration-300 hover:border-secondary hover:bg-secondary"
          >
            <Mail strokeWidth={1.5} className="h-4 w-4" />
            EMAIL US AT SUPPORT@ZENJI.SHOP
          </a>
        </section>
      </div>
    </main>
  );
}