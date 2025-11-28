"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

const ProductsSection = () => {
  const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({});

  const products = [
    {
      id: 1,
      name: "Corona Extra Beer",
      price: "₹200.00",
      rating: 4.2,
      ratingCount: 1250,
      image: "/assets/images/bottles/corona.png",
      isNewArrival: true,
    },
    {
      id: 2,
      name: "Corona Extra Beer",
      price: "₹200.00",
      rating: 4.2,
      ratingCount: 1250,
      image: "/assets/images/bottles/corona.png",
      isNewArrival: false,
    },
    {
      id: 3,
      name: "Corona Extra Beer",
      price: "₹200.00",
      rating: 4.2,
      ratingCount: 1250,
      image: "/assets/images/bottles/corona.png",
      isNewArrival: false,
    },
    {
      id: 4,
      name: "Corona Extra Beer",
      price: "₹200.00",
      rating: 4.2,
      ratingCount: 1250,
      image: "/assets/images/bottles/corona.png",
      isNewArrival: false,
    },
    {
      id: 5,
      name: "Corona Extra Beer",
      price: "₹200.00",
      rating: 4.2,
      ratingCount: 1250,
      image: "/assets/images/bottles/corona.png",
      isNewArrival: false,
    },
    {
      id: 6,
      name: "Corona Extra Beer",
      price: "₹200.00",
      rating: 4.2,
      ratingCount: 1250,
      image: "/assets/images/bottles/corona.png",
      isNewArrival: false,
    },
    {
      id: 7,
      name: "Corona Extra Beer",
      price: "₹200.00",
      rating: 4.2,
      ratingCount: 1250,
      image: "/assets/images/bottles/corona.png",
      isNewArrival: false,
    },
  ];

  const handleAddToCart = (productId: number) => {
    setAddedToCart((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        {hasHalfStar && (
          <div className="relative w-4 h-4">
            <svg
              className="w-4 h-4 text-gray-300 absolute"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <svg
              className="w-4 h-4 text-yellow-400 absolute"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="w-4 h-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="mb-8 md:mb-12 lg:mb-16 overflow-x-hidden">
      <div className="mb-4 mb-12 px-1">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1D1D1D] mb-2">
          Just for you, Talli Drinks
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl leading-relaxed">
          A weekly set of wines you didn&apos;t know you wanted. Based on your taste,
          like-minded users, and the magic of deep Vivino knowledge.
        </p>
      </div>
      {/* Swiper for all screen sizes */}
      <div className="overflow-x-hidden overflow-y-hidden -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 mt-5 py-8">
        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          spaceBetween={16}
          slidesPerView="auto"
          breakpoints={{
            640: {
              spaceBetween: 20,
            },
            768: {
              spaceBetween: 24,
            },
            1024: {
              spaceBetween: 32,
            },
          }}
          className="!overflow-visible"
        >
          {products.map((product) => (
            <SwiperSlide
              key={product.id}
              className="!w-[200px] md:!w-[227px]"
            >
              <Link href={`/products/${product.id}`} className="block">
                <div className="bg-white transition-shadow duration-300 overflow-visible w-full max-w-[200px] md:max-w-[227px] rounded-[17.1px] border border-[#F0F0F0] shadow-[0px_8.55px_8.55px_0px_#EAE0DA4D,0px_0px_0px_1.07px_#5757571A] md:hover:shadow-lg">
                  <div className="relative p-3 w-full h-[240px] flex items-end justify-between overflow-visible cursor-pointer">
                    <div className="h-full -top-12 relative flex-1">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-[104px] h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-end gap-3 z-10">
                      {product.isNewArrival && (
                        <div className="relative top-2 w-[46.18px] h-[46.18px]">
                          <div className="absolute inset-0 rounded-full bg-[#1E1E1E] opacity-50 border border-[#808080]" />
                          {/* Inner circle */}
                          <div className="absolute inset-[2.5%] rounded-full bg-[#1E1E1E] flex flex-col items-center justify-center">
                            <span className="font-graphik font-normal text-[6.93px] leading-[8.08px] text-center text-[#D5A184]">
                              New
                            </span>
                            <span className="font-graphik font-medium text-[9.24px] leading-[11.55px] text-center text-white">
                              Arrival
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-[15px]">
                        <span className="font-graphik font-medium text-[26px] leading-[39.49px] text-[#1E1E1E] mb-1">
                          {product.rating}
                        </span>
                        <div className="flex items-center gap-0.5 mb-1">
                          {renderStars(product.rating)}
                        </div>
                        <span className="font-graphik font-normal text-[13px] leading-[16.45px] text-center text-[#1E1E1E] whitespace-nowrap mb-2">
                          {product.ratingCount} Rating
                        </span>
                        <button className="bg-[#00845F] active:bg-green-700 text-white font-graphik font-semibold py-2 px-4 transition-colors duration-300 whitespace-nowrap rounded-full text-center text-base leading-[22.42px]">
                          {product.price}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-2 flex items-center justify-center flex-col gap-2 mt-4">
                    <h3 className="font-graphik font-normal text-[14px] text-[#1D1D1D] w-full text-left mb-0">
                      {product.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      className={`max-w-[125px] w-full py-2.5 px-4 rounded-full transition-colors duration-300 flex items-center justify-center gap-2 border-[0.77px] border-[#696969] z-20 relative ${
                        addedToCart[product.id]
                          ? "bg-gray-200 text-gray-700 cursor-default"
                          : "bg-white active:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {!addedToCart[product.id] && (
                        <Image
                          src="/assets/icons/shopping_cart.svg"
                          alt="Cart"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                      )}
                      <span className="font-graphik font-medium text-[9.24px]">
                        {addedToCart[product.id] ? "Added" : "Add To Card"}
                      </span>
                    </button>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductsSection;

