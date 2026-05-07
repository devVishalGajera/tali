"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import StarRating from "@/components/shared/StarRating";
import { useCart } from "@/components/modals/CartProvider";
import { useLocation } from "@/components/modals/LocationProvider";
import { proxyImageUrl } from "@/lib/utils/image";
import WishlistButton from "@/components/shared/WishlistButton";

export interface ProductCardItem {
  id: number;
  name: string;
  price: string;
  priceValue?: number;
  size?: string;
  rating: number;
  ratingCount: number;
  image: string;
  isNewArrival?: boolean;
  store_product_volume_id?: number;
  isWishlist?: boolean;
}

interface ProductCardProps {
  product: ProductCardItem;
  linkTo?: string;
}

const ProductCard = ({ product, linkTo }: ProductCardProps) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { purchaseAllow } = useLocation();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addedToCart) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);

    const priceValue =
      product.priceValue ??
      (Number(product.price.replace(/[₹,\s]/g, "")) || 0);

    addToCart({
      id: product.id,
      store_product_volume_id: product.store_product_volume_id,
      name: product.name,
      price: product.price,
      priceValue,
      image: product.image,
      size: product.size,
      quantity: 1,
    });
  };

  const inner = (
    <div className="bg-white transition-all duration-300 overflow-visible w-full max-w-[200px] md:max-w-[227px] rounded-[17.1px] border border-[#F0F0F0] shadow-[0px_8.55px_8.55px_0px_#EAE0DA4D,0px_0px_0px_1.07px_#5757571A] md:hover:shadow-lg md:hover:scale-105 active:scale-95">
      {/* Image area */}
      <div className="relative p-3 w-full h-[240px] flex items-end justify-between overflow-visible cursor-pointer">

        {/* Cart + Wishlist — absolutely positioned top-right */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1.5">
          <WishlistButton
            productId={product.id}
            storeProductVolumeId={product.store_product_volume_id}
            initialWishlisted={product.isWishlist}
            size="sm"
            productName={product.name}
            productPrice={product.price}
            productImage={product.image}
            productVolume={product.size}
          />
          {purchaseAllow && (
            <button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors border border-gray-200 ${
                addedToCart
                  ? "bg-[#00845F] border-[#00845F]"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {addedToCart ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <Image src="/assets/icons/shopping_cart.svg" alt="Cart" width={13} height={13} className="w-[13px] h-[13px]" />
              )}
            </button>
          )}
        </div>

        <div className="h-full -top-12 relative flex-1">
          <img
            src={proxyImageUrl(product.image)}
            alt={product.name}
            className="max-w-[104px] h-full object-contain"
          />
        </div>
        <div className="flex flex-col items-end gap-3 z-10">
          {product.isNewArrival && (
            <div className="relative top-2 w-[46.18px] h-[46.18px]">
              <div className="absolute inset-0 rounded-full bg-[#1E1E1E] opacity-50 border border-[#808080]" />
              <div className="absolute inset-[2.5%] rounded-full bg-[#1E1E1E] flex flex-col items-center justify-center">
                <span className="font-graphik font-normal text-[6.93px] leading-[8.08px] text-center text-[#D5A184]">New</span>
                <span className="font-graphik font-medium text-[9.24px] leading-[11.55px] text-center text-white">Arrival</span>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center gap-[10px]">
            <span className="font-graphik font-medium text-base leading-tight text-[#1E1E1E] mb-1">{product.rating}</span>
            <div className="flex items-center gap-0.5 mb-1"><StarRating score={product.rating} /></div>
            <span className="font-graphik font-normal text-[11px] leading-[14px] text-center text-[#1E1E1E] whitespace-nowrap mb-1">
              {product.ratingCount} Rating
            </span>
            <button className="bg-[#00845F] active:bg-green-700 text-white font-graphik font-semibold py-1 px-3 transition-colors duration-300 whitespace-nowrap rounded-full text-center text-sm leading-[18px]">
              {product.price}
            </button>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="px-4 pb-4 pt-2 mt-4">
        <h3 className="font-graphik font-normal text-[14px] text-[#1D1D1D] w-full text-left">
          {product.name}
        </h3>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
};

export default ProductCard;
