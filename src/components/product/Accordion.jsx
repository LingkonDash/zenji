"use client";

import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const containerRef = useRef(null);
  const bodyRef = useRef(null);
  const innerRef = useRef(null);

  useGSAP(
    () => {
      const body = bodyRef.current;
      const inner = innerRef.current;
      if (!body || !inner) return;

      const targetHeight = open ? inner.offsetHeight : 0;

      gsap.to(body, {
        height: targetHeight,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          // Keep height set to auto when open so dynamic content resizes smoothly
          if (open) {
            gsap.set(body, { height: "auto" });
          }
        },
      });
    },
    { dependencies: [open], scope: containerRef }
  );

  return (
    <div ref={containerRef} className="border-t border-white/10">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between py-4 text-left transition-colors hover:text-white"
      >
        <span className="font-sans text-xs font-bold tracking-[0.15em] text-white">
          {title}
        </span>
        <span className="flex h-6 w-6 cursor-pointer items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white">
          {open ? <Minus size={13} /> : <Plus size={13} />}
        </span>
      </button>

      <div
        ref={bodyRef}
        className="overflow-hidden"
        style={{ height: defaultOpen ? "auto" : 0 }}
      >
        <div ref={innerRef} className="pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}
