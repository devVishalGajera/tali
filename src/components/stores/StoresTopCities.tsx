"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

const CITY_IMAGE = "/assets/images/shops/shop-additional.png";

const cities = [
  { name: "Mumbai", image: CITY_IMAGE },
  { name: "Bangalore", image: CITY_IMAGE },
  { name: "Kolkata", image: CITY_IMAGE },
  { name: "Pune", image: CITY_IMAGE },
  { name: "Delhi", image: CITY_IMAGE },
  { name: "Punjab", image: CITY_IMAGE },
  { name: "Chennai", image: CITY_IMAGE },
  { name: "Hyderabad", image: CITY_IMAGE },
  { name: "Jaipur", image: CITY_IMAGE },
  { name: "Ahmedabad", image: CITY_IMAGE },
  { name: "Goa", image: CITY_IMAGE },
  { name: "Surat", image: CITY_IMAGE },
];

const StoresTopCities = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
    <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1D] mb-6">Explore Top Cities</h2>
    <Swiper
      modules={[FreeMode]}
      freeMode={true}
      slidesPerView="auto"
      spaceBetween={12}
      breakpoints={{ 640: { spaceBetween: 16 }, 1024: { spaceBetween: 20 } }}
    >
      {cities.map((city) => (
        <SwiperSlide key={city.name} className="!w-[120px] sm:!w-[150px]">
          <button className="flex flex-col items-center gap-2 group cursor-grab active:cursor-grabbing w-full">
            <div className="w-full aspect-square overflow-hidden rounded-lg">
              <img
                src={city.image}
                alt={city.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-[#1D1D1D] group-hover:text-[#FF5C00] transition-colors">
              {city.name}
            </span>
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default StoresTopCities;
