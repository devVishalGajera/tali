"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import StoresShopCard, { ShopItem } from "./StoresShopCard";

const moreShops: ShopItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 10,
  name: "Bella Vista Resort",
  address: "Meera Road - Mumbai",
  rating: 3.8,
  image: "/assets/images/shops/shop-additional.png",
  logo: "/assets/images/shops/shop-additional.png",
}));

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
