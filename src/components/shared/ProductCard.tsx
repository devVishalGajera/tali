"use client";

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
  /** Fill parent width (e.g. product listing grid). Default: fixed carousel width. */
  fullWidth?: boolean;
}

const ProductCard = ({ product, linkTo, fullWidth = false }: ProductCardProps) => {
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
      requestType: "people_also_added",
    });
  };

  const imageBlock = (
    <div className="relative p-3 w-full h-[200px] flex items-end justify-between overflow-hidden cursor-pointer">
      {/* overflow-visible — allowed bottle to extend outside card */}
      <div className="absolute top-3 right-2 z-20" onClick={(e) => e.stopPropagation()}>
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
      </div>

      {/* Pop-out layout: h-full -top-12 pulls image above card top */}
      {/* <div className="h-full -top-12 relative flex-1"> */}
      <div className="relative flex-1 flex items-end justify-center h-full max-h-[200px]">
        <img
          src={proxyImageUrl(product.image)}
          alt={product.name}
          className="max-w-[104px] max-h-full w-auto object-contain"
        />
      </div>
      <div className="flex flex-col items-end gap-3 z-10 -translate-y-1.5">
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
          <span className="font-graphik font-medium text-base leading-tight text-[#1E1E1E] mb-1">
            {product.rating > 0 ? product.rating : "5.0"}
          </span>
          <div className="flex items-center gap-0.5 mb-1"><StarRating score={product.rating} /></div>
          <span className="font-graphik font-normal text-[11px] leading-[14px] text-center text-[#1E1E1E] whitespace-nowrap mb-1">
            {product.ratingCount > 0 ? `${product.ratingCount} Rating` : ""}
          </span>
          <span className="bg-[#00845F] text-white font-graphik font-semibold py-1 px-3 whitespace-nowrap rounded-full text-center text-sm leading-[18px]">
            {product.price}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`bg-white transition-all duration-300 overflow-hidden w-full rounded-[17.1px] border border-[#F0F0F0] shadow-[0px_8.55px_8.55px_0px_#EAE0DA4D,0px_0px_0px_1.07px_#5757571A] md:hover:shadow-lg md:hover:scale-105 active:scale-95 flex flex-col h-full ${
        fullWidth ? "" : "max-w-[200px] md:max-w-[227px]"
      }`}
    >
      {/* overflow-visible — allowed product image to overflow card border */}
      {linkTo ? (
        <Link href={linkTo} className="block">
          {imageBlock}
        </Link>
      ) : (
        imageBlock
      )}

      <div className="px-4 pb-4 pt-2 mt-4 flex-1 flex items-center justify-between gap-2">
        {linkTo ? (
          <Link href={linkTo} className="flex-1 min-w-0">
            <h3 className="font-graphik font-bold text-[14px] text-[#1D1D1D] text-left line-clamp-2 leading-[1.4] hover:text-[#006B4D] transition-colors">
              {product.name}
            </h3>
          </Link>
        ) : (
          <h3 className="font-graphik font-bold text-[14px] text-[#1D1D1D] text-left line-clamp-2 leading-[1.4] flex-1 min-w-0">
            {product.name}
          </h3>
        )}
        {purchaseAllow && (
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all shadow-sm active:scale-95 ${addedToCart
              ? "bg-[#00845F]"
              : "bg-[#006B4D] hover:bg-[#005a3f]"
              }`}
          >
            {addedToCart ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" fill="white" stroke="none" />
                <circle cx="20" cy="21" r="1" fill="white" stroke="none" />
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.97-1.67L23 6H6" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};


export default ProductCard;
