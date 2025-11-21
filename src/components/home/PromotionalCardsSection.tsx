"use client";

import Image from "next/image";

const PromotionalCardsSection = () => {
  const promotionalCards = [
    {
      title: "Retailer Awards",
      description: "Discover Award-winning stores Near you.",
      image: "/assets/images/retail.png",
    },
    {
      title: "Best wines near you",
      description: "Discover Award-winning stores Near you.",
      image: "/assets/images/drinks.png",
    },
    {
      title: "Stores & Producers",
      description: "Browse though 100,287 wine store and Businesses.",
      image: "/assets/images/store.png",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {promotionalCards.map((card, index) => (
        <div
          key={index}
          className="w-full max-w-[400px] h-[150px] border border-[#C4C4C4] rounded-[20px] bg-white cursor-pointer active:scale-95 md:hover:scale-105 transition-transform duration-300 overflow-hidden mx-auto md:mx-0 grid grid-cols-[auto_1fr] gap-4 p-4 items-center"
        >
          {/* Image Container */}
          <div>
            <Image
              src={card.image}
              alt={card.title}
              width={100}
              height={100}
              className="object-cover rounded-xl"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-1 justify-center h-full">
            <h3 className="font-graphik font-bold text-[18px] text-[#1D1D1D]">
              {card.title}
            </h3>
            <p className="font-graphik font-normal text-[14px] text-[#3C3C3C]">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default PromotionalCardsSection;

