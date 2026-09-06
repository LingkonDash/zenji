"use client";

/**
 * ZenjiIntro
 * -----------------------------------------------------------------------
 * A one-shot "big bang" anime-style loading intro for the ZENJI brand.
 * Sequence: singularity -> flash -> shockwave rings -> speed lines ->
 * logo draw-on -> wordmark slam -> aura pulse -> wipe-away exit.
 *
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const KATAKANA = ["ゼ", "ン", "ジ", "ア", "ウ", "ラ", "起", "動"];
const INTRO_SESSION_KEY = "zenji-intro-seen";

export default function ZenjiIntro({ onComplete, children }) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) !== "true";
  });
  const rootRef = useRef(null);
  const flashRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const linesWrapRef = useRef(null);
  const coreRef = useRef(null);
  const auraRef = useRef(null);
  const energyRingRef = useRef(null);
  const vignetteRef = useRef(null);
  const logoPath1Ref = useRef(null);
  const logoPath2Ref = useRef(null);
  const wordPathRef = useRef(null);
  const taglineRef = useRef(null);
  const counterRef = useRef(null);
  const percentSignRef = useRef(null);
  const overlayRef = useRef(null);
  const katakanaWrapRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;

    if (typeof window !== "undefined") {
      const seen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
      if (seen) {
        return;
      }
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      // Skip straight to a static branded frame (logo/wordmark are already
      // white via their default fill attributes), then clear it.
      if (counterRef.current) counterRef.current.textContent = "100";
      const t = setTimeout(() => {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
        }
        setIsVisible(false);
        gsap.set(root, { display: "none" });
        onComplete?.();
      }, 1200);
      return () => clearTimeout(t);
    }

    const ctx = gsap.context(() => {
      const logoPaths = [logoPath1Ref.current, logoPath2Ref.current];
      const wordPath = wordPathRef.current;
      const lineEls = linesWrapRef.current.querySelectorAll(".speed-line");
      const katakanaEls = katakanaWrapRef.current.querySelectorAll("span");

      // ---- prep: convert filled paths into "draw-on" strokes ----
      logoPaths.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
        p.style.stroke = "#BC0100";
        p.style.fill = "transparent";
      });
      const wLen = wordPath.getTotalLength();
      wordPath.style.strokeDasharray = String(wLen);
      wordPath.style.strokeDashoffset = String(wLen);
      wordPath.style.stroke = "#ffffff";
      wordPath.style.fill = "transparent";

      // ---- static centering, independent of scale animation ----
      gsap.set(
        [
          ring1Ref.current,
          ring2Ref.current,
          coreRef.current,
          auraRef.current,
          energyRingRef.current,
        ],
        {
          xPercent: -50,
          yPercent: -50,
        }
      );
      gsap.set(linesWrapRef.current, { xPercent: -50, yPercent: -50 });
      gsap.set(wordPath, { transformOrigin: "50% 50%" });

      // background glitch flicker on katakana
      katakanaEls.forEach((el, i) => {
        gsap.to(el, {
          opacity: gsap.utils.random(0.05, 0.28),
          duration: gsap.utils.random(0.6, 1.6),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.12,
        });
      });

      const counter = { val: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
          }
          setIsVisible(false);
          onComplete?.();
        },
      });

      tl
        // 0. cinematic vignette settles in behind everything
        .to(vignetteRef.current, { opacity: 1, duration: 0.5 }, 0)

        // 0. singularity
        .set(coreRef.current, { scale: 0, opacity: 1 })
        .to(coreRef.current, { scale: 1, duration: 0.55, ease: "power2.in" })

        // 1. big bang flash + camera shake
        .to(coreRef.current, { scale: 20, opacity: 0, duration: 0.7, ease: "expo.out" }, ">-0.08")
        .to(flashRef.current, { opacity: 1, duration: 0.12 }, "<")
        .to(flashRef.current, { opacity: 0, duration: 0.9, ease: "power2.out" }, ">")
        .to(root, { x: 6, duration: 0.06, repeat: 7, yoyo: true, ease: "none" }, "<")
        .set(root, { x: 0 })

        // 2. shockwave rings
        .fromTo(
          ring1Ref.current,
          { scale: 0, opacity: 0.9 },
          { scale: 6, opacity: 0, duration: 1.5, ease: "power2.out" },
          "<"
        )
        .fromTo(
          ring2Ref.current,
          { scale: 0, opacity: 0.6 },
          { scale: 9.5, opacity: 0, duration: 1.8, ease: "power2.out" },
          "<0.1"
        )

        // 3. anime speed lines bursting outward
        .fromTo(
          lineEls,
          { scaleX: 0, opacity: 1 },
          {
            scaleX: 1,
            opacity: 0,
            duration: 0.9,
            stagger: { each: 0.025, from: "center" },
            ease: "power4.out",
          },
          "<0.1"
        )

        // 4. logo mark draws on, then solidifies
        .to(logoPaths, { strokeDashoffset: 0, duration: 1.05, stagger: 0.2, ease: "power2.inOut" }, "-=0.7")
        .to(logoPaths, { fill: "#ffffff", stroke: "rgba(255,255,255,0)", duration: 0.45 }, ">-0.1")
        .to(auraRef.current, { opacity: 1, duration: 0.6 }, "<")
        .to(energyRingRef.current, { opacity: 1, duration: 0.9 }, "<")

        // 5. wordmark impact slam + draw
        .fromTo(
          wordPath,
          { opacity: 0, scaleX: 1.35, skewX: -8 },
          { opacity: 1, scaleX: 1, skewX: 0, duration: 0.8, ease: "back.out(2.6)" },
          "-=0.25"
        )
        .to(wordPath, { strokeDashoffset: 0, duration: 0.82, ease: "power2.inOut" }, "<")
        .to(wordPath, { fill: "#ffffff", stroke: "rgba(255,255,255,0)", duration: 0.3 }, ">-0.05")

        // 6. tagline
        .fromTo(
          taglineRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.65 },
          "-=0.12"
        )

        // 7. HUD-style percentage counter
        .to(
          counter,
          {
            val: 100,
            duration: 1.6,
            ease: "power1.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.floor(counter.val)
                ).padStart(3, "0");
              }
            },
          },
          "-=1.2"
        )

        // give the brand a deliberate pause to breathe in the frame
        .to({}, { duration: 0.8 })

        // 8. wipe away, revealing the real site underneath
        .to([auraRef.current, energyRingRef.current], { opacity: 0, duration: 0.35 }, "+=0.05")
        .to(
          overlayRef.current,
          { yPercent: -102, duration: 1, ease: "power4.inOut" },
          "<"
        )
        .set(root, { display: "none" });

      // continuous aura "breathing" pulse once the mark has landed
      gsap.to(auraRef.current, {
        scale: 1.18,
        opacity: 0.55,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.7,
      });

      // energy ring breathes opposite-phase to the aura, plus a slow
      // continuous rotation so the ring reads as "alive" rather than static
      gsap.to(energyRingRef.current, {
        scale: 0.92,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.0,
      });
      gsap.to(energyRingRef.current, {
        rotate: 360,
        duration: 9,
        repeat: -1,
        ease: "none",
        delay: 1.7,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!isVisible) return <>{children}</>;

  return (
    <>
      <div
        ref={rootRef}
        className="fixed inset-0 z-[999] overflow-hidden bg-primary text-white"
        aria-hidden="true"
      >
        <div ref={overlayRef} className="relative h-full w-full">
          {/* manga screentone texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          {/* cinematic vignette — darkens the edges for depth */}
          <div
            ref={vignetteRef}
            className="pointer-events-none absolute inset-0 opacity-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 32%, rgba(11,4,4,0.55) 78%, rgba(11,4,4,0.92) 100%)",
            }}
          />

          {/* flickering katakana glitch layer */}
          <div
            ref={katakanaWrapRef}
            className="pointer-events-none absolute inset-0 select-none overflow-hidden font-mono"
          >
            {KATAKANA.map((ch, i) => (
              <span
                key={i}
                className="absolute text-secondary opacity-0 text-2xl md:text-4xl"
                style={{
                  left: `${(i * 37 + 8) % 92}%`,
                  top: `${(i * 53 + 12) % 88}%`,
                }}
              >
                {ch}
              </span>
            ))}
          </div>

          {/* impact flash */}
          <div
            ref={flashRef}
            className="pointer-events-none absolute inset-0 bg-white opacity-0"
          />

          {/* centered stage */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            {/* shockwave rings */}
            <div
              ref={ring1Ref}
              className="absolute left-1/2 top-1/2 h-20 w-20 rounded-full border-2 border-secondary"
            />
            <div
              ref={ring2Ref}
              className="absolute left-1/2 top-1/2 h-20 w-20 rounded-full border border-secondary/70"
            />

            {/* speed lines */}
            <div
              ref={linesWrapRef}
              className="absolute left-1/2 top-1/2 h-0 w-0"
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute left-0 top-0 h-[2px] w-32 origin-left"
                  style={{ transform: `rotate(${i * 20}deg)` }}
                >
                  <span className="speed-line block h-full w-full origin-left bg-secondary" />
                </span>
              ))}
            </div>

            {/* singularity core dot */}
            <div
              ref={coreRef}
              className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-secondary opacity-0"
            />

            {/* energy ring — slow rotating conic glow orbiting the mark */}
            <div
              ref={energyRingRef}
              className="absolute left-1/2 top-1/2 h-52 w-52 rounded-full opacity-0 md:h-64 md:w-64"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(188,1,0,0.6) 55deg, transparent 130deg, transparent 210deg, rgba(188,1,0,0.4) 275deg, transparent 360deg)",
                maskImage:
                  "radial-gradient(circle, transparent 54%, black 58%, black 66%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 54%, black 58%, black 66%, transparent 70%)",
              }}
            />

            {/* aura glow behind the logo — soft radial bloom, not a flat blur */}
            <div
              ref={auraRef}
              className="absolute left-1/2 top-1/2 h-48 w-48 rounded-full opacity-0 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(188,1,0,0.85) 0%, rgba(188,1,0,0.35) 45%, transparent 72%)",
              }}
            />

            {/* Zj logo mark */}
            <svg
              viewBox="0 0 246 199"
              className="relative w-20 md:w-28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g strokeWidth="4">
                <path
                  ref={logoPath1Ref}
                  fill="#ffffff"
                  stroke="none"
                  d="M232.8 11.5c-.2.3-8.3 3.4-18 6.9l-17.5 6.4-72.4.7c-39.8.4-72.5.8-72.7.9-.3.4 17.4 17.7 21.3 20.8l3 2.4 39.7-.1h39.6L145 55.8c-11.1 6.5-37.2 26.9-82 64.1-12.9 10.7-29.8 24.7-37.5 30.9-13.6 11.2-16.8 14.3-12.9 12.8 1.1-.4 9.8-3.6 19.4-7.1s21.8-8 27-9.9l9.5-3.6H107l38.5-.1 8.8-8c8.1-7.5 8.7-8.4 8.7-12V119l-31-.2-31-.3 9.7-6.5c10.3-7 49.8-38.3 78.8-62.6 9.9-8.3 24.1-19.9 31.5-25.8 7.4-6 13.7-11.2 13.8-11.7.4-1-1.1-1.2-2-.4"
                />
                <path
                  ref={logoPath2Ref}
                  fill="#ffffff"
                  stroke="none"
                  d="m194 67.1-14.5 12.2-.6 26.1c-.3 15.8-1 27.5-1.8 29.8-3 9.4-11.3 17.8-21.8 21.9-5.4 2.2-7.6 2.4-34 2.9l-28.2.5-12.6 12.4c-6.9 6.8-12.5 12.8-12.5 13.3 0 .6 18 .8 45.3.5 49.8-.4 51.7-.6 64.6-7 9.7-4.7 21-16.1 25.6-25.9 5.8-12.1 6.4-18.2 6.5-61.1 0-20.7-.4-37.7-.8-37.7s-7.3 5.5-15.2 12.1"
                />
              </g>
            </svg>

            {/* ZENJI wordmark */}
            <svg
              viewBox="0 0 1023 238"
              className="relative mt-4 w-56 md:w-72"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                ref={wordPathRef}
                fill="#ffffff"
                stroke="none"
                strokeWidth="3"
                d="M744.4 11.8c-1.7 1.5-10.7 9.7-20 18.2l-16.9 15.4-.5 42.5-.5 42.5-36.9-39c-20.3-21.4-45-47.1-54.7-57.2L597.1 16l-23.8.2-23.8.3-.5 89.5c-.3 49.2-.4 89.7-.3 89.9s9.3-7.7 20.5-17.4l20.3-17.7.5-47.9.5-47.9 58.5 60.9 58.5 60.9 20.3.1 20.2.1v-81.3c0-44.8.3-84.8.6-89 .4-4.4.3-7.7-.2-7.7-.5.1-2.3 1.3-4 2.8M67 16.8c0 .4 7.9 8 17.5 16.8L102 49.5l73.3.5 73.2.5-16.4 8.4c-13.7 7-19.7 10.9-36.9 23.8-32.8 24.7-56.3 43-91.6 71.1-18.2 14.5-47.1 37.4-64.3 51-17.2 13.5-31.1 24.7-30.9 24.9s12.2-4 26.7-9.3c39.7-14.5 70.1-25.5 72.9-26.4 1.4-.4 6.2-2.2 10.8-3.9l8.3-3.1h164.5l13.6-12 13.6-12.1.4-4.9.3-5H316c-1.9-.1-36.3-.1-76.5 0-61.6 0-72.7-.2-71.5-1.3.8-.8 9.4-7.4 19-14.7 24.5-18.7 64.8-49.9 89-69 11.3-8.9 30.3-23.9 42.2-33.2 12-9.3 22-17.4 22.3-17.9.4-.5-52.4-.9-136.4-.9-75.4 0-137.1.4-137.1.8m287.5 0c-.6.4-3.6 4.4-6.8 8.9l-5.7 8.2V187h75.8l75.7-.1 17-16.3c9.4-9 16.7-16.7 16.4-17-.3-.4-32.9-.6-72.3-.6H383v-33h101.5l17-16c9.4-8.8 17.2-16.5 17.3-17 .2-.7-23.6-1-67.7-1H383V54h109.9l11.3-9.7c19.9-17 20.8-18 20.8-23.5V16h-84.7c-46.7 0-85.3.4-85.8.8m544.3 50.4c-.3 49.7-.4 51.5-2.5 57-4.1 11-10.4 17.8-20.8 23-9 4.5-12.6 4.8-49.2 4.9-19 .1-35.7.4-37.1.8-1.3.4-9.1 6.7-17.3 14.1-13.5 12.2-14.9 13.8-14.9 16.8v3.3l60.8-.3c59.2-.4 60.9-.4 68.7-2.6 12.9-3.6 23.5-9.4 32.5-17.9 8.9-8.3 13.5-15.3 17.3-25.9 4.4-12.2 4.8-19.2 4.5-73.4l-.3-50.5-20.7-.3-20.7-.2zM972 45c0 15.9.3 29 .6 29s4.5-3.5 9.3-7.8c4.8-4.2 13.5-11.8 19.3-16.7l10.7-9 .1-12.3V16h-40zm19.3 25.7-19.2 16.8-.1 54.4v54.5l3.3-3.1c1.7-1.6 10.7-9.6 20-17.7l16.7-14.7v-53.5c0-29.4-.3-53.4-.8-53.4-.4 0-9.4 7.5-19.9 16.7"
              />
            </svg>

            {/* tagline */}
            <p
              ref={taglineRef}
              className="mt-6 select-none text-center font-mono text-[11px] tracking-[0.35em] text-subtle opacity-0"
            >
              起動中 // LOADING ...
            </p>
          </div>

          {/* HUD percentage counter */}
          <div className="pointer-events-none absolute bottom-8 right-8 font-mono text-sm text-subtle">
            <span ref={counterRef}>000</span>
            <span ref={percentSignRef} className="text-secondary">
              %
            </span>
          </div>

          {/* corner brand mark, gamer-HUD style */}
          <div className="pointer-events-none absolute bottom-8 left-8 font-mono text-[11px] tracking-[0.35em] text-muted">
            ZENJI // v1
          </div>
        </div>
      </div>

      {children}
    </>
  );
}