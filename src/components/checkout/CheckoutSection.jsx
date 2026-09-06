"use client";

import React from "react";

export default function CheckoutSection({ index, title, icon: Icon, children }) {
  return (
    <section className="checkout-anim-item relative border border-muted/30 bg-white/[0.015] p-6 transition-colors duration-300 hover:border-muted/50 md:p-8">
      {/* Watermark numeral */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 right-4 select-none font-anton text-6xl leading-none text-white/[0.03] md:text-7xl"
      >
        {index}
      </span>

      <div className="relative mb-6 flex items-center justify-between border-b border-muted/30 pb-4">
        <h2 className="flex items-center gap-3 font-sans text-sm font-bold uppercase tracking-[0.15em] text-white md:text-base">
          <span className="border border-secondary/40 bg-secondary/10 px-2 py-0.5 font-anton text-xs text-secondary">
            {index}
          </span>
          {title}
        </h2>
        {Icon ? <Icon className="h-5 w-5 text-muted" strokeWidth={1.5} /> : null}
      </div>

      <div className="relative space-y-4">{children}</div>
    </section>
  );
}