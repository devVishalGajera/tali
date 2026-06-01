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
    <div className="relative px-3 pt-3 pb-3 w-full flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-2 md:h-[210px] overflow-hidden cursor-pointer">
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

      <div className="relative w-full md:flex-1 md:min-w-0 flex items-center justify-center min-h-[150px] sm:min-h-[165px] md:min-h-0 md:h-full pr-8 md:pr-0">
        <img
          src={proxyImageUrl(product.image)}
          alt={product.name}
          className="w-auto h-auto max-h-[145px] sm:max-h-[165px] md:max-h-[200px] max-w-full md:max-w-[160px] object-contain"
        />
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 w-full md:w-auto shrink-0 z-10 md:-translate-y-1.5 pt-1 md:pt-0 border-t border-[#F5F5F5] md:border-0">
        <div className="flex flex-col items-start md:items-center gap-0.5 min-w-0">
          <span className="font-graphik font-medium text-sm sm:text-base leading-tight text-[#1E1E1E]">
            {product.rating > 0 ? product.rating : "5.0"}
          </span>
          <StarRating score={product.rating} size="sm" className="scale-90 sm:scale-100 origin-left md:origin-center" />
          <span className="font-graphik font-normal text-[10px] sm:text-[11px] leading-snug text-[#1E1E1E] md:text-center whitespace-nowrap">
            {product.ratingCount > 0 ? `${product.ratingCount} Rating` : ""}
          </span>
        </div>
        <span className="bg-[#00845F] text-white font-graphik font-semibold py-1.5 px-3 sm:px-3.5 whitespace-nowrap rounded-full text-center text-xs sm:text-sm leading-tight shrink-0">
          {product.price}
        </span>
      </div>
    </div>
  );

  return (
    <div
      className={`bg-white transition-all duration-300 overflow-hidden w-full rounded-[17.1px] border border-[#F0F0F0] shadow-[0px_8.55px_8.55px_0px_#EAE0DA4D,0px_0px_0px_1.07px_#5757571A] md:hover:shadow-lg md:hover:scale-105 active:scale-95 flex flex-col h-full ${
        fullWidth ? "" : "max-w-none md:max-w-[250px]"
      }`}
    >
      {linkTo ? (
        <Link href={linkTo} className="block">
          {imageBlock}
        </Link>
      ) : (
        imageBlock
      )}

      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1 md:pt-2 md:mt-2 flex-1 flex items-end justify-between gap-2 min-h-[48px]">
        {linkTo ? (
          <Link href={linkTo} className="flex-1 min-w-0">
            <h3 className="font-graphik font-bold text-[12px] sm:text-[13px] md:text-[14px] text-[#1D1D1D] text-left line-clamp-2 leading-snug sm:leading-[1.4] hover:text-[#006B4D] transition-colors uppercase">
              {product.name}
            </h3>
          </Link>
        ) : (
          <h3 className="font-graphik font-bold text-[12px] sm:text-[13px] md:text-[14px] text-[#1D1D1D] text-left line-clamp-2 leading-snug sm:leading-[1.4] flex-1 min-w-0 uppercase">
            {product.name}
          </h3>
        )}
        {purchaseAllow && (
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all shadow-sm active:scale-95 ${addedToCart
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
