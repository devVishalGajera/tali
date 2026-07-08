"use client";

import Image from "next/image";

const WhyTalliDrinks = () => {
  const features = [
    {
      image: "/assets/images/drink-glass.png",
      title: "🍻 Your Favourites, All in One Place",
      description:
        "Browse beers, wines, spirits, and mixers from top local and global brands."
    },
    {
      image: "/assets/images/drinks.png",
      title: "✨ Curated for Every Occasion",
      description:
        "Whether it’s a house party, date night, or celebration, find the perfect drink.",
    },
    {
      image: "/assets/images/hand-bottle.png",
      title: "🌎 Discover Something New",
      description:
        "Explore trending brands, hidden gems, and unique flavours.",
    },
    {
      image: "/assets/images/bar-bottels.png",
      title: "🥂 Made for Drink Lovers",
      description:
        "A smarter way to discover, compare, and choose your next drink.",
    },
  ];

  return (
    <section className="w-full py-8 md:py-10">
      <div>
        <h2 className="text-base md:text-xl font-bold text-[#1D1D1D] mb-5 md:mb-8 text-left">
          Why Talli Drinks?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {features.map((feature, index) => {
            let borderClass = "";
            if (index === 0) {
              borderClass = "gradient-border-bottom-right";
            } else if (index === 1) {
              borderClass = "gradient-border-bottom";
            } else if (index === 2) {
              borderClass = "gradient-border-right";
            }

            return (
              <div
                key={index}
                className={`flex items-center gap-3 md:gap-5 py-4 pr-4 md:py-5 md:pr-6 pl-0 ${index === 0 || index === 2 ? "md:!pl-0" : "md:pl-5"
                  } ${borderClass}`}
              >
                {/* Circular Image */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-bold text-[#1D1D1D] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#1D1D1D] leading-relaxed">
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
