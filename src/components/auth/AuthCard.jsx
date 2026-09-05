// components/auth/AuthCard.jsx
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

const COPY = {
  initial: {
    title: "BEGIN YOUR JOURNEY",
    subtitle: "Sign in to personalize your experience",
  },
  login: {
    title: "WELCOME BACK",
    subtitle: "Enter your details to continue",
  },
  register: {
    title: "JOIN ZENJI",
    subtitle: "Create an account to get started",
  },
};

export default function AuthCard() {
  const router = useRouter();
  const containerRef = useRef(null);

  const [view, setView] = useState("initial"); // "initial" | "login" | "register"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Cross-fade panel contents whenever the view changes
  useGSAP(
    () => {
      const els = containerRef.current?.querySelectorAll("[data-anim]");
      if (!els?.length) return;
      gsap.fromTo(
        els,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.05 }
      );
    },
    { dependencies: [view], scope: containerRef }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const switchView = (next) => {
    setError("");
    setView(next);
  };

  const handleSubmit = (e, mode) => {
    e.preventDefault();

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // UI-only: simulate a request, then send the user home.
    setTimeout(() => {
      router.push("/");
    }, 900);
  };

  const copy = COPY[view];

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-4 py-16">
      <div
        ref={containerRef}
        className="w-full max-w-[420px] rounded-lg border border-white/10 px-6 py-10 sm:px-10 sm:py-12"
      >
        <div className="text-center">
          <Link href="/" className="font-anton text-3xl tracking-[0.15em] text-white">
            ZENJI
          </Link>
        </div>

        <div key={view} className="mt-8">
          {view !== "initial" && (
            <button
              type="button"
              onClick={() => switchView("initial")}
              data-anim
              className="mb-6 flex items-center gap-1.5 font-sans text-xs uppercase tracking-wide text-subtle transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          )}

          <h1 data-anim className="text-center font-anton text-2xl uppercase text-white sm:text-3xl">
            {copy.title}
          </h1>
          <p data-anim className="mt-2 text-center font-sans text-xs uppercase tracking-wide text-subtle sm:text-sm">
            {copy.subtitle}
          </p>

          {view === "initial" && (
            <div className="mt-8 space-y-3">
              <button
                type="button"
                data-anim
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-white py-3 font-sans text-sm uppercase tracking-wide text-black transition-opacity hover:opacity-90"
              >
                <AppleIcon />
                Continue with Apple
              </button>
              <button
                type="button"
                data-anim
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-white py-3 font-sans text-sm uppercase tracking-wide text-black transition-opacity hover:opacity-90"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div data-anim className="flex items-center gap-4 py-2">
                <span className="h-px flex-1 bg-white/10" />
                <span className="font-sans text-[11px] uppercase tracking-widest text-subtle">or</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                data-anim
                onClick={() => switchView("login")}
                className="w-full rounded-sm border border-white/20 py-3 font-sans text-sm uppercase tracking-wide text-white transition-colors hover:border-white/40"
              >
                Continue with Email
              </button>

              <div data-anim className="pt-4 text-center">
                <Link
                  href="/"
                  className="font-sans text-xs text-subtle underline underline-offset-2 hover:text-white"
                >
                  Browse as Guest
                </Link>
              </div>
            </div>
          )}

          {view === "login" && (
            <form onSubmit={(e) => handleSubmit(e, "login")} className="mt-8 space-y-4">
              <Field
                label="Email"
                type="email"
                name="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <PasswordField
                label="Password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                show={showPassword}
                onToggle={() => setShowPassword((s) => !s)}
                required
              />

              <div data-anim className="text-right">
                <button
                  type="button"
                  className="font-sans text-xs text-subtle transition-colors hover:text-white hover:underline underline-offset-2"
                >
                  Forgot password?
                </button>
              </div>

              <SubmitButton label="Login" isSubmitting={isSubmitting} />

              <p data-anim className="text-center font-sans text-xs text-subtle">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchView("register")}
                  className="text-white underline underline-offset-2"
                >
                  Register
                </button>
              </p>
            </form>
          )}

          {view === "register" && (
            <form onSubmit={(e) => handleSubmit(e, "register")} className="mt-8 space-y-4">
              <Field
                label="Name"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Field
                label="Email"
                type="email"
                name="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <PasswordField
                label="Password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                show={showPassword}
                onToggle={() => setShowPassword((s) => !s)}
                required
              />
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                show={showConfirm}
                onToggle={() => setShowConfirm((s) => !s)}
                required
              />

              {error && (
                <p data-anim className="font-sans text-xs text-secondary">
                  {error}
                </p>
              )}

              <SubmitButton label="Join Zenji" isSubmitting={isSubmitting} />

              <p data-anim className="text-center font-sans text-xs text-subtle">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchView("login")}
                  className="text-white underline underline-offset-2"
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="mt-8 text-center font-sans text-[10px] leading-relaxed text-muted">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-subtle underline underline-offset-2 hover:text-white">
            Terms
          </Link>{" "}
          &{" "}
          <Link href="#" className="text-subtle underline underline-offset-2 hover:text-white">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}

/* ---------- Shared form pieces ---------- */

function Field({ label, ...props }) {
  return (
    <label data-anim className="block">
      <span className="mb-1.5 block font-sans text-xs uppercase tracking-wide text-subtle">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-sm border border-white/15 bg-transparent px-4 py-3 font-sans text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-secondary"
      />
    </label>
  );
}

function PasswordField({ label, show, onToggle, ...props }) {
  return (
    <label data-anim className="block">
      <span className="mb-1.5 block font-sans text-xs uppercase tracking-wide text-subtle">
        {label}
      </span>
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className="w-full rounded-sm border border-white/15 bg-transparent px-4 py-3 pr-11 font-sans text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-secondary"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle transition-colors hover:text-white"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}

function SubmitButton({ label, isSubmitting }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      data-anim
      className="flex w-full items-center justify-center gap-2 rounded-sm bg-secondary py-3 font-anton text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {isSubmitting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {label}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

/* ---------- Inline brand icons (no new dependency) ---------- */

function AppleIcon() {
  return (
    <svg viewBox="0 0 384 512" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-14.9 0-49.3-19.7-76.5-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.5 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.8-90-61.8-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 488 512" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M488 261.8c0-17.8-1.6-35-4.6-51.7H249v97.9h134.3c-5.8 31.3-23.4 57.8-49.9 75.6v62.7h80.6c47.1-43.4 74-107.3 74-184.5z" />
      <path fill="#34A853" d="M249 512c67.5 0 124-22.4 165.3-60.6l-80.6-62.7c-22.4 15-51 23.9-84.7 23.9-65 0-120.1-43.9-139.8-102.9H25.9v64.6C67 452.9 152.3 512 249 512z" />
      <path fill="#4A90E2" d="M109.2 309.7c-5-15-7.9-31-7.9-47.7s2.9-32.7 7.9-47.7v-64.6H25.9C9.4 182.5 0 216.1 0 262s9.4 79.5 25.9 112.3l83.3-64.6z" />
      <path fill="#FBBC05" d="M249 101.4c36.7 0 69.6 12.6 95.5 37.4l71.6-71.6C373 24.4 316.5 0 249 0 152.3 0 67 59.1 25.9 149.7l83.3 64.6c19.7-59 74.8-102.9 139.8-102.9z" />
    </svg>
  );
}