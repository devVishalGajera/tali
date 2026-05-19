"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWishlist } from "@/components/modals/WishlistProvider";
import { addToWishlistApi } from "@/lib/api/wishlist";
import { proxyImageUrl } from "@/lib/utils/image";

interface Props {
  productId: number;
  storeProductVolumeId: number | null | undefined;
  initialWishlisted?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  /* Optional extra info to show in the drawer after adding */
  productName?: string;
  productPrice?: string;
  productImage?: string;
  productVolume?: string;
}

const sizes = {
  sm: { icon: 16, container: "w-7 h-7" },
  md: { icon: 20, container: "w-9 h-9" },
  lg: { icon: 24, container: "w-11 h-11" },
};

export default function WishlistButton({
  productId,
  storeProductVolumeId,
  initialWishlisted = false,
  size = "md",
  className = "",
  productName,
  productPrice,
  productImage,
  productVolume,
}: Props) {
  const { isAuthenticated, token } = useAuth();
  const { addItem, removeItem, isWishlisted } = useWishlist();

  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isWishlisted(productId)) setWishlisted(true);
  }, [productId, isWishlisted]);

  const { icon: iconSize, container } = sizes[size];

  const buildItem = () => {
    const priceValue = parseFloat(productPrice?.replace(/[^0-9.]/g, "") ?? "0") || 0;
    return {
      productId,
      storeProductVolumeId: storeProductVolumeId!,
      name: productName ?? "",
      price: productPrice ?? "",
      priceValue,
      image: proxyImageUrl(productImage ?? ""),
      volume: productVolume ?? "",
    };
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!storeProductVolumeId) return;

    const next = !wishlisted;
    setWishlisted(next);

    if (!isAuthenticated || !token) {
      if (next) addItem(buildItem());
      else removeItem(productId);
      return;
    }

    setLoading(true);
    try {
      const res = await addToWishlistApi({
        product_id: productId,
        store_product_volume_id: storeProductVolumeId,
        token,
      });

      if (res.code !== 1) {
        setWishlisted(!next);
      } else if (next) {
        addItem(buildItem());
      } else {
        removeItem(productId);
      }
    } catch {
      setWishlisted(!next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`${container} flex items-center justify-center rounded-full transition-all ${
        wishlisted
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white text-gray-400 hover:text-red-400 hover:bg-red-50 border border-gray-200"
      } ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={wishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform ${loading ? "" : "group-hover:scale-110"}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  );
}

