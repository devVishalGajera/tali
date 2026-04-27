"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart }  from "@/components/modals/CartProvider";

interface Props {
  product: {
    id:         number;
    name:       string;
    price:      string;
    priceValue: number;
    image:      string;
    size?:      string;
  };
  initialWishlist?: boolean;
  /** When true, only the Add-to-cart button is rendered (no wishlist button) */
  cartOnly?: boolean;
}

export default function ProductCardActions({ product, initialWishlist = false, cartOnly = false }: Props) {
  const [wishlisted, setWishlisted] = useState(initialWishlist);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedToCart(true);
    addToCart({ ...product, quantity: 1 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((p) => !p);
  };

  if (cartOnly) {
    return (
      <button
        onClick={handleAddToCart}
        className={`max-w-[125px] w-full py-2.5 px-4 rounded-full transition-colors duration-300 flex items-center justify-center gap-2 border-[0.77px] border-[#696969] z-20 relative ${
          addedToCart
            ? "bg-gray-200 text-gray-700 cursor-default"
            : "bg-white active:bg-gray-50 text-gray-700"
        }`}
      >
        {!addedToCart && (
          <Image src="/assets/icons/shopping_cart.svg" alt="" width={16} height={16} className="w-4 h-4" />
        )}
        <span className="font-graphik font-medium text-[9.24px]">
          {addedToCart ? "Added" : "Add To Cart"}
        </span>
      </button>
    );
  }

  return (
    <>
      {/* Wishlist button — top-right of image area */}
      <button
        onClick={handleWishlist}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-red-50 transition-colors z-20"
      >
        <svg
          className={`w-5 h-5 ${wishlisted ? "text-red-500 fill-current" : "text-gray-400"}`}
          fill={wishlisted ? "currentColor" : "none"}
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

      {/* Add to cart button — bottom of card */}
      <button
        onClick={handleAddToCart}
        className={`max-w-[125px] w-full py-2.5 px-4 rounded-full transition-colors duration-300 flex items-center justify-center gap-2 border-[0.77px] border-[#696969] z-20 relative ${
          addedToCart
            ? "bg-gray-200 text-gray-700 cursor-default"
            : "bg-white active:bg-gray-50 text-gray-700"
        }`}
      >
        {!addedToCart && (
          <Image src="/assets/icons/shopping_cart.svg" alt="" width={16} height={16} className="w-4 h-4" />
        )}
        <span className="font-graphik font-medium text-[9.24px]">
          {addedToCart ? "Added" : "Add To Cart"}
        </span>
      </button>
    </>
  );
}
