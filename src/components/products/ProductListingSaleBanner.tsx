"use client";

import Image from "next/image";

const ProductListingSaleBanner = () => {

  return (
    <section
      className="w-full py-6 sm:py-8 md:py-10 lg:py-12 relative overflow-hidden bg-gray-900 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] rounded-[6px]"
      style={{
        backgroundImage: "url('/assets/images/banner/product-list-sale-banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative h-full w-full flex items-center justify-center md:justify-start px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Text Content */}
        <div className="text-left flex flex-col items-start justify-start w-full max-w-2xl md:max-w-md lg:max-w-lg">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight sm:leading-snug md:leading-normal">
            Wine Sale - 15% off <br /> Off All Bottles
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white leading-relaxed mb-4 sm:mb-5 md:mb-6">
            Sed ut perspiciatis unde omnis iste natus ut
            perspic iatis unde omnis iste.
          </p>
          <button className="bg-white text-[#1D1D1D] px-6 sm:px-8 md:px-10 py-2 sm:py-2.5 md:py-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base md:text-lg">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductListingSaleBanner;

