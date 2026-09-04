"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Formats a collection name string like "THE_ORIGIN_DROP" → "The Origin Drop"
 */
function formatCollectionName(collection) {
  if (!collection) return "";
  return collection
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Reusable ProductCard component.
 *
 * @param {Object}  props
 * @param {Object}  props.product        - Product data object
 * @param {number}  props.index          - Zero-based card index (for the counter pill)
 * @param {string}  [props.href]         - Override link href. Defaults to `/drop/${product.id}`
 */
export default function ProductCard({ product, index = 0, href }) {
  const onSale =
    product.originalPrice && product.originalPrice !== product.price;

  const linkHref = href ?? `/drop/${product.id}`;

  return (
    <Link
      href={linkHref}
      className="group relative shrink-0 w-[280px] sm:w-[340px] md:w-[380px] snap-start border border-white/10 bg-zinc-950/80 hover:border-secondary transition-all duration-500 block z-10"
    >
      {/* Dynamic Image Canvas */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-900">
        <Image
          src={product.bgImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 380px"
          className="object-cover object-center md:grayscale md:contrast-125 md:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Index Counter Pill */}
        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white tracking-widest uppercase">
          0{index + 1} // LTD
        </div>

        {/* Quick Action Overlay Tag */}
        <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="font-mono text-[10px] uppercase tracking-widest bg-secondary text-black font-bold px-3 py-1.5 shadow-lg">
            VIEW DROP →
          </span>
        </div>
      </div>

      {/* Product Metadata Footer */}
      <div className="p-5 border-t border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] text-secondary uppercase tracking-widest">
            {formatCollectionName(product.collection)}
          </p>
          <span className="font-mono text-[10px] text-white/40 uppercase">
            IN STOCK
          </span>
        </div>

        <h3 className="font-anton uppercase text-white text-xl sm:text-2xl mt-1 tracking-wide group-hover:text-secondary transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-mono text-base font-bold ${
                onSale ? "text-secondary" : "text-white"
              }`}
            >
              {product.price}
            </span>
            {onSale && (
              <span className="font-mono text-xs text-white/40 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>

          <span className="font-mono text-[11px] text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">
            GET PIECE
          </span>
        </div>
      </div>
    </Link>
  );
}
