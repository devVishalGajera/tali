"use client";

import Image from "next/image";
import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      question: "Lorem ipsum dolor sit amet",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Et bibendum integer odio ornare. Feugiat egestas mauris eleifend sed pharetra velit viverra commodo mattis. Nisi amet sit.",
    },
    {
      question: "Lorem ipsum dolor sit amet",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Et bibendum integer odio ornare. Feugiat egestas mauris eleifend sed pharetra velit viverra commodo mattis. Nisi amet sit.",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur. Neque laoreet curabitur amet dolor.",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Et bibendum integer odio ornare. Feugiat egestas mauris eleifend sed pharetra velit viverra commodo mattis. Nisi amet sit.",
    },
    {
      question: "Lorem ipsum dolor sit amet",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Et bibendum integer odio ornare. Feugiat egestas mauris eleifend sed pharetra velit viverra commodo mattis. Nisi amet sit.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Side - Image (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            <Image
              src="/assets/images/bottles/single-bottle.png"
              alt="Wine bottle with food"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Side - FAQ Accordion (1/3 width on desktop) */}
        <div className="lg:col-span-1 flex flex-col justify-center">
          <div className="w-full">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`border-b border-gray-200 ${
                  index === faqItems.length - 1 ? "border-b-0" : ""
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full py-4 md:py-5 flex items-start justify-between gap-4 text-left hover:opacity-80 transition-opacity"
                >
                  <h3 className="text-base md:text-lg font-medium text-[#1D1D1D] flex-1">
                    {item.question}
                  </h3>
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-[#1D1D1D] transition-transform duration-300"
                    >
                      {openIndex === index ? (
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        <>
                          <path
                            d="M12 5V19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </>
                      )}
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pb-4 md:pb-5 pr-6">
                    <p className="text-sm md:text-base text-[#1D1D1D] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
