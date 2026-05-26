"use client";

import { useState } from "react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const error =
    !email
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Enter a valid email address."
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (error) return;
    setSubmitting(true);
    try {
      /* No backend endpoint yet — simulate success and reset. */
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 bg-white/15 border border-white/30 rounded-2xl px-5 py-4">
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#006B4D] shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Thanks for subscribing!</p>
          <p className="text-xs text-white/80">We&apos;ll send your 20% off code shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 min-w-0">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Enter your email here"
            autoComplete="email"
            className={`w-full px-4 py-3 rounded-xl bg-white text-sm text-[#1D1D1D] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
              touched && error
                ? "ring-2 ring-red-300"
                : "focus:ring-[#FF8A3D]/40"
            }`}
          />
          {touched && error && (
            <p className="mt-1 text-xs text-white/90">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="shrink-0 bg-[#FF8A3D] hover:bg-[#ff7a23] active:scale-[0.99] text-white font-semibold text-sm rounded-xl px-6 py-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {submitting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : null}
          {submitting ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
    </form>
  );
};

export default NewsletterForm;
