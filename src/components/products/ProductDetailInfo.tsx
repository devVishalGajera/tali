"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCart } from "@/components/modals/CartProvider";
import { useLocation } from "@/components/modals/LocationProvider";
import type { ProductVolume } from "@/lib/api/product-detail";
import { productSizesMatch } from "@/lib/utils/product-slug";

interface Props {
  productId:      number;
  name:           string;
  description:    string;
  abv:            string;
  country:        string;
  volumes:        ProductVolume[];
  rating:         number;
  enablePurchase: boolean;
  initialSize?:   string;
}

export default function ProductDetailInfo({
  productId,
  name,
  description,
  abv,
  country,
  volumes,
  rating,
  enablePurchase,
  initialSize,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addToCart, items, updateQuantity } = useCart();
  const { purchaseAllow } = useLocation();

  const canBuy = purchaseAllow && enablePurchase;

  const defaultVolume = volumes.find((v) => v.price) ?? volumes[0] ?? null;

  const sizeFromUrl = searchParams.get("size") ?? initialSize ?? null;
  const volumeFromSize = sizeFromUrl
    ? volumes.find((v) => productSizesMatch(v.volume, sizeFromUrl))
    : undefined;

  const [selectedVolumeId, setSelectedVolumeId] = useState<number | null>(
    volumeFromSize?.volume_id ?? defaultVolume?.volume_id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const selectedVolume = volumes.find((v) => v.volume_id === selectedVolumeId) ?? defaultVolume;
  const price = selectedVolume?.price
    ? `₹${parseFloat(selectedVolume.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : null;

  const cartLine = useMemo(() => {
    const spvId = selectedVolume?.store_product_volume_id;
    if (!spvId) return undefined;
    return items.find(
      (i) =>
        i.id === productId &&
        i.store_product_volume_id === spvId,
    );
  }, [items, productId, selectedVolume?.store_product_volume_id]);

  /* Keep stepper in sync with cart total for this product + size */
  useEffect(() => {
    if (cartLine) {
      setQuantity(cartLine.quantity);
    } else {
      setQuantity(1);
    }
  }, [selectedVolumeId, cartLine?.quantity, cartLine?.store_product_volume_id]);

  useEffect(() => {
    if (!sizeFromUrl) return;
    const match = volumes.find((v) => productSizesMatch(v.volume, sizeFromUrl));
    if (match) setSelectedVolumeId(match.volume_id);
  }, [sizeFromUrl, volumes]);

  const selectVolume = (volumeId: number) => {
    setSelectedVolumeId(volumeId);
    const vol = volumes.find((v) => v.volume_id === volumeId);
    if (!vol?.volume) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", vol.volume);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const changeQty = (delta: number) => {
    const next = quantity + delta;
    if (next < 1) return;
    if (cartLine) {
      updateQuantity(productId, next);
    }
    setQuantity(next);
  };

  const handleAddToCart = () => {
    if (!selectedVolume) return;
    addToCart({
      id: productId,
      store_product_volume_id: selectedVolume.store_product_volume_id ?? undefined,
      name,
      price: price ?? "—",
      priceValue: selectedVolume.price ? parseFloat(selectedVolume.price) : 0,
      image: "/assets/images/bottles/single-bottle.png",
      size: selectedVolume.volume || undefined,
      quantity,
      requestType: "add_to_cart",
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
                onClick={() => selectVolume(v.volume_id)}
                className={`px-2 py-2.5 rounded-md border-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedVolumeId === v.volume_id
                    ? "border-[#006B4D] text-[#006B4D] bg-[#006B4D0D]"
                    : "border-gray-200 text-[#1D1D1D] bg-white hover:border-[#006B4D] hover:text-[#006B4D]"
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
        <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => changeQty(-1)}
            className="w-10 h-10 flex items-center justify-center text-xl font-light text-gray-600 hover:bg-gray-50 hover:text-[#006B4D] active:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => changeQty(1)}
            className="w-10 h-10 flex items-center justify-center text-xl font-light text-gray-600 hover:bg-gray-50 hover:text-[#006B4D] active:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart + Social */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {canBuy ? (
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 px-4 rounded-md font-semibold text-sm transition-all cursor-pointer ${
                addedToCart ? "bg-[#005a3f] text-white" : "bg-[#006B4D] text-white"
              }`}
            >
              {addedToCart ? "Added to Cart ✓" : "Add To Cart"}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 px-4 rounded-md font-semibold text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              Not Available
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
