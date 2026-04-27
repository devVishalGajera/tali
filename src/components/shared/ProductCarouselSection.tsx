"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import ProductCard, { ProductCardItem } from "./ProductCard";

interface ProductCarouselSectionProps {
  title: string;
  subtitle?: string;
  products: ProductCardItem[];
  linkProducts?: boolean;
  centerTitle?: boolean;
}

const ProductCarouselSection = ({
  title,
  subtitle,
  products,
  linkProducts = true,
  centerTitle = false,
}: ProductCarouselSectionProps) => {
  return (
    <section className="mb-8 md:mb-12 lg:mb-16 overflow-x-hidden">
      <div className={`mb-12 px-1 ${centerTitle ? "text-center" : ""}`}>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1D1D1D] mb-2">{title}</h2>
        {subtitle && (
          <p className={`text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed ${centerTitle ? "mx-auto" : ""} max-w-2xl`}>{subtitle}</p>
        )}
      </div>
      <div className="overflow-x-hidden overflow-y-hidden -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 mt-5 py-8">
        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          spaceBetween={16}
          slidesPerView="auto"
          breakpoints={{
            640: { spaceBetween: 20 },
            768: { spaceBetween: 24 },
            1024: { spaceBetween: 32 },
          }}
          className="!overflow-visible"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="!w-[200px] md:!w-[227px]">
              <ProductCard
                product={product}
                linkTo={linkProducts ? `/products/${product.id}` : undefined}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductCarouselSection;
