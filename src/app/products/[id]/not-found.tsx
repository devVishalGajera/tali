import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          {/* Illustration: bottle with a question mark */}
          <div className="relative mb-6 md:mb-8">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#006B4D]/10 via-[#FF5C00]/10 to-transparent rounded-full blur-3xl" />
            <svg
              width="180"
              height="180"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="md:w-[220px] md:h-[220px]"
            >
              {/* Bottle body */}
              <path
                d="M82 30 h36 v22 c0 6 4 10 8 14 c10 8 14 18 14 30 v74 c0 8 -6 14 -14 14 H74 c-8 0 -14 -6 -14 -14 V96 c0 -12 4 -22 14 -30 c4 -4 8 -8 8 -14 V30 z"
                fill="#F3F8F6"
                stroke="#006B4D"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Cap */}
              <rect x="80" y="20" width="40" height="14" rx="3" fill="#006B4D" />
              {/* Label */}
              <rect
                x="64"
                y="110"
                width="72"
                height="50"
                rx="6"
                fill="#006B4D"
                opacity="0.9"
              />
              {/* Question mark on label */}
              <text
                x="100"
                y="148"
                textAnchor="middle"
                fontSize="36"
                fontWeight="800"
                fill="#FFFFFF"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                ?
              </text>
              {/* Highlight */}
              <path
                d="M75 78 c-6 4 -8 10 -8 18 v60"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1D] mb-3">
            Product Not Found
          </h1>

          {/* Message */}
          <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed mb-8 max-w-md">
            We couldn&apos;t find the product you&apos;re looking for. It may have been removed,
            renamed, or might not be available in your delivery area.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#006B4D] text-white text-sm font-semibold hover:bg-[#005a40] transition-colors active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Browse All Products
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#1D1D1D33] text-[#1D1D1D] text-sm font-semibold hover:border-[#1D1D1D] hover:bg-gray-50 transition-colors active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12 l9-9 9 9" />
                <path d="M5 10v10h14V10" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Helpful links */}
          <div className="mt-10 pt-8 border-t border-gray-100 w-full">
            <p className="text-xs sm:text-sm text-[#1D1D1D80] mb-3">
              Looking for something else? Try these popular categories:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: "Beer",     href: "/products?categories=1" },
                { label: "Wine",     href: "/products?categories=2" },
                { label: "Spirits",  href: "/products?categories=3" },
                { label: "Mixers",   href: "/products?categories=4" },
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
