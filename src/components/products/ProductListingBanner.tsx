"use client";

import Image from "next/image";

const ProductListingBanner = () => {

  return (
    <section
      className="w-full py-6 sm:py-8 md:py-10 lg:py-12 relative overflow-hidden bg-gray-900 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px]"
      style={{
        backgroundImage: "url('/assets/images/banner/product-list-banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative h-full w-full flex items-center justify-center md:justify-start px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Text Content */}
        <div className="text-center flex flex-col items-center justify-center w-full max-w-2xl md:max-w-md lg:max-w-lg">
          <Image
            src="/assets/logo/logo-100x100.svg"
            alt="Talli Logo"
            width={80}
            height={80}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-4 sm:mb-6 md:mb-8"
          />
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white mb-2 sm:mb-3 md:mb-4">
            Easy, Fast & Convenient!
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight sm:leading-snug md:leading-normal">
            Stock Up on Daily Essentials
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white leading-relaxed">
            Save Big on Your Favorite Brands
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductListingBanner;

