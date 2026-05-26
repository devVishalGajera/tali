import Link from "next/link";

export default function NotFound() {
  return (
    <main className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          {/* Big 404 with playful glassware illustration */}
          <div className="relative mb-6 md:mb-8">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#006B4D]/10 via-[#FF5C00]/10 to-transparent rounded-full blur-3xl" />
            <div className="flex items-end justify-center gap-2 select-none">
              <span className="text-[96px] md:text-[140px] leading-none font-extrabold text-[#006B4D]">
                4
              </span>
              {/* Wine glass as the zero */}
              <svg
                width="96"
                height="120"
                viewBox="0 0 120 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="md:w-[140px] md:h-[180px] -mb-2"
              >
                {/* Bowl */}
                <path
                  d="M20 20 H100 c0 30 -18 56 -40 60 c-22 -4 -40 -30 -40 -60 z"
                  fill="#FF5C00"
                  opacity="0.95"
                />
                {/* Liquid highlight */}
                <path
                  d="M30 30 H90 c-2 18 -14 34 -30 36 c-16 -2 -28 -18 -30 -36 z"
                  fill="#FFFFFF"
                  opacity="0.2"
                />
                {/* Stem */}
                <rect x="58" y="80" width="4" height="40" fill="#1D1D1D" />
                {/* Base */}
                <ellipse cx="60" cy="125" rx="26" ry="6" fill="#1D1D1D" />
                {/* Drop / bubble */}
                <circle cx="100" cy="14" r="5" fill="#FF5C00" opacity="0.6" />
                <circle cx="14" cy="22" r="3" fill="#006B4D" opacity="0.6" />
              </svg>
              <span className="text-[96px] md:text-[140px] leading-none font-extrabold text-[#006B4D]">
                4
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1D] mb-3">
            Page Not Found
          </h1>

          {/* Message */}
          <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed mb-8 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#006B4D] text-white text-sm font-semibold hover:bg-[#005a40] transition-colors active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12 l9-9 9 9" />
                <path d="M5 10v10h14V10" />
              </svg>
              Go to Home
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#1D1D1D33] text-[#1D1D1D] text-sm font-semibold hover:border-[#1D1D1D] hover:bg-gray-50 transition-colors active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Browse Products
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-10 pt-8 border-t border-gray-100 w-full">
            <p className="text-xs sm:text-sm text-[#1D1D1D80] mb-3">
              Or jump to one of these:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: "My Orders",  href: "/orders" },
                { label: "Wishlist",   href: "/wishlist" },
                { label: "Stores",     href: "/stores" },
                { label: "FAQ",        href: "/#faq" },
              ].map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="px-4 py-1.5 rounded-full border border-gray-200 text-xs sm:text-sm text-[#1D1D1D] hover:border-[#006B4D] hover:text-[#006B4D] hover:bg-[#006B4D]/5 transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
