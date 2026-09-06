"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Heart, ArrowRight, Trash2, X, ShoppingCart } from "lucide-react";
import Accordion from "./Accordion";
import { addToCart, toggleWishlist, openCart } from "@/lib/cartStore";
import { useIsWishlisted } from "@/lib/useCartStore";
import zenjiLogo from "@/images/zenji-outlook.png";
import Image from "next/image";

export default function ProductInfo({ product }) {
  const sizes = product.sizes ?? [];
  const [selectedSize, setSelectedSize] = useState(
    sizes.find((size) => size.inStock)?.label ?? null
  );
  const infoRef = useRef(null);
  const wishlisted = useIsWishlisted(product?.id);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleWishlistClick = () => {
    if (wishlisted) {
      setShowConfirmModal(true);
    } else {
      toggleWishlist(product);
    }
  };

  const handleConfirmRemove = () => {
    setShowConfirmModal(false);
    toggleWishlist(product);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <div ref={infoRef} data-info-panel className="relative w-full">
      {/* Grounded, subtle brand mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-6 h-40 w-40 select-none sm:-right-6 sm:-top-8 sm:h-56 sm:w-56"
      >
        <Image
          src={zenjiLogo}
          alt=""
          fill
          className="object-contain brightness-0 invert opacity-[0.03]"
        />
      </div>

      <p data-crumb className="font-sans text-[11px] tracking-[0.15em] text-muted">
        DROP / {product.collection?.replaceAll("_", " ")}
      </p>

      <h1 data-title className="mt-2 font-anton text-4xl leading-[0.95] text-white sm:text-5xl uppercase">
        {product.title}
      </h1>

      {product.colorway && (
        <p className="mt-3 font-sans text-[11px] tracking-[0.15em] text-muted uppercase">
          COLORWAY / {product.colorway.toUpperCase()}
        </p>
      )}

      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-anton text-3xl text-secondary">{product.price}</span>
        {product.originalPrice && product.originalPrice !== product.price && (
          <span className="font-sans text-sm text-subtle line-through">
            {product.originalPrice}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            product.inStock ? "bg-emerald-500" : "bg-subtle"
          }`}
        />
        <span className="font-sans text-[11px] tracking-[0.1em] text-muted">
          {product.inStock ? "IN STOCK" : "SOLD OUT"}
        </span>
      </div>

      {sizes.length > 0 && (
        <div className="mt-8">
          <p className="font-sans text-[11px] tracking-[0.15em] text-muted">
            SELECT SIZE
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size.label;
              return (
                <button
                  key={size.label}
                  type="button"
                  disabled={!size.inStock}
                  onClick={() => setSelectedSize(size.label)}
                  aria-pressed={isSelected}
                  className={`flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center border px-3.5 py-2 font-sans text-xs transition-all duration-200 ${
                    !size.inStock
                      ? "cursor-not-allowed border-white/10 text-subtle line-through decoration-subtle opacity-50"
                      : isSelected
                      ? "cursor-pointer border-secondary bg-secondary text-white font-bold"
                      : "cursor-pointer border-white/20 text-white hover:border-white/50 hover:bg-white/5 active:scale-95"
                  }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Responsive Primary Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleToggleWishlistClick}
          aria-pressed={wishlisted}
          className={`flex min-h-[3.25rem] sm:min-h-[3.5rem] w-full sm:flex-1 cursor-pointer items-center justify-center gap-2 border px-4 py-3 font-sans text-xs font-bold tracking-[0.1em] transition-all duration-200 active:scale-[0.98] ${
            wishlisted
              ? "border-secondary/80 bg-secondary/15 text-white hover:border-secondary hover:bg-secondary/25"
              : "border-white/20 text-white hover:border-white/50 hover:bg-white/[0.04]"
          }`}
        >
          <Heart
            size={16}
            fill={wishlisted ? "currentColor" : "none"}
            className={`shrink-0 ${wishlisted ? "text-secondary" : ""}`}
          />
          <span className="whitespace-nowrap">{wishlisted ? "WISHLISTED" : "WISHLIST"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            addToCart({ ...product, selectedSize });
            openCart();
          }}
          disabled={!product.inStock}
          className="flex min-h-[3.25rem] sm:min-h-[3.5rem] w-full sm:flex-[2] cursor-pointer items-center justify-center gap-2 border border-secondary bg-secondary px-4 py-3 font-sans text-xs font-bold tracking-[0.1em] text-white transition-all duration-200 hover:bg-white hover:border-white hover:text-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-transparent disabled:text-subtle disabled:hover:bg-transparent disabled:hover:text-subtle"
        >
          {product.inStock ? (
            <>
              <ShoppingCart size={16} className="shrink-0" />
              <span className="whitespace-nowrap">ADD TO CART</span>
              <ArrowRight size={16} className="shrink-0" />
            </>
          ) : (
            <span className="whitespace-nowrap">SOLD OUT</span>
          )}
        </button>
      </div>

      {/* Remove Confirmation Modal */}
      {showConfirmModal &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={handleCancel}
          >
            <div
              className="relative w-full max-w-sm border border-white/10 bg-primary p-5 sm:p-6 ring-1 ring-white/10 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleCancel}
                aria-label="Close"
                className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center text-white/40 transition-all duration-200 hover:text-white active:scale-90"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-3 pr-8">
                <div className="p-2 bg-secondary/10 border border-secondary/30 text-secondary shrink-0">
                  <Trash2 size={18} />
                </div>
                <h4 className="font-anton text-lg uppercase tracking-wider text-white">
                  REMOVE ITEM?
                </h4>
              </div>

              <p className="font-sans text-xs text-subtle mb-6 leading-relaxed">
                Are you sure you want to remove this item from your loadout?
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cursor-pointer border border-white/15 px-4 py-2.5 font-sans text-[11px] uppercase tracking-wider text-white/70 transition-all duration-200 hover:border-white/40 hover:text-white active:scale-95"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRemove}
                  className="cursor-pointer border border-secondary bg-secondary px-4 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-transparent hover:text-secondary active:scale-95"
                >
                  REMOVE
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {product.description && (
        <p className="mt-8 max-w-[46ch] font-sans text-sm leading-relaxed text-white/70">
          {product.description}
        </p>
      )}

      <div className="mt-8">
        {product.fabricNotes?.length > 0 && (
          <Accordion title="PRODUCT DETAILS" defaultOpen>
            <ul className="space-y-1.5">
              {product.fabricNotes.map((note) => (
                <li key={note} className="font-sans text-sm text-white/60">
                  {note}
                </li>
              ))}
            </ul>
          </Accordion>
        )}

        {product.sizeGuide?.length > 0 && (
          <Accordion title="SIZE GUIDE">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse font-sans text-xs">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="border-b border-white/10 py-2 pr-4 font-normal tracking-[0.1em]">
                      SIZE
                    </th>
                    <th className="border-b border-white/10 py-2 pr-4 font-normal tracking-[0.1em]">
                      CHEST (CM)
                    </th>
                    <th className="border-b border-white/10 py-2 pr-4 font-normal tracking-[0.1em]">
                      LENGTH (CM)
                    </th>
                    <th className="border-b border-white/10 py-2 font-normal tracking-[0.1em]">
                      SHOULDER (CM)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.sizeGuide.map((row) => (
                    <tr key={row.size}>
                      <td className="border-b border-white/5 py-2 pr-4 text-secondary font-bold">
                        {row.size}
                      </td>
                      <td className="border-b border-white/5 py-2 pr-4 text-white/70">
                        {row.chest}
                      </td>
                      <td className="border-b border-white/5 py-2 pr-4 text-white/70">
                        {row.length}
                      </td>
                      <td className="border-b border-white/5 py-2 text-white/70">
                        {row.shoulder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-sans text-[11px] text-muted">
              Oversized fit — size down if between sizes. Garment measurements in cm.
            </p>
          </Accordion>
        )}

        {product.shippingNotes?.length > 0 && (
          <Accordion title="SHIPPING & RETURNS">
            <ul className="space-y-1.5">
              {product.shippingNotes.map((note) => (
                <li key={note} className="font-sans text-sm text-white/60">
                  {note}
                </li>
              ))}
            </ul>
          </Accordion>
        )}
      </div>

      {product.sku && (
        <p className="mt-6 border-t border-white/10 pt-4 font-sans text-[11px] tracking-[0.1em] text-subtle">
          SKU: {product.sku}
        </p>
      )}
    </div>
  );
}
