import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/about/NewsletterForm";

export const metadata: Metadata = {
  title:       "About Us",
  description:
    "Talli Drinks is a fast, reliable online alcohol delivery platform. Learn about our story, our commitment to responsible drinking, and our support for domestic producers.",
  alternates: { canonical: "/about" },
};

interface Value {
  title:    string;
  body:     string;
  iconPath: React.ReactNode;
}

const VALUES: Value[] = [
  {
    title: "Delivering drinks every day, on time",
    body:
      "Need alcohol fast? Our platform delivers a wide range of beverages within 60 minutes. From beer to wine to spirits, we have something for every occasion.",
    iconPath: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
  {
    title: "We take responsible drinking seriously",
    body:
      "We believe responsible drinking matters. We share resources and partner with responsible producers and retailers to ensure that the products we deliver are enjoyed safely and mindfully.",
    iconPath: (
      <>
        <path d="M12 22s-8-4.5-8-12a8 8 0 1116 0c0 7.5-8 12-8 12z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: "Supporting domestic producers",
    body:
      "From craft breweries to small wineries, we believe in lifting up local businesses and communities. Shop with us and discover the best that domestic producers have to offer.",
    iconPath: (
      <>
        <path d="M3 21h18" />
        <path d="M6 21V8l6-4 6 4v13" />
        <path d="M10 21v-7h4v7" />
      </>
    ),
  },
];

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "60 min", label: "Average delivery time" },
  { value: "2",      label: "Talli stores in Thane" },
  { value: "1000+",  label: "Drinks across categories" },
  { value: "24/7",   label: "Customer support" },
];

export default function AboutPage() {
  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen" id="about">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#006B4D] to-[#00513A] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-white/70 mb-3">
              About Us
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              Drinks delivered.{" "}
              <span className="text-[#FF8A3D]">Responsibly.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl">
              Talli Drinks is a fast, friendly online alcohol delivery platform.
              We bring your favourite beer, wine and spirits to your doorstep —
              while championing responsible drinking and the producers behind every bottle.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-[#006B4D] text-sm font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
              >
                Shop now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/25 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Talk to us
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/15 rounded-2xl px-4 py-5 backdrop-blur-sm">
                <p className="text-2xl md:text-3xl font-bold text-white leading-none">{s.value}</p>
                <p className="text-xs md:text-sm text-white/75 mt-2 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        {/* ── Our Story ─────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#006B4D] mb-3">
              Our story
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1D] leading-tight mb-4">
              Born during lockdown, built to last.
            </h2>
            <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed">
              Talli Drinks was founded by two friends during the COVID-19 lockdown
              with one simple goal — to help people make informed, responsible drinking choices.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#E8E8E8] rounded-2xl p-6 sm:p-8 md:p-10 space-y-4 text-sm sm:text-base text-[#1D1D1D] leading-relaxed">
            <p>
              Finding a reliable, trustworthy supplier of alcohol can be a challenge,
              and we set out to be that supplier — for ourselves, our friends, and our
              wider community.
            </p>
            <p>
              Today, we offer a wide range of alcoholic beverages — beer, wine and
              spirits — from top-rated producers and brands. Our online platform
              makes it easy to browse and order your favourites from the comfort of
              your own home.
            </p>
            <p>
              Alongside great drinks, we also champion responsible consumption.
              We share resources and information on making informed drinking
              decisions, as well as on the potential risks of excessive alcohol use.
            </p>
            <p className="text-[#1D1D1D80]">
              Thank you for choosing us as your trusted alcohol supplier. We look
              forward to helping you make responsible, enjoyable drinking choices.
            </p>
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────── */}
        <section className="mt-14 md:mt-20">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#006B4D] mb-2">
              What we stand for
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1D] leading-tight">
              Three things we care about, every single order.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white border border-[#E8E8E8] rounded-2xl p-6 sm:p-7 hover:border-[#006B4D]/40 hover:shadow-sm transition-all">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#006B4D]/10 text-[#006B4D] mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    {v.iconPath}
                  </svg>
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1D1D1D] mb-2">{v.title}</h3>
                <p className="text-sm text-[#1D1D1D80] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Save every day ───────────────────────────────── */}
        <section className="mt-14 md:mt-20">
          <div className="bg-white border border-[#E8E8E8] rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
              <div className="p-7 sm:p-10 md:p-12 flex flex-col justify-center">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#FF8A3D] mb-3">
                  Save every day
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1D] leading-tight mb-3">
                  Lower your bill with our daily specials.
                </h2>
                <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed mb-6">
                  Fresh deals across beer, wine and spirits — refreshed every day so
                  there&apos;s always a reason to celebrate.
                </p>
                <div>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    Shop deals
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-[#FFF1E5] to-[#FFE2C8] p-7 sm:p-10 md:p-12 flex items-center justify-center">
                <div className="relative w-full max-w-xs aspect-square">
                  {/* Decorative bottle illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <defs>
                        <linearGradient id="bottle" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF8A3D" />
                          <stop offset="100%" stopColor="#E26A1A" />
                        </linearGradient>
                      </defs>
                      <circle cx="120" cy="120" r="100" fill="#FFFFFF" opacity="0.6" />
                      <rect x="98" y="36" width="44" height="20" rx="3" fill="#006B4D" />
                      <path
                        d="M92 60 h56 v32 c0 8 6 14 12 22 c10 12 14 24 14 38 v60 c0 10 -8 18 -18 18 H84 c-10 0 -18 -8 -18 -18 v-60 c0 -14 4 -26 14 -38 c6 -8 12 -14 12 -22 V60 z"
                        fill="url(#bottle)"
                        stroke="#1D1D1D"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                      <rect x="78" y="148" width="84" height="50" rx="6" fill="#FFFFFF" />
                      <text x="120" y="180" textAnchor="middle" fontSize="22" fontWeight="800" fill="#006B4D" fontFamily="ui-sans-serif, system-ui, sans-serif">TALLI</text>
                      <circle cx="186" cy="56" r="6" fill="#006B4D" opacity="0.4" />
                      <circle cx="48" cy="92" r="4" fill="#FF8A3D" opacity="0.6" />
                      <circle cx="200" cy="200" r="5" fill="#FF8A3D" opacity="0.4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Subscribe & Save ─────────────────────────────── */}
        <section className="mt-14 md:mt-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#006B4D] via-[#005A40] to-[#00513A] text-white p-7 sm:p-10 md:p-14">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-60 h-60 bg-[#FF8A3D]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#FF8A3D]" />
                  Subscribe &amp; Save
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
                  <span className="text-[#FF8A3D]">20% off</span> your next order
                </h2>
                <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-md">
                  Join our newsletter for exclusive offers, tasting notes, and early
                  access to limited releases.
                </p>
              </div>
              <div className="flex lg:justify-end">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────── */}
        <section className="mt-14 md:mt-20 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] mb-3">
            Ready for a Talli?
          </h2>
          <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed mb-6">
            Browse the catalogue, pick your favourites, and we&apos;ll have them at
            your door in under 60 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Browse products
            </Link>
            <Link
              href="/stores"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-[#1D1D1D] text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Find a store
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
