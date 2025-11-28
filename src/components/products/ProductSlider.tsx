"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const ProductSlider = () => {
  const slides = [
    {
      id: 1,
      image: "/assets/images/slider/product-slider-1.png",
      alt: "Whiskey Advertisement",
    },
    {
      id: 2,
      image: "/assets/images/slider/product-slider-2.png",
      alt: "Beer Advertisement",
    },
    {
      id: 3,
      image: "/assets/images/slider/product-slider-3.png",
      alt: "Spirit Decanter Advertisement",
    },
    {
      id: 4,
      image: "/assets/images/slider/product-slider-3.png",
      alt: "Spirit Decanter Advertisement",
    },
    {
      id: 5,
      image: "/assets/images/slider/product-slider-3.png",
      alt: "Spirit Decanter Advertisement",
    },
  ];

  return (
    <>
      <div className="overflow-x-hidden overflow-y-hidden mt-5 py-8 relative">
        <Swiper
          modules={[Navigation, Pagination, FreeMode]}
          freeMode={true}
          spaceBetween={16}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: ".swiper-pagination-custom",
            bulletClass: "swiper-pagination-bullet-custom",
            bulletActiveClass: "swiper-pagination-bullet-active-custom",
          }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          breakpoints={{
            768: {
              slidesPerView: "auto",
              spaceBetween: 15,
            },
            1024: {
              spaceBetween: 32,
            },
          }}
          className="!overflow-visible"
        >
          {slides.map((slide) => (
            <SwiperSlide
              key={slide.id}
            >
              <div className="relative w-[calc(100%-32px)] max-w-[280px] mx-auto h-[151px] sm:max-w-[320px] sm:h-[172px] md:w-[320px] md:max-w-none md:mx-0 lg:w-[400px] lg:h-[215px] rounded-[6px] overflow-hidden flex-shrink-0">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width={400}
                  height={215}
                  className="object-cover w-full h-full"
                  priority={slide.id === 1}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <div className="swiper-pagination-custom flex justify-center items-center gap-2 mt-4 sm:mt-6"></div>
        <style jsx global>{`
        .swiper-button-lock {
          display: flex !important;
        }

        .swiper-button-prev-custom,
        .swiper-button-next-custom {
          display: flex !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        .swiper-button-prev-custom.swiper-button-lock,
        .swiper-button-next-custom.swiper-button-lock {
          display: flex !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        .swiper {
          user-select: none !important;
          -webkit-user-select: none !important;
        }

        .swiper-slide {
          width: auto !important;
          flex-shrink: 0 !important;
        }

        .swiper-pagination-custom {
          position: relative !important;
          width: 100% !important;
          bottom: auto !important;
          left: auto !important;
          text-align: center !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .swiper-pagination-bullet-custom {
          width: 10px !important;
          height: 10px !important;
          background: transparent !important;
          border: 1.5px solid #ef4444 !important;
          opacity: 1 !important;
          border-radius: 2px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          display: inline-block !important;
          margin: 0 !important;
          transform: rotate(45deg) !important;
          transform-origin: center !important;
        }

        .swiper-pagination-bullet-active-custom {
          background: #ef4444 !important;
          border-color: #ef4444 !important;
          width: 10px !important;
          height: 10px !important;
          transform: rotate(45deg) !important;
        }
      `}</style>
      </div>

    </>
  );
};

export default ProductSlider;

