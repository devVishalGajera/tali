"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/modals/CartProvider";
import { useLocation } from "@/components/modals/LocationProvider";
import type { ProductVolume } from "@/lib/api/product-detail";

interface Props {
  productId:   number;
  name:        string;
  description: string;
  abv:         string;
  country:     string;
  volumes:     ProductVolume[];
  rating:      number;
}

export default function ProductDetailInfo({
  productId,
  name,
  description,
  abv,
  country,
  volumes,
  rating,
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
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {price ?? "—"}
        </span>
      </div>

      {/* Star rating */}
      <div className="flex items-center gap-1.5 mb-3">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half   = !filled && rating >= star - 0.5;
          return (
            <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              className="w-4 h-4 flex-shrink-0"
              fill={filled ? "#F59E0B" : half ? "url(#half)" : "none"}
              stroke={filled || half ? "#F59E0B" : "#D1D5DB"}
              strokeWidth={1.5}
            >
              {half && (
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          );
        })}
        {rating > 0 && (
          <span className="text-xs text-gray-500 ml-0.5">{rating.toFixed(1)}</span>
        )}
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
          <div className="grid grid-cols-4 gap-2">
            {volumes.map((v) => (
              <button
                key={v.volume_id}
                onClick={() => setSelectedVolumeId(v.volume_id)}
                className={`px-2 py-2.5 rounded-md border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedVolumeId === v.volume_id
                    ? "bg-[#006B4D] text-white border-[#006B4D]"
                    : "bg-white text-[#1D1D1D] border-[#1D1D1D] hover:border-[#006B4D] hover:text-[#006B4D]"
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
        <div className="flex items-center justify-between border border-[#DFDEDE] rounded-md py-2.5 px-5 w-full">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Image src="/assets/icons/arrow.svg" alt="−" className="rotate-180" width={18} height={18} />
          </button>
          <span className="text-base font-semibold text-gray-900 min-w-[1.5rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Image src="/assets/icons/arrow.svg" alt="+" width={18} height={18} />
          </button>
        </div>
      </div>

      {/* Add to cart + Social */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {purchaseAllow && (
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 px-4 rounded-md font-semibold text-sm transition-all cursor-pointer ${
                addedToCart ? "bg-[#005a3f] text-white" : "bg-[#006B4D] text-white"
              }`}
            >
              {addedToCart ? "Added to Cart ✓" : "Add To Cart"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
