"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingCart } from "lucide-react";

/**
 * Reusable OriginDropCard component.
 *
 * @param {Object} props
 * @param {Object} props.item       - Product/drop item data object
 * @param {number} props.index      - Card index for badge display (0-indexed)
 * @param {number} props.totalCount - Total number of items in drop
 */
export default function OriginDropCard({ item, index = 0, totalCount = 1 }) {
  if (!item) return null;

  const isOnSale = item.price && item.originalPrice && item.price !== item.originalPrice;
  const imageSrc = item.posterImage || item.bgImage;

  return (
    <div className="group relative w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] h-[480px] md:h-[calc(100vh-220px)] max-h-[640px] flex-shrink-0 flex flex-col justify-between bg-[#0B0404] border border-white/10 hover:border-[#BC0100]/60 transition-all duration-500 rounded-none overflow-hidden shadow-2xl">
      {/* Badge Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <span className="px-3 py-1 bg-[#0B0404]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-white uppercase rounded-none">
          0{index + 1} / 0{totalCount}
        </span>
        {isOnSale && (
          <span className="px-3 py-1 bg-[#BC0100] text-white text-[10px] font-mono font-bold tracking-widest uppercase rounded-none animate-pulse">
            SALE
          </span>
        )}
      </div>

      {/* Artwork Container */}
      <div className="relative w-full h-[60%] md:h-[65%] overflow-hidden bg-gradient-to-b from-transparent to-[#0B0404]">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={item.title || "Drop Item"}
            fill
            sizes="(max-width: 768px) 320px, 380px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0404] via-transparent to-transparent opacity-90" />
      </div>

      {/* Content Footer */}
      <div className="p-5 md:p-6 flex flex-col justify-between flex-grow z-10 bg-[#0B0404]">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-anton text-xl md:text-2xl uppercase tracking-wide text-white group-hover:text-[#BC0100] transition-colors duration-300">
              {item.title}
            </h3>
            <Link
              href={`/drop/${item.id}`}
              className="p-2 rounded-none border border-white/10 hover:border-[#BC0100] hover:bg-[#BC0100] text-white transition-all duration-300"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          {item.description && (
            <p className="text-xs font-mono text-[#9D9D9D] line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-anton text-xl text-[#BC0100]">
              {item.price}
            </span>
            {isOnSale && (
              <span className="text-xs font-mono text-[#9D9D9D] line-through">
                {item.originalPrice}
              </span>
            )}
          </div>

          <Link
            href={`/drop/${item.id}`}
            className="flex items-center gap-1.5 text-xs font-mono uppercase font-semibold text-white hover:text-[#BC0100] transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>CLAIM</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
