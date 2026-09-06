"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function OrderSuccessModal({ order, onClose, formatCurrency }) {
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const iconRef = useRef(null);

  useGSAP(() => {
    if (!order) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([backdropRef.current, panelRef.current, iconRef.current], {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    )
      .fromTo(
        panelRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
        "-=0.15"
      )
      .fromTo(
        iconRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
        "-=0.2"
      );
  }, [order]);

  if (!order) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-lg border border-secondary/60 bg-primary p-6 md:p-8"
      >
        <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />

        <div className="relative z-10 space-y-4 text-center">
          <div
            ref={iconRef}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-secondary bg-secondary/15 text-secondary"
          >
            <Sparkles className="h-8 w-8" />
          </div>

          <div>
            <span className="mb-1 block font-sans text-xs uppercase tracking-[0.2em] text-secondary">
              Order Verified // {order.orderId}
            </span>
            <h3
              id="order-success-title"
              className="font-anton text-2xl uppercase tracking-tight text-white md:text-3xl"
            >
              Welcome to the Arc<span className="text-secondary">.</span>
            </h3>
          </div>

          <p className="px-2 font-sans text-xs leading-relaxed text-subtle">
            Your resolve has been sealed into the ledger. You&rsquo;re now part of
            ZENJI&rsquo;s limited drop legacy.
          </p>

          <div className="space-y-2 border border-muted/30 bg-white/[0.02] p-4 text-left font-sans text-xs">
            <div className="flex justify-between border-b border-muted/20 pb-2">
              <span className="uppercase text-muted">Customer</span>
              <span className="font-bold text-white">{order.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-muted/20 pb-2">
              <span className="uppercase text-muted">Confirmation email</span>
              <span className="font-bold text-white">{order.email}</span>
            </div>
            <div className="flex justify-between border-b border-muted/20 pb-2">
              <span className="uppercase text-muted">Items acquired</span>
              <span className="font-bold text-secondary">
                {order.items.reduce((sum, item) => sum + (item.qty || 1), 0)} pieces
              </span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase text-muted">Total settled</span>
              <span className="font-bold text-white">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <Link
            href="/collection"
            onClick={onClose}
            className="flex items-center justify-center gap-2 border border-secondary bg-secondary py-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-secondary/85"
          >
            Return to base / continue exploring
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}