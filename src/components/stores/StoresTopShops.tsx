"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import StoresShopCard, { ShopItem } from "./StoresShopCard";

const topShops: ShopItem[] = [
  { id: 1,  name: "Bella Vista Resort",   address: "Meera Road - Mumbai",      rating: 4.5, image: "/assets/images/shops/shop-additional.png", logo: "/assets/images/shops/shop-additional.png" },
  { id: 2,  name: "The Wine Cellar",      address: "Bandra West - Mumbai",     rating: 4.2, image: "/assets/images/shops/shop-additional.png", logo: "/assets/images/shops/shop-additional.png" },
  { id: 3,  name: "Grape & Grain",        address: "Koramangala - Bangalore",  rating: 4.0, image: "/assets/images/shops/shop-additional.png", logo: "/assets/images/shops/shop-additional.png" },
  { id: 4,  name: "The Spirits House",    address: "Connaught Place - Delhi",  rating: 4.3, image: "/assets/images/shops/shop-additional.png", logo: "/assets/images/shops/shop-additional.png" },
  { id: 5,  name: "Vino & Co.",           address: "Park Street - Kolkata",    rating: 3.9, image: "/assets/images/shops/shop-additional.png", logo: "/assets/images/shops/shop-additional.png" },
  { id: 6,  name: "Mumbai Wine Shop",     address: "Juhu - Mumbai",            rating: 4.1, image: "/assets/images/shops/shop-additional.png", logo: "/assets/images/shops/shop-additional.png" },
  { id: 7,  name: "Cheers Bar & Store",   address: "Indiranagar - Bangalore",  rating: 4.4, image: "/assets/images/shops/shop-additional.png", logo: "/assets/images/shops/shop-additional.png" },
  { id: 8,  name: "The Malt Room",        address: "Kalyani Nagar - Pune",     rating: 4.0, image: "/assets/images/shops/shop-additional.png", logo: "/assets/images/shops/shop-additional.png" },
  { id: 9,  name: "Liquor Vault",         address: "Powai - Mumbai",           rating: 3.8, image: "/assets/images/shops/shop-additional.png", logo: "/assets/images/shops/shop-additional.png" },
  { id: 10, name: "Golden Barrel",        address: "Hitech City - Hyderabad",  rating: 4.2, image: "/assets/images/shops/shop-additional.png", logo: "/assets/images/shops/shop-additional.png" },
];

const StoresTopShops = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
    <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1D] mb-1">Top 10 Shop In Mumbai</h2>
    <p className="text-sm text-[#1D1D1D80] mb-6">
      Explore curated lists of top restaurants, cafes, pubs, and bars in Mumbai, based on trends
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
