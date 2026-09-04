"use client";

import React from "react";

export function CollectionGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="relative w-full h-[480px] flex flex-col justify-between bg-[#0B0404] border border-white/10 overflow-hidden animate-pulse"
        >
          {/* Badge Skeleton */}
          <div className="absolute top-4 left-4 z-20 h-6 w-20 bg-white/10" />

          {/* Image Placeholder Skeleton */}
          <div className="w-full h-[60%] bg-white/5 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0404] to-transparent opacity-60" />
          </div>

          {/* Content Footer Skeleton */}
          <div className="p-5 md:p-6 flex flex-col justify-between flex-grow bg-[#0B0404]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-6 w-36 bg-white/10" />
                <div className="h-8 w-8 bg-white/10" />
              </div>
              <div className="h-4 w-full bg-white/5" />
              <div className="h-4 w-2/3 bg-white/5" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
              <div className="h-6 w-20 bg-white/10" />
              <div className="h-4 w-16 bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
