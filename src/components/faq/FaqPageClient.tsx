"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/api/guest";

interface Props {
  faqs: FaqItem[];
}

export default function FaqPageClient({ faqs }: Props) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  return (
    <main className="w-full min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1D1D1D]">
              Frequently <span className="text-[#006B4D]">Asked Questions</span>
            </h1>
            <p className="text-sm text-[#1D1D1D80] mt-2">
              Find answers to common questions about Talli Drinks.
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center rounded-2xl bg-white border border-[#E8E8E8] h-[150px]">
            <div className="text-center">
              <p className="text-4xl font-black text-[#006B4D] leading-none">FAQ</p>
              <p className="text-xs text-[#1D1D1D80] mt-1">Help Center</p>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
            {faqs.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-[#1D1D1D80]">
                  No FAQs available right now.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[#F0F0F0]">
                {faqs.map((faq, idx) => {
                  const isOpen = openId === faq.id;
                  return (
                    <li key={faq.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 hover:bg-[#FCFCFC] transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#1D1D1D]">
                            {idx + 1}. {faq.question}
                          </p>
                        </div>
                        <span className="text-[#1D1D1D80] mt-0.5">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 -mt-1">
                          <p className="text-sm text-[#1D1D1D80] whitespace-pre-line leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

