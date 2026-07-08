"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import StoresShopCard from "./StoresShopCard";
import { talliShopItem } from "@/lib/store/talli-store";

const moreShops = [talliShopItem];

const StoresMoreShops = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
    <Swiper
      modules={[FreeMode]}
      freeMode={true}
      slidesPerView="auto"
      spaceBetween={16}
      breakpoints={{ 640: { spaceBetween: 20 }, 1024: { spaceBetween: 24 } }}
    >
      {moreShops.map((shop) => (
        <SwiperSlide key={shop.id} className="!w-[200px] sm:!w-[230px]">
          <StoresShopCard shop={shop} actionType="whatsapp" />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default StoresMoreShops;
