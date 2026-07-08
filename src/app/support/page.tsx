import type { Metadata } from "next";
import Link from "next/link";
import SupportForm from "@/components/support/SupportForm";
import { getFaqApi } from "@/lib/api/guest";
import {
  TALLI_STORE_ADDRESS,
  TALLI_STORE_NAME,
} from "@/lib/store/talli-store";

export const metadata: Metadata = {
  title:       "Customer Support",
  description:
    "Get help with your Talli alcohol delivery orders, including tracking, returns, and questions. Our customer support team is here to assist you.",
  alternates: { canonical: "/support" },
};

interface Location {
  name:    string;
  address: string;
}

const LOCATIONS: Location[] = [
  {
    name:    TALLI_STORE_NAME,
    address: TALLI_STORE_ADDRESS,
  },
];

const PHONE_DISPLAY = "+91 7779027171";
const PHONE_HREF    = "tel:+917779027171";
const EMAIL         = "support@tallidrinks.com";

export default async function SupportPage() {
  const faqs = await getFaqApi();

  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#006B4D] to-[#004E37] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-white/70 mb-3">
              We&apos;re here to help
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              Customer Support
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">
              Get help with your alcohol delivery orders — tracking, refunds, account issues,
              or anything else. Our team usually replies within one business day.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 bg-white text-[#006B4D] text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                Call {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/25 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-14">
        {/* ── Two-column: form + contact info ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-7 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1D] mb-1">Send us a message</h2>
              <p className="text-sm text-[#1D1D1D80] mb-6">
                Fill out the form with any question on your mind and we&apos;ll get back to you as soon as possible.
              </p>
              <SupportForm />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-6">
              <h3 className="text-base font-bold text-[#1D1D1D] mb-3">Quick contact</h3>
              <div className="space-y-3">
                <a href={PHONE_HREF} className="flex items-start gap-3 group">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#006B4D]/10 text-[#006B4D] shrink-0 group-hover:bg-[#006B4D]/15 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-[#1D1D1D60]">Call us</p>
                    <p className="text-sm font-semibold text-[#1D1D1D] group-hover:text-[#006B4D] transition-colors">{PHONE_DISPLAY}</p>
                  </div>
                </a>

                <a href={`mailto:${EMAIL}`} className="flex items-start gap-3 group">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#006B4D]/10 text-[#006B4D] shrink-0 group-hover:bg-[#006B4D]/15 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-[#1D1D1D60]">Email us</p>
                    <p className="text-sm font-semibold text-[#1D1D1D] group-hover:text-[#006B4D] transition-colors break-all">
                      {EMAIL}
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-3 pt-1">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#006B4D]/10 text-[#006B4D] shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-[#1D1D1D60]">Typical reply time</p>
                    <p className="text-sm font-semibold text-[#1D1D1D]">Within 1 business day</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-6">
              <h3 className="text-base font-bold text-[#1D1D1D] mb-3">Order help</h3>
              <p className="text-xs text-[#1D1D1D80] mb-4 leading-relaxed">
                Track an existing order or browse your past orders for quick access to invoices and reorder.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/orders"
                  className="inline-flex items-center justify-center gap-2 w-full bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Go to My Orders
                </Link>
                <Link
                  href="/stores"
                  className="inline-flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 border border-gray-200 text-[#1D1D1D] text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Find a store
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Locations ─────────────────────────────────────── */}
        <section className="mt-12 md:mt-16">
          <div className="mb-6">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#006B4D] mb-2">
              Locations
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">You can find us in any of these locations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {LOCATIONS.map((loc) => (
              <div key={loc.name} className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-6 flex gap-4">
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#006B4D]/10 text-[#006B4D] shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#1D1D1D] mb-1.5">{loc.name}</h3>
                  <p className="text-sm text-[#1D1D1D80] leading-relaxed">{loc.address}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.name} ${loc.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#006B4D] hover:underline mt-3"
                  >
                    Open in maps
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section id="faq" className="mt-12 md:mt-16 scroll-mt-28 md:scroll-mt-40">
          <div className="mb-6">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#006B4D] mb-2">
              FAQ
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">Frequently asked questions</h2>
          </div>

          {faqs.length > 0 ? (
            <div className="bg-white border border-[#E8E8E8] rounded-2xl divide-y divide-[#F0F0F0] overflow-hidden">
              {faqs.map((faq, i) => (
                <details
                  key={faq.id}
                  className="group [&_summary::-webkit-details-marker]:hidden"
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 cursor-pointer list-none hover:bg-[#FAFAFA] transition-colors">
                    <h3 className="text-sm sm:text-base font-semibold text-[#1D1D1D] pr-2">
                      {faq.question}
                    </h3>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#006B4D]/10 text-[#006B4D] shrink-0 transition-transform group-open:rotate-180">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1">
                    <p className="text-sm text-[#1D1D1D80] leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E8E8E8] rounded-2xl px-6 py-10 text-center">
              <p className="text-sm text-[#1D1D1D80]">
                We couldn&apos;t load FAQs right now. Please reach out to us at{" "}
                <a href={PHONE_HREF} className="text-[#006B4D] font-semibold hover:underline">
                  {PHONE_DISPLAY}
                </a>{" "}
                if you need help.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
