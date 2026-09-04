"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function WaitlistSection() {
  const sectionRef = useRef(null);
  const revealRefs = useRef([]);
  revealRefs.current = [];
  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | error | success

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(revealRefs.current, { opacity: 0, y: 20 });
    }, sectionRef);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(revealRefs.current, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setStatus("error");
      return;
    }
    setStatus("success");
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-[var(--color-subtle)]/20 bg-[var(--color-primary)] px-6 py-24 sm:py-32"
    >
      <div className="relative mx-auto flex max-w-xl flex-col items-center text-center">
        <p
          ref={addRevealRef}
          className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-[var(--color-secondary)]"
        >
          get early access
        </p>

        <h2
          ref={addRevealRef}
          className="font-anton text-4xl uppercase tracking-wider text-white sm:text-5xl"
        >
          Join the waitlist.
        </h2>

        <p
          ref={addRevealRef}
          className="mt-5 max-w-md font-sans text-sm leading-relaxed text-[var(--color-subtle)]"
        >
          Be first to shop Awakening. Exclusive early access and a pre-drop
          discount for waitlist members.
        </p>

        {status === "success" ? (
          <div
            ref={addRevealRef}
            className="mt-8 w-full border border-[var(--color-secondary)]/60 bg-[var(--color-secondary)]/10 px-6 py-4 font-sans text-sm tracking-wide text-white"
          >
            you&rsquo;re on the list — watch your inbox.
          </div>
        ) : (
          <form
            ref={addRevealRef}
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:gap-0"
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="your email address"
              className="w-full border border-[var(--color-subtle)]/30 bg-black/40 px-5 py-4 font-sans text-sm text-white placeholder:text-[var(--color-subtle)]/60 focus:border-[var(--color-secondary)] focus:outline-none transition-colors sm:flex-1"
            />
            <button
              type="submit"
              className="whitespace-nowrap border border-[var(--color-secondary)] bg-[var(--color-secondary)] px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-transparent hover:text-white hover:shadow-[0_0_20px_rgba(188,1,0,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              join the waitlist →
            </button>
          </form>
        )}

        {status === "error" && (
          <p
            className="mt-3 font-sans text-xs tracking-wider text-[var(--color-secondary)]"
            role="alert"
          >
            enter a valid email address.
          </p>
        )}
      </div>
    </section>
  );
}