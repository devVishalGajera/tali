"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

const cities = [
  { name: "Mumbai",     image: "https://picsum.photos/seed/mumbai/200/160" },
  { name: "Bangalore",  image: "https://picsum.photos/seed/bangalore/200/160" },
  { name: "Kolkata",    image: "https://picsum.photos/seed/kolkata/200/160" },
  { name: "Pune",       image: "https://picsum.photos/seed/pune/200/160" },
  { name: "Delhi",      image: "https://picsum.photos/seed/delhi/200/160" },
  { name: "Punjab",     image: "https://picsum.photos/seed/punjab/200/160" },
  { name: "Chennai",    image: "https://picsum.photos/seed/chennai/200/160" },
  { name: "Hyderabad",  image: "https://picsum.photos/seed/hyderabad/200/160" },
  { name: "Jaipur",     image: "https://picsum.photos/seed/jaipur/200/160" },
  { name: "Ahmedabad",  image: "https://picsum.photos/seed/ahmedabad/200/160" },
  { name: "Goa",        image: "https://picsum.photos/seed/goa/200/160" },
  { name: "Surat",      image: "https://picsum.photos/seed/surat/200/160" },
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
