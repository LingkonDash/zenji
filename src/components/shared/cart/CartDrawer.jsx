"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import {
  getCart,
  updateCartQty,
  removeFromCart,
  onStoreChange,
} from "@/lib/cartStore";

const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING_FEE = 9.99;

function parsePriceNumber(price) {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const cleaned = String(price).replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

function formatCurrency(amount) {
  return `A$${amount.toFixed(2)}`;
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const drawerRef = useRef(null);
  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const itemsContainerRef = useRef(null);
  const hasOpenedRef = useRef(false);

  const syncItems = useCallback(() => {
    setCartItems(getCart());
  }, []);

  useEffect(() => {
    syncItems();
    return onStoreChange(syncItems);
  }, [syncItems]);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    window.addEventListener("cart-drawer-open", handleOpen);
    window.addEventListener("cart-drawer-close", handleClose);

    return () => {
      window.removeEventListener("cart-drawer-open", handleOpen);
      window.removeEventListener("cart-drawer-close", handleClose);
    };
  }, []);

  useLayoutEffect(() => {
    const drawer = drawerRef.current;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;

    if (!drawer || !panel || !backdrop) return;

    const isMobile = window.innerWidth < 768;
    const startXPercent = isMobile ? -100 : 100;

    const ctx = gsap.context(() => {
      if (open) {
        hasOpenedRef.current = true;
        gsap.set(drawer, { display: "block" });

        const tl = gsap.timeline();
        tl.fromTo(
          backdrop,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" }
        ).fromTo(
          panel,
          { xPercent: startXPercent },
          { xPercent: 0, duration: 0.5, ease: "power3.out" },
          "-=0.25"
        );

        if (itemsContainerRef.current?.children) {
          tl.fromTo(
            Array.from(itemsContainerRef.current.children),
            { autoAlpha: 0, y: 15 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.35,
              stagger: 0.05,
              ease: "power2.out",
            },
            "-=0.2"
          );
        }

        document.body.style.overflow = "hidden";
      } else if (hasOpenedRef.current) {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(drawer, { display: "none" });
          },
        });

        tl.to(panel, {
          xPercent: startXPercent,
          duration: 0.4,
          ease: "power3.in",
        }).to(
          backdrop,
          { opacity: 0, duration: 0.3, ease: "power2.in" },
          "-=0.2"
        );

        document.body.style.overflow = "";
      }
    });

    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const totalCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  const subtotal = cartItems.reduce((sum, item) => {
    const p = parsePriceNumber(item.price);
    return sum + p * (item.qty || 1);
  }, 0);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = cartItems.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const awayAmount = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const total = subtotal + shippingFee;

  return (
    <div
      ref={drawerRef}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-[100] hidden"
      style={{ display: "none" }}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer opacity-0"
      />

      {/* Drawer Panel */}
      <div
        ref={panelRef}
        className="absolute top-0 bottom-0 w-full max-w-[460px] bg-[#070303] border-white/10 flex flex-col justify-between z-10 left-0 border-r md:left-auto md:right-0 md:border-r-0 md:border-l ring-1 ring-white/[0.06]"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-anton text-2xl tracking-wider uppercase text-white">
              YOUR CART
            </h2>
            <span className="flex h-5 w-5 items-center justify-center bg-secondary font-mono text-[11px] font-bold text-white">
              {totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-all duration-200 hover:border-white/40 hover:text-white active:scale-90 active:border-white/60"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Cart Item List */}
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
        >
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag className="w-12 h-12 text-white/20 mb-3" strokeWidth={1} />
              <p className="font-mono text-sm uppercase text-subtle tracking-widest mb-4">
                YOUR CART IS EMPTY
              </p>
              <Link
                href="/collection"
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 bg-secondary text-white font-mono text-xs uppercase font-bold tracking-wider transition-all duration-200 hover:bg-red-700 active:scale-95"
              >
                SHOP COLLECTION
              </Link>
            </div>
          ) : (
            <div ref={itemsContainerRef} className="space-y-4">
              {cartItems.map((item) => {
                const itemPriceNum = parsePriceNumber(item.price);
                const origPriceNum = parsePriceNumber(item.originalPrice);
                const hasDiscount = origPriceNum > itemPriceNum;

                return (
                  <div
                    key={item.id}
                    className="relative border border-white/10 bg-black/60 p-4 flex gap-4 transition-colors duration-200 hover:border-white/20"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 shrink-0 bg-zinc-900 overflow-hidden border border-white/10">
                      <Image
                        src={item.bgImage || item.posterImage || item.image}
                        alt={item.title || "Product"}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Info & Controls */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-white line-clamp-1">
                            {item.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.title}`}
                            className="flex h-6 w-6 shrink-0 items-center justify-center border border-white/15 text-white/50 transition-all duration-200 hover:border-secondary/60 hover:text-secondary active:scale-90"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">
                            SIZE {item.selectedSize || "S"}
                          </span>
                          <span className="border border-secondary/60 bg-secondary/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-secondary uppercase tracking-widest">
                            LIVE
                          </span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-3">
                        {/* Quantity Controller */}
                        <div className="flex items-center border border-white/15 bg-black">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, (item.qty || 1) - 1)}
                            className="flex h-7 w-7 items-center justify-center text-white/60 transition-colors duration-150 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.15]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center font-mono text-xs font-bold text-white">
                            {item.qty || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, (item.qty || 1) + 1)}
                            className="flex h-7 w-7 items-center justify-center text-white/60 transition-colors duration-150 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.15]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right font-mono">
                          {hasDiscount && (
                            <span className="text-xs text-subtle line-through mr-2">
                              {formatCurrency(origPriceNum)}
                            </span>
                          )}
                          <span className="text-sm font-bold text-white">
                            {formatCurrency(itemPriceNum * (item.qty || 1))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary & Actions — hidden entirely when cart is empty */}
        {cartItems.length > 0 && (
          <div className="border-t border-white/10 bg-black/90 p-6 space-y-4 shrink-0">
            {/* Free Shipping Progress */}
            <div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-none overflow-hidden relative mb-2">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                {isFreeShipping ? (
                  <span className="text-amber-400 font-bold">
                    ★ UNLOCKED FREE SHIPPING!
                  </span>
                ) : (
                  <span>
                    <strong className="text-amber-400 font-normal">
                      {formatCurrency(awayAmount)}
                    </strong>{" "}
                    AWAY FROM FREE SHIPPING
                  </span>
                )}
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 border-t border-white/5 pt-3 font-mono text-xs">
              <div className="flex justify-between text-subtle tracking-wider">
                <span>SUBTOTAL</span>
                <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-subtle tracking-wider">
                <span>SHIPPING</span>
                <span className="text-white font-medium">
                  {isFreeShipping ? "FREE" : formatCurrency(shippingFee)}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
              <span className="font-mono text-sm tracking-widest uppercase text-white font-bold">
                TOTAL
              </span>
              <span className="font-anton text-3xl tracking-wider text-white">
                {formatCurrency(total)}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 bg-secondary py-3.5 font-anton text-lg tracking-widest text-white uppercase border border-secondary transition-all duration-200 hover:bg-transparent hover:text-secondary active:scale-[0.98]"
              >
                <span>CHECKOUT</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full border border-white/25 bg-transparent py-3 font-anton text-sm tracking-widest text-white uppercase transition-all duration-200 hover:border-white/60 hover:bg-white/[0.04] active:scale-[0.98]"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}