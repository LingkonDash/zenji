"use client";

import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef(null);
  const innerRef = useRef(null);

  useGSAP(() => {
    const body = bodyRef.current;
    const inner = innerRef.current;
    if (!body || !inner) return;

    gsap.to(body, {
      height: open ? inner.offsetHeight : 0,
      duration: 0.35,
      ease: "power2.inOut",
    });
  }, [open]);

  return (
    <div className="border-t border-white/10">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-sans text-xs tracking-[0.15em] text-white">
          {title}
        </span>
        <span className="flex h-6 w-6 items-center justify-center border border-white/20 text-white/70">
          {open ? <Minus size={13} /> : <Plus size={13} />}
        </span>
      </button>
      <div ref={bodyRef} className="overflow-hidden" style={{ height: open ? "auto" : 0 }}>
        <div ref={innerRef} className="pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}
