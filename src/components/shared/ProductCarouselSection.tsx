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
    <section className="mb-6 md:mb-10">
      <div className={`mb-4 px-1 ${centerTitle ? "text-center" : ""}`}>
        <h2 className="text-base md:text-xl font-bold text-[#1D1D1D] mb-1">{title}</h2>
        {subtitle && (
          <p className={`text-xs text-gray-600 leading-relaxed ${centerTitle ? "mx-auto" : ""} max-w-2xl`}>{subtitle}</p>
        )}
      </div>
      <div className="overflow-x-hidden -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 mt-3 pt-14 pb-8">
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
