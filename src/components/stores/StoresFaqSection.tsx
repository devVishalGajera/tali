"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "How do I find wine shops near me?",
    answer:
      "Search by city or use your location on the stores page to browse verified wine shops and liquor stores in your area.",
  },
  {
    question: "Can I order for delivery from these stores?",
    answer:
      "Delivery availability depends on each store. Look for the delivery badge on store listings or check the store detail page.",
  },
  {
    question: "Are the stores on Talli verified?",
    answer:
      "Many listings are verified partners. Verified stores display a verified badge on their profile.",
  },
];

const StoresFaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-8 md:py-10">
      <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1D] mb-6">Frequently asked questions</h2>
      <div className="max-w-2xl">
        {faqItems.map((item, index) => (
          <div key={index} className="border-b border-[#E8E8E8]">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full py-4 flex items-start justify-between gap-4 text-left"
            >
              <span className="text-sm sm:text-base font-medium text-[#1D1D1D]">{item.question}</span>
              <span className="text-[#1D1D1D80] shrink-0 text-lg leading-none">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <p className="text-sm text-[#1D1D1D80] leading-relaxed pb-4 pr-8">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoresFaqSection;
