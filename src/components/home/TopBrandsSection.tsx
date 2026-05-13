"use client";

import Link from "next/link";
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
    <section className="mb-6 md:mb-10 overflow-x-hidden overflow-y-hidden">
      <h2 className="text-base md:text-xl font-bold text-[#1D1D1D] mb-3 md:mb-5 px-1">
        Top Brand for you
      </h2>
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        spaceBetween={12}
        slidesPerView="auto"
        breakpoints={{
          640:  { spaceBetween: 16 },
          768:  { spaceBetween: 20 },
          1024: { spaceBetween: 24 },
          1280: { spaceBetween: 24 },
        }}
        className="!overflow-visible"
        preventClicks={false}
        preventClicksPropagation={false}
      >
        {brands?.map((brand) => (
          <SwiperSlide key={brand.id} className="!w-auto">
            <Link
              href={`/products?brand_id=${brand.id}`}
              className="flex flex-col items-center gap-1.5 group active:scale-95 md:hover:scale-105 transition-transform duration-300"
            >
              <div className="rounded-full w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-[130px] md:h-[130px] bg-gray-100 flex items-center justify-center group-active:bg-gray-200 md:group-hover:bg-gray-200 transition-colors duration-300 shadow-md overflow-hidden">
                <img
                  src={proxyImageUrl(brand.image_full_path)}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-[11px] sm:text-xs md:text-sm font-medium text-[#1D1D1D] text-center whitespace-nowrap">
                {brand.name}
              </span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TopBrandsSection;
