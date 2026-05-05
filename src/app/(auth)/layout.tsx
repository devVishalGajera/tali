import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — brand / hero ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B1F18] relative overflow-hidden flex-col">
        {/* Background texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#006B4D]/40 via-[#0B1F18] to-[#0B1F18]" />

        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#006B4D]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#006B4D]/15 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href="/">
            <Image
              src="/assets/logo/logo-64x64.svg"
              alt="Talli"
              width={56}
              height={56}
              className="brightness-0 invert"
            />
          </Link>
        </div>

        {/* Bottle image */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-10">
          <Image
            src="/assets/images/bottles/single-bottle.png"
            alt="Talli drinks"
            width={260}
            height={440}
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {/* Tagline */}
        <div className="relative z-10 p-10 pb-14">
          <h2 className="text-white text-3xl font-bold leading-tight mb-3">
            India&apos;s finest spirits,<br />delivered to your door.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Browse thousands of wines, spirits, beers and more. Fast delivery across India.
          </p>
        </div>
      </div>

      {/* ── Right panel — form ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-4">
          <Link href="/">
            <Image
              src="/assets/logo/logo-64x64.svg"
              alt="Talli"
              width={44}
              height={44}
            />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[420px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
