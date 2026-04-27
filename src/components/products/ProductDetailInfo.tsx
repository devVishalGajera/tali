"use client";

import { useState }        from "react";
import Image               from "next/image";
import { useCart }         from "@/components/modals/CartProvider";
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
  const { addItem } = useCart();

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
    addItem({
      id:         productId,
      name,
      price:      price ?? "—",
      priceValue: selectedVolume.price ? parseFloat(selectedVolume.price) : 0,
      image:      "/assets/images/bottles/single-bottle.png",
      size:       selectedVolume.volume || undefined,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="flex flex-col w-full min-w-0">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold text-gray-900 mb-2 sm:mb-3">
        {name}
      </h1>

      {/* ABV / country */}
      <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
        {abv ? `[${abv}% Alcohol ABV${country ? ` — ${country}` : ""}]` : country || ""}
      </p>

      {/* Price */}
      <div className="mb-3 sm:mb-4">
        <span className="text-3xl sm:text-4xl md:text-[30px] font-bold text-gray-900">
          {price ?? "—"}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs sm:text-sm md:text-base text-[#1D1D1D80] leading-relaxed mb-4 sm:mb-6">
          {description}
        </p>
      )}

      {/* Volume sizes */}
      {volumes.length > 0 && (
        <div className="mb-4 sm:mb-10">
          <label className="block text-xs sm:text-[26px] font-semibold text-[#1D1D1D] mb-2">
            Sizes:
          </label>
          <div className="grid grid-cols-4 gap-4">
            {volumes.map((v) => (
              <button
                key={v.volume_id}
                onClick={() => setSelectedVolumeId(v.volume_id)}
                className={`px-1 py-1 sm:px-4 sm:py-3 rounded-md border-2 text-[10px] sm:text-[17px] font-medium transition-all cursor-pointer whitespace-nowrap ${
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
      <div className="mb-4 sm:mb-20">
        <div className="space-y-1.5 sm:space-y-2">
          {country && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-base leading-[26px]">
              <span className="font-semibold text-gray-900">Place of Origin:</span>
              <span className="text-gray-700">{country}</span>
            </div>
          )}
          {abv && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-base leading-[26px]">
              <span className="font-semibold text-gray-900">Alcohol ABV:</span>
              <span className="text-gray-700">{abv}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-xs sm:text-[26px] font-semibold text-[#1D1D1D] mb-2">
          Bottles:
        </label>
        <div className="flex items-center justify-between gap-3 sm:gap-4 border border-[#DFDEDE] rounded-md py-2 px-5">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Image src="/assets/icons/arrow.svg" alt="−" className="rotate-180" width={25} height={25} />
          </button>
          <span className="text-lg sm:text-[26px] font-semibold text-gray-900 min-w-[2.5rem] sm:min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Image src="/assets/icons/arrow.svg" alt="+" width={25} height={25} />
          </button>
        </div>
      </div>

      {/* Social share + Add to cart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-[30px]">
        {/* Social */}
        <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-5">
          {[
            { href: "#", src: "/assets/social/facebook.svg",  label: "Facebook"  },
            { href: "#", src: "/assets/social/twitter.svg",   label: "Twitter"   },
            { href: "#", src: "/assets/social/instagram.svg", label: "Instagram" },
            { href: "#", src: "/assets/social/share.svg",     label: "Share"     },
          ].map(({ href, src, label }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-center gap-3.5 w-[70px] active:opacity-80 transition-opacity"
              aria-label={`Share on ${label}`}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                <Image src={src} alt={label} width={30} height={30} className="object-contain w-[30px] h-[30px]" />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-600">{label}</span>
            </a>
          ))}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 sm:py-3 px-5 rounded-md font-semibold text-base sm:text-lg transition-all cursor-pointer ${
            addedToCart ? "bg-[#005a3f] text-white" : "bg-[#006B4D] text-white"
          }`}
        >
          {addedToCart ? "Added to Cart ✓" : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}
