"use client";

import { useState, useEffect, useCallback } from "react";
import { proxyImageUrl } from "@/lib/utils/image";
import WishlistButton from "@/components/shared/WishlistButton";

interface Props {
  images: string[];
  name: string;
  abv: string;
  productId: number;
  storeProductVolumeId?: number;
  productPrice?: string;
  initialWishlisted?: boolean;
}

export default function ProductDetailGallery({ images, name, abv, productId, storeProductVolumeId, productPrice, initialWishlisted }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const src = proxyImageUrl(images[activeIndex]);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, images.length, closeLightbox]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex gap-5 lg:flex-row flex-col-reverse">
        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex flex-row lg:flex-col gap-3 md:gap-4 lg:gap-6">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-24 md:w-28 lg:w-28 h-24 md:h-28 lg:h-28 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  activeIndex === i
                    ? "border-[#006B4D] shadow-[0_0_0_3px_rgba(0,107,77,0.15)] bg-[#f0faf6]"
                    : "border-gray-200 hover:border-[#006B4D]/50 hover:bg-gray-50"
                }`}
              >
                <img
                  src={proxyImageUrl(img)}
                  alt={`${name} view ${i + 1}`}
                  className="w-full h-full object-contain p-1"
                />
                {activeIndex === i && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#006B4D]" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="relative w-full mb-4 lg:mb-0 min-h-[300px] lg:min-h-[500px]">
          <div
            className="relative w-full h-full rounded border border-gray-200 overflow-hidden bg-white min-h-[300px] lg:min-h-[500px] cursor-zoom-in group"
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={src}
              alt={name}
              className="absolute inset-0 w-full h-full object-contain p-3 sm:p-4 transition-transform duration-300 group-hover:scale-[1.02]"
            />
            {/* Fullscreen hint */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
              Full screen
            </div>
          </div>

          {/* ABV badge — top-left */}
          {abv && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#1D1D1D] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                <path d="M12 2v6M8 8H4l-2 6h20l-2-6h-4M5 14v6h14v-6" />
              </svg>
              {abv}% ABV
            </div>
          )}

          {/* Wishlist button — top-right */}
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton
              productId={productId}
              storeProductVolumeId={storeProductVolumeId}
              initialWishlisted={initialWishlisted}
              size="sm"
              productName={name}
              productPrice={productPrice ?? ""}
              productImage={images[0]}
            />
          </div>

          {/* Social share — below image box, centered within image column */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {[
              { href: "#", src: "/assets/social/facebook.svg",  label: "Facebook"  },
              { href: "#", src: "/assets/social/twitter.svg",   label: "Twitter"   },
              { href: "#", src: "/assets/social/instagram.svg", label: "Instagram" },
              { href: "#", src: "/assets/social/share.svg",     label: "Share"     },
            ].map(({ href, src: iconSrc, label }) => (
              <a
                key={label}
                href={href}
                className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity active:scale-90"
                aria-label={`Share on ${label}`}
              >
                <img src={iconSrc} alt={label} width={22} height={22} className="w-[22px] h-[22px] object-contain" />
                <span className="text-[9px] text-gray-500">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i - 1 + images.length) % images.length); }}
              className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}

          {/* Image */}
          <img
            src={src}
            alt={name}
            className="max-w-[90vw] max-h-[90vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i + 1) % images.length); }}
              className="absolute right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? "bg-white w-5" : "bg-white/40"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
