"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/modals/CartProvider";
import { useLocation } from "@/components/modals/LocationProvider";
import WishlistButton from "@/components/shared/WishlistButton";
import type { ProductVolume } from "@/lib/api/product-detail";

interface Props {
  productId:   number;
  name:        string;
  description: string;
  abv:         string;
  country:     string;
  volumes:     ProductVolume[];
}

export default function ProductDetailInfo({
  productId,
  name,
  description,
  abv,
  country,
  volumes,
}: Props) {
  const { addToCart } = useCart();
  const { purchaseAllow } = useLocation();

  const defaultVolume = volumes.find((v) => v.price) ?? volumes[0] ?? null;
  const [selectedVolumeId, setSelectedVolumeId] = useState<number | null>(
    defaultVolume?.volume_id ?? null,
  );
  const [quantity, setQuantity]       = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const selectedVolume = volumes.find((v) => v.volume_id === selectedVolumeId) ?? defaultVolume;
  const price          = selectedVolume?.price ? `₹${parseFloat(selectedVolume.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : null;

  const handleAddToCart = () => {
    if (!selectedVolume) return;
    addToCart({
      id:                      productId,
      store_product_volume_id: selectedVolume.store_product_volume_id ?? undefined,
      name,
      price:      price ?? "—",
      priceValue: selectedVolume.price ? parseFloat(selectedVolume.price) : 0,
      image:      "/assets/images/bottles/single-bottle.png",
      size:       selectedVolume.volume || undefined,
      quantity:   quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="flex flex-col w-full min-w-0">
      {/* Title */}
      <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
        {name}
      </h1>

      {/* ABV / country */}
      <p className="text-xs text-gray-600 mb-2">
        {abv ? `[${abv}% Alcohol ABV${country ? ` — ${country}` : ""}]` : country || ""}
      </p>

      {/* Price */}
      <div className="mb-3">
        <span className="text-2xl font-bold text-gray-900">
          {price ?? "—"}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-[#1D1D1D80] leading-relaxed mb-3">
          {description}
        </p>
      )}

      {/* Volume sizes */}
      {volumes.length > 0 && (
        <div className="mb-3">
          <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">
            Sizes:
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {volumes.map((v) => (
              <button
                key={v.volume_id}
                onClick={() => setSelectedVolumeId(v.volume_id)}
                className={`px-1.5 py-1 rounded border text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedVolumeId === v.volume_id
                    ? "bg-[#006B4D] text-white border-[#006B4D]"
                    : "bg-white text-[#1D1D1D] border-[#1D1D1D] hover:border-gray-400"
                }`}
              >
                {v.volume}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product info */}
      <div className="mb-3">
        <div className="space-y-1">
          {country && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-semibold text-gray-900">Place of Origin:</span>
              <span className="text-gray-700">{country}</span>
            </div>
          )}
          {abv && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-semibold text-gray-900">Alcohol ABV:</span>
              <span className="text-gray-700">{abv}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">
          Bottles:
        </label>
        <div className="inline-flex items-center gap-4 border border-[#DFDEDE] rounded-md py-1.5 px-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Image src="/assets/icons/arrow.svg" alt="−" className="rotate-180" width={16} height={16} />
          </button>
          <span className="text-sm font-semibold text-gray-900 min-w-[1.5rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Image src="/assets/icons/arrow.svg" alt="+" width={16} height={16} />
          </button>
        </div>
      </div>

      {/* Add to cart + Wishlist + Social */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {purchaseAllow && (
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all cursor-pointer ${
                addedToCart ? "bg-[#005a3f] text-white" : "bg-[#006B4D] text-white"
              }`}
            >
              {addedToCart ? "Added to Cart ✓" : "Add To Cart"}
            </button>
          )}
          <WishlistButton
            productId={productId}
            storeProductVolumeId={selectedVolume?.store_product_volume_id}
            size="sm"
            productName={name}
            productPrice={price ?? ""}
            productImage="/assets/images/bottles/single-bottle.png"
            productVolume={selectedVolume?.volume}
          />
        </div>

        {/* Social */}
        <div className="flex items-center gap-3">
          {[
            { href: "#", src: "/assets/social/facebook.svg",  label: "Facebook"  },
            { href: "#", src: "/assets/social/twitter.svg",   label: "Twitter"   },
            { href: "#", src: "/assets/social/instagram.svg", label: "Instagram" },
            { href: "#", src: "/assets/social/share.svg",     label: "Share"     },
          ].map(({ href, src, label }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-1 active:opacity-80 transition-opacity"
              aria-label={`Share on ${label}`}
            >
              <Image src={src} alt={label} width={15} height={15} className="object-contain" />
              <span className="text-[11px] text-gray-600">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
