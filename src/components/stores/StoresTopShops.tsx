"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import StoresShopCard from "./StoresShopCard";
import { talliShopItem } from "@/lib/store/talli-store";

const topShops = [talliShopItem];

const StoresTopShops = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
    <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1D] mb-1">Our Shop in Thane</h2>
    <p className="text-sm text-[#1D1D1D80] mb-6">
      Visit Talli Beer &amp; Wines in Hiranandani Meadows — beer, wine, and spirits with express delivery.
    </p>
    <div className="pb-6 border-b border-[#F0F0F0]">
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        slidesPerView="auto"
        spaceBetween={16}
        breakpoints={{ 640: { spaceBetween: 20 }, 1024: { spaceBetween: 24 } }}
      >
        {topShops.map((shop) => (
          <SwiperSlide key={shop.id} className="!w-[200px] sm:!w-[230px]">
            <StoresShopCard shop={shop} actionType="map" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default StoresTopShops;
