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
    <section className="w-full bg-gray-50 py-10 md:py-12 lg:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1D1D1D] mb-8 md:mb-12 text-left">
          Trusted by millions to discover and buy the right wine every time.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center justify-center"
            >
              <div className="text-[#1D1D1D] mb-4 flex items-center justify-center md:justify-start">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={36}
                  height={36}
                  className="w-8 h-8 md:w-10 md:h-10"
                />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-[#1D1D1D] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-[#1D1D1D] leading-relaxed">
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
