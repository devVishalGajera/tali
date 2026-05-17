import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden">

      {/* ══════════════════════════════════════════
          LEFT PANEL — background image scoped here
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col h-screen">

        {/* Background image — fills ONLY left panel */}
        <Image
          src="/assets/auth/left-side-view-bg.jpeg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay: strong on left (text area), lighter on right (photo area) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

        {/* Logo */}
        <div className="relative z-10 p-8 lg:p-10">
          <Link href="/">
            <Image
              src="/assets/logo/talli-logo.jpeg"
              alt="Talli"
              width={54}
              height={54}
              className="rounded-full ring-2 ring-white/20"
            />
          </Link>
        </div>

        {/* Bottom text content */}
        <div className="relative z-10 flex-1 flex flex-col justify-end px-8 lg:px-10 pb-10">

          <h2 className="text-white text-4xl xl:text-5xl font-bold leading-[1.18] mb-4">
            India&apos;s finest<br />
            spirits,{" "}
            <span className="text-[#F4A22D]">delivered to</span>
            <br />
            <span className="text-[#F4A22D]">your door.</span>
          </h2>

          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-[280px]">
            Browse thousands of wines, spirits, beers and more. Fast delivery across India.
          </p>

          <div className="flex flex-col gap-4 mb-8">
            {[
              {
                label: "100% Authentic",
                sub: "Genuine products only",
                d: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
              },
              {
                label: "Fast Delivery",
                sub: "Across 100+ cities",
                d: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
              },
              {
                label: "Secure Payments",
                sub: "Safe & encrypted",
                d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
              },
            ].map(({ label, sub, d }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-white/25 bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{label}</p>
                  <p className="text-white/45 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Responsible drinking pill */}
          <div className="flex items-start gap-2.5 bg-[#006B4D]/25 border border-[#006B4D]/40 rounded-xl px-4 py-3 max-w-[310px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F4A22D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <p className="text-[#F4A22D] text-xs font-semibold leading-tight">Drink responsibly. Don&apos;t drink and drive.</p>
              <p className="text-white/40 text-[11px] mt-0.5">Talli promotes responsible drinking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — dark bg + floating white card
      ══════════════════════════════════════════ */}
      <div className="flex-1 relative flex items-stretch p-4 lg:p-5 bg-[#111916] overflow-hidden h-screen">
        {/* Same background image, dark overlay */}
        <Image
          src="/assets/auth/left-side-view-bg.jpeg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />

        {/* Floating white card */}
        <div className="relative z-10 w-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">

          {/* Mobile logo */}
          <div className="lg:hidden px-8 pt-8">
            <Link href="/">
              <Image src="/assets/logo/talli-logo.jpeg" alt="Talli" width={44} height={44} className="rounded-full" />
            </Link>
          </div>

          {/* Form area — scrollable inside the card */}
          <div className="flex-1 overflow-y-auto flex items-start justify-center px-8 py-10">
            <div className="w-full max-w-[380px]">
              {children}
            </div>
          </div>

          {/* Bottom illustration */}
          <div className="relative w-full h-[130px] flex-shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/auth/right-side-bottom.jpeg"
              alt=""
              className="w-full h-full object-cover object-bottom"
              style={{ filter: "invert(1)", opacity: 0.2 }}
            />
          </div>

        </div>
      </div>

    </div>
  );
}
