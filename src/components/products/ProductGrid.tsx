"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  ratingCount: number;
  image: string;
}

const ProductGrid = () => {
  const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({});
  const [wishlist, setWishlist] = useState<{ [key: number]: boolean }>({});

  const products: Product[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: "Corona Extra Beer",
    price: "₹200.00",
    rating: 4.2,
    ratingCount: 120 + i * 10,
    image: "/assets/images/bottles/corona.png",
  }));

  const handleAddToCart = (productId: number) => {
    setAddedToCart((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleWishlist = (productId: number) => {
    setWishlist((prev) => ({
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
    <div className="flex-1">
      {/* Discover Section + Product Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-12 gap-y-10 mb-6">
        {/* Discover the 2025 collection banner - First Grid Item */}
        <div className="bg-white transition-shadow duration-300 overflow-hidden rounded-[17.1px] border border-[#F0F0F0] shadow-[0px_8.55px_8.55px_0px_#EAE0DA4D,0px_0px_0px_1.07px_#5757571A] hover:shadow-lg">
          <div 
            className="relative w-full h-full flex flex-col justify-center items-start px-6 md:px-8 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/product/discover-product.png')",
            }}
          >
            <div className="relative z-10 flex flex-col justify-center items-start h-full">
              <p className="text-sm md:text-base font-medium text-white mb-4 md:mb-6">
                $30-$50 DISCOUNT
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 leading-tight">
                Discover the <br /> 2025 collection
              </h3>
              <button className="bg-white text-black hover:bg-gray-100 px-6 py-2.5 md:px-8 md:py-3 rounded border border-black transition-colors duration-300 font-semibold uppercase">
                SHOP NOW
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid Items */}
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white transition-shadow duration-300 overflow-visible rounded-[17.1px] border border-[#F0F0F0] shadow-[0px_8.55px_8.55px_0px_#EAE0DA4D,0px_0px_0px_1.07px_#5757571A] hover:shadow-lg"
          >
            <Link href={`/products/${product.id}`} className="block">
              <div className="relative p-3 w-full h-[240px] flex items-end justify-between overflow-visible cursor-pointer">
                <div className="h-full -top-12 relative flex-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-[104px] h-full object-contain"
                  />
                </div>
                <div className="flex flex-col items-end gap-3 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleWishlist(product.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-red-50 transition-colors z-20"
                  >
                    <svg
                      className={`w-5 h-5 ${
                        wishlist[product.id] ? "text-red-500 fill-current" : "text-gray-400"
                      }`}
                      fill={wishlist[product.id] ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
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
                    {addedToCart[product.id] ? "Added" : "Add To Cart"}
                  </span>
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

