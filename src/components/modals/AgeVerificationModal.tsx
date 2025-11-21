"use client";

import { useState } from "react";
import Image from "next/image";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onAgree: () => void;
  onDecline: () => void;
}

const AgeVerificationModal = ({ isOpen, onAgree, onDecline }: AgeVerificationModalProps) => {
  const [isMainAccordionExpanded, setIsMainAccordionExpanded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [birthYear, setBirthYear] = useState("");

  if (!isOpen) return null;

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setBirthYear(value);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const accordionSections = [
    {
      id: "proof-of-age",
      title: "Proof of age",
      content:
        "You must be over 21 years of age to purchase alcoholic beverages. We reserve the right to refuse service, terminate accounts, remove alcohol, or cancel orders in our sole discretion. It is a violation punishable under the law for any person under the age of twenty-one to present any written evidence.",
    },
    {
      id: "delivery-new-york",
      title: "Delivery allowed to New York only",
      content:
        "Alcohol cannot be delivered outside of New York State so beer, wine, and spirits will be removed from your cart during checkout if an address outside of New York State is selected for delivery.",
    },
    {
      id: "separate-businesses",
      title: "Fresh Direct Wine & Spirits and FreshDirect are separate businesses",
      content:
        "FreshDirect Wine & Spirits and FreshDirect are separate businesses. Because of this, you'll see two different charges on your preferred payment method when your order contains both wine/spirits and food. But don't worry—we'll deliver your whole order at once and only charge you a single delivery fee. Beer is sold by Fresh Direct, LLC.",
    },
    {
      id: "delivery-buildings",
      title: "Fresh Direct reserves the right not to deliver alcohol to certain buildings",
      content:
        "Fresh Direct reserves the right to refuse delivery of alcoholic beverages to certain buildings, addresses, or locations at our sole discretion. This may include but is not limited to buildings with restrictive policies, areas with delivery restrictions, or locations where we cannot verify the recipient's age or identity.",
    },
    {
      id: "warning",
      title: "Warning",
      content:
        "Consuming alcoholic beverages can be harmful to your health. Please drink responsibly. Do not drink and drive. If you are pregnant, nursing, or have a medical condition, consult your physician before consuming alcohol.",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />

      {/* Modal Container */}
      <div className="relative w-full max-w-[500px] md:max-w-[600px] bg-white rounded-lg md:rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto modal-scrollbar-hide animate-slideIn">
        {/* Logo */}
        <div className="flex justify-center pt-6 md:pt-8 pb-4 animate-fadeInUp">
          <Image
            src="/assets/logo/logo-64x64.svg"
            alt="Talli Logo"
            width={64}
            height={64}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 transition-transform duration-300 hover:scale-110"
            priority
          />
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
          {/* Question */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black uppercase text-center mb-3 md:mb-4 animate-fadeInUp" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            ARE YOU OVER 18 YEARS OLD?
          </h2>

          {/* Instructional Text */}
          <p className="text-xs sm:text-sm md:text-base text-black text-center mb-6 md:mb-8 leading-relaxed animate-fadeInUp" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            You must be of legal drinking age to buy our products. Age will be verified upon
            delivery through ID.
          </p>

          {/* Year Input Field - Always visible */}
          <div className="mb-6 md:mb-8 animate-fadeInUp" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <input
              type="text"
              value={birthYear}
              onChange={handleYearChange}
              placeholder="YYYY"
              maxLength={4}
              className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg text-center text-lg sm:text-xl md:text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:scale-[1.02]"
            />
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
              Enter Your Born year
            </p>
          </div>

          {/* Main Accordion Section - "Before shopping for alcohol..." */}
          <div className="mb-6 md:mb-8 border border-gray-300 rounded-lg overflow-hidden">
            {/* Accordion Title with Toggle Button */}
            <button
              onClick={() => setIsMainAccordionExpanded(!isMainAccordionExpanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-300 active:scale-[0.98]"
            >
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-black flex-1 pr-2 text-left">
                Before shopping for alcohol, we want to make sure..
              </h3>
              <div className="flex-shrink-0">
                <Image
                  src="/assets/header/icons/arrowDownIcon.svg"
                  alt="Toggle"
                  width={16}
                  height={16}
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isMainAccordionExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Collapsible Content */}
            {isMainAccordionExpanded && (
              <div className="px-4 pb-4 space-y-6 md:space-y-8 border-t border-gray-200 animate-fadeIn" style={{ animationDuration: "0.3s" }}>
                {/* Nested Accordion Items */}
                <div className="space-y-0">
                  {accordionSections.map((section, index) => {
                    const isExpanded = expandedSection === section.id;
                    return (
                      <div key={section.id}>
                        {/* Accordion Item */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-start gap-3 md:gap-4 p-4 hover:bg-gray-50 transition-all duration-300 text-left active:scale-[0.98]"
                        >
                          {/* Icon */}
                          <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-gray-400 flex items-center justify-center mt-0.5">
                            <Image
                              src="/assets/header/icons/infoIcon.svg"
                              alt="Info"
                              width={16}
                              height={16}
                              className="w-3 h-3 md:w-4 md:h-4"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base md:text-lg font-bold text-black mb-0">
                              {section.title}
                            </h4>
                            {isExpanded && (
                              <p className="text-xs sm:text-sm md:text-base text-black leading-relaxed mt-2 pr-2 animate-fadeIn" style={{ animationDuration: "0.3s" }}>
                                {section.content}
                              </p>
                            )}
                          </div>

                          {/* Expand/Collapse Icon */}
                          <div className="flex-shrink-0">
                            <Image
                              src="/assets/header/icons/arrowDownIcon.svg"
                              alt="Expand"
                              width={20}
                              height={20}
                              className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {/* Separator Line */}
                        {index < accordionSections.length - 1 && (
                          <div className="h-px bg-gray-200 mx-4" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons - Inside collapsible content */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={onAgree}
                    className="flex-1 bg-black text-white uppercase font-semibold py-3 md:py-4 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base md:text-lg hover:scale-105 active:scale-95 transform"
                  >
                    I AGREE
                  </button>
                  <button
                    onClick={onDecline}
                    className="flex-1 bg-white text-black border-2 border-black uppercase font-semibold py-3 md:py-4 px-6 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm sm:text-base md:text-lg hover:scale-105 active:scale-95 transform"
                  >
                    I DECLINE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
