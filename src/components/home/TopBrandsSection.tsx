"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { proxyImageUrl } from "@/lib/utils/image";
import "swiper/css";
import "swiper/css/free-mode";
import type { PopularBrand } from "@/lib/api/categories";

interface Props {
  brands: PopularBrand[];
}

const TopBrandsSection = ({ brands }: Props) => {
  if (brands.length === 0) return null;

  return (
    <section className="mb-8 md:mb-12 lg:mb-16 overflow-x-hidden overflow-y-hidden">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1D1D1D] mb-4 md:mb-6 lg:mb-8 px-1">
        Top Brand for you
      </h2>
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        spaceBetween={12}
        slidesPerView="auto"
        breakpoints={{
          640:  { spaceBetween: 16 },
          768:  { spaceBetween: 24 },
          1024: { spaceBetween: 32 },
          1280: { spaceBetween: 32 },
        }}
        className="!overflow-visible"
      >
        {brands.map((brand) => (
          <SwiperSlide key={brand.id} className="!w-auto">
            <div className="flex flex-col items-center gap-1.5 md:gap-2 cursor-pointer group active:scale-95 md:hover:scale-105 transition-transform duration-300">
              <div className="rounded-full w-[190px] h-[190px] px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 lg:py-2.5 bg-gray-100 flex items-center justify-center group-active:bg-gray-200 md:group-hover:bg-gray-200 transition-colors duration-300 shadow-md overflow-hidden">
                <img
                  src={proxyImageUrl(brand.image_full_path)}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-[#1D1D1D] text-center whitespace-nowrap">
                {brand.name}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TopBrandsSection;
