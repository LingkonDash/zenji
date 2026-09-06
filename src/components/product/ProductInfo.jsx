"use client";

import { useRef, useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
import Accordion from "./Accordion";

export default function ProductInfo({ product }) {
  const sizes = product.sizes ?? [];
  const [selectedSize, setSelectedSize] = useState(
    sizes.find((size) => size.inStock)?.label ?? null
  );
  const infoRef = useRef(null);

  return (
    <div ref={infoRef} data-info-panel className="relative">
      {/* Grounded, subtle brand mark — not decoration, it's the drop's own motif */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-6 select-none font-anton text-[9rem] leading-none text-white/[0.03] sm:text-[12rem]"
      >
        血
      </span>

      <p data-crumb className="font-sans text-[11px] tracking-[0.15em] text-muted">
        DROP / {product.collection?.replaceAll("_", " ")}
      </p>

      <h1 data-title className="mt-2 font-anton text-4xl leading-[0.95] text-white sm:text-5xl">
        {product.title}
      </h1>

      {product.colorway && (
        <p className="mt-3 font-sans text-[11px] tracking-[0.15em] text-muted">
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
            product.inStock ? "bg-emerald-400" : "bg-subtle"
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
                  className={`flex h-11 min-w-[2.75rem] items-center justify-center border px-3 font-sans text-xs transition-colors ${
                    !size.inStock
                      ? "border-white/10 text-subtle line-through decoration-subtle"
                      : isSelected
                      ? "border-secondary bg-secondary text-white"
                      : "border-white/20 text-white hover:border-white/40"
                  }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Buttons intentionally inert for now — wired up later */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="flex h-14 flex-1 items-center justify-center gap-2 border border-white/20 font-sans text-xs tracking-[0.1em] text-white transition-colors hover:border-white/40"
        >
          <Heart size={16} />
          WISHLIST
        </button>
        <button
          type="button"
          className="flex h-14 flex-[2] items-center justify-center gap-2 bg-secondary font-sans text-xs tracking-[0.1em] text-white transition-opacity hover:opacity-90"
        >
          ADD TO CART
          <ArrowRight size={16} />
        </button>
      </div>

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
                      <td className="border-b border-white/5 py-2 pr-4 text-secondary">
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
