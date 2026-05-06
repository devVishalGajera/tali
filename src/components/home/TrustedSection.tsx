"use client";

import Image from "next/image";

const TrustedSection = () => {
  const features = [
    {
      icon: "/assets/icons/truck.svg",
      title: "Free Delivery",
      description: "On orders above ₹1000",
    },
    {
      icon: "/assets/icons/plant.svg",
      title: "Fresh & Organic",
      description: "Handpicked daily",
    },
    {
      icon: "/assets/icons/return.svg",
      title: "Easy Returns",
      description: "No questions asked policy",
    },
    {
      icon: "/assets/icons/time.svg",
      title: "Delivery Slots",
      description: "Choose your convenient time",
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-base md:text-xl font-bold text-[#1D1D1D] mb-5 md:mb-8 text-left">
          Trusted by millions to discover and buy the right wine every time.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center justify-center"
            >
              <div className="text-[#1D1D1D] mb-2 flex items-center justify-center">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={28}
                  height={28}
                  className="w-6 h-6 md:w-7 md:h-7"
                />
              </div>
              <h3 className="text-sm md:text-base font-bold text-[#1D1D1D] mb-1">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-[#1D1D1D] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedSection;
