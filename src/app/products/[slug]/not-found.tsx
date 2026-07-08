import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
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
              <path
                d="M82 30 h36 v22 c0 6 4 10 8 14 c10 8 14 18 14 30 v74 c0 8 -6 14 -14 14 H74 c-8 0 -14 -6 -14 -14 V96 c0 -12 4 -22 14 -30 c4 -4 8 -8 8 -14 V30 z"
                fill="#F3F8F6"
                stroke="#006B4D"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <rect x="80" y="20" width="40" height="14" rx="3" fill="#006B4D" />
              <rect
                x="64"
                y="110"
                width="72"
                height="50"
                rx="6"
                fill="#006B4D"
                opacity="0.9"
              />
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
              <path
                d="M75 78 c-6 4 -8 10 -8 18 v60"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1D] mb-3">
            Product Not Found
          </h1>

          <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed mb-8 max-w-md">
            We couldn&apos;t find the product you&apos;re looking for. It may have been removed,
            renamed, or might not be available in your delivery area.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#006B4D] text-white text-sm font-semibold hover:bg-[#005a40] transition-colors active:scale-95"
            >
              Browse All Products
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#1D1D1D33] text-[#1D1D1D] text-sm font-semibold hover:border-[#1D1D1D] hover:bg-gray-50 transition-colors active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
