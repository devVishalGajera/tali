"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/modals/CartProvider";
import { useLocation } from "@/components/modals/LocationProvider";
import WishlistButton from "@/components/shared/WishlistButton";

interface Props {
  product: {
    id: number;
    name: string;
    price: string;
    priceValue: number;
    image: string;
    size?: string;
    store_product_volume_id?: number;
  };
  initialWishlist?: boolean;
}

export default function ProductCardActions({ product, initialWishlist = false }: Props) {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { purchaseAllow } = useLocation();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addedToCart) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    addToCart({ ...product, store_product_volume_id: product.store_product_volume_id, quantity: 1 });
  };

  return (
    <>
      <WishlistButton
        productId={product.id}
        storeProductVolumeId={product.store_product_volume_id}
        initialWishlisted={initialWishlist}
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
    </>
  );
}
