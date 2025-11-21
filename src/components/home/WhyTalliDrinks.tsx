"use client";

import Image from "next/image";

const WhyTalliDrinks = () => {
  const features = [
    {
      image: "/assets/images/drink-glass.png",
      title: "Premium Quality Selection",
      description:
        "Curated collection of finest spirits and beverages from around the world, ensuring exceptional taste and quality.",
    },
    {
      image: "/assets/images/drinks.png",
      title: "Expert Mixology",
      description:
        "Discover expertly crafted cocktails and drinks that elevate your drinking experience to new heights.",
    },
    {
      image: "/assets/images/hand-bottle.png",
      title: "Authentic Craftsmanship",
      description:
        "Experience the art of traditional distilling and brewing with our handpicked selection of artisanal drinks.",
    },
    {
      image: "/assets/images/bar-bottels.png",
      title: "Wide Variety",
      description:
        "Explore an extensive range of premium brands and unique flavors to suit every taste and occasion.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div>
        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-[#1D1D1D] mb-8 md:mb-12 text-left">
          Why Talli Drinks?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {features.map((feature, index) => {
            let borderClass = "";
            if (index === 0) {
              // Top-left: bottom and right borders
              borderClass = "gradient-border-bottom-right";
            } else if (index === 1) {
              // Top-right: bottom border only
              borderClass = "gradient-border-bottom";
            } else if (index === 2) {
              // Bottom-left: right border only
              borderClass = "gradient-border-right";
            }
            // Bottom-right: no borders

            return (
              <div
                key={index}
                className={`flex items-center gap-4 md:gap-6 pt-4 pb-4 pr-4 md:pt-6 md:pb-6 md:pr-6 lg:pt-8 lg:pb-8 lg:pr-8 pl-0 ${
                  index === 0 || index === 2 ? "md:!pl-0" : "md:pl-6"
                } ${borderClass}`}
              >
                {/* Circular Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#1D1D1D] mb-2 md:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#1D1D1D] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyTalliDrinks;
