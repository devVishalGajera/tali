"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import StarRating from "@/components/shared/StarRating";
import { useCart } from "@/components/modals/CartProvider";

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
}

interface ProductCardProps {
  product: ProductCardItem;
  linkTo?: string;
}


const CardInner = ({
  product,
  addedToCart,
  onAddToCart,
}: {
  product: ProductCardItem;
  addedToCart: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
}) => (
  <div className="bg-white transition-shadow duration-300 overflow-visible w-full max-w-[200px] md:max-w-[227px] rounded-[17.1px] border border-[#F0F0F0] shadow-[0px_8.55px_8.55px_0px_#EAE0DA4D,0px_0px_0px_1.07px_#5757571A] md:hover:shadow-lg">
    <div className="relative p-3 w-full h-[240px] flex items-end justify-between overflow-visible cursor-pointer">
      <div className="h-full -top-12 relative flex-1">
        <img src={product.image} alt={product.name} className="max-w-[104px] h-full object-contain" />
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
        <div className="flex flex-col items-center gap-[15px]">
          <span className="font-graphik font-medium text-[26px] leading-[39.49px] text-[#1E1E1E] mb-1">{product.rating}</span>
          <div className="flex items-center gap-0.5 mb-1"><StarRating score={product.rating} /></div>
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
      <h3 className="font-graphik font-normal text-[14px] text-[#1D1D1D] w-full text-left mb-0">{product.name}</h3>
      <button
        onClick={onAddToCart}
        className={`max-w-[125px] w-full py-2.5 px-4 rounded-full transition-colors duration-300 flex items-center justify-center gap-2 border-[0.77px] border-[#696969] z-20 relative ${
          addedToCart ? "bg-gray-200 text-gray-700 cursor-default" : "bg-white active:bg-gray-50 text-gray-700"
        }`}
      >
        {!addedToCart && (
          <Image src="/assets/icons/shopping_cart.svg" alt="Cart" width={16} height={16} className="w-4 h-4" />
        )}
        <span className="font-graphik font-medium text-[9.24px]">{addedToCart ? "Added" : "Add To Card"}</span>
      </button>
    </div>
  </div>
);

const ProductCard = ({ product, linkTo }: ProductCardProps) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedToCart(true);

    const priceValue =
      product.priceValue ??
      (Number(product.price.replace(/[₹,\s]/g, "")) || 0);

    addToCart({
      id:         product.id,
      name:       product.name,
      price:      product.price,
      priceValue,
      image:      product.image,
      size:       product.size,
      quantity:   1,
    });
  };

  if (linkTo) {
    return (
      <Link href={linkTo} className="block">
        <CardInner product={product} addedToCart={addedToCart} onAddToCart={handleAddToCart} />
      </Link>
    );
  }

  return <CardInner product={product} addedToCart={addedToCart} onAddToCart={handleAddToCart} />;
};

export default ProductCard;
