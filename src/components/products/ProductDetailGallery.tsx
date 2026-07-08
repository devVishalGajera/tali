"use client";

import { useState, useEffect, useCallback } from "react";
import { proxyImageUrl } from "@/lib/utils/image";
import WishlistButton from "@/components/shared/WishlistButton";
import { TALLI_SOCIAL } from "@/lib/social-links";

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
  const [toast, setToast] = useState<string | null>(null);
  const src = proxyImageUrl(images[activeIndex]);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const openSharePopup = useCallback((shareUrl: string) => {
    const w = 600;
    const h = 600;
    const left = Math.max(0, (window.screen.width  - w) / 2);
    const top  = Math.max(0, (window.screen.height - h) / 2);
    window.open(
      shareUrl,
      "talli-share",
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,scrollbars=yes,noopener`,
    );
  }, []);

  const copyLink = useCallback(async (successMsg = "Link copied to clipboard!") => {
    if (typeof window === "undefined") return;
    const link = window.location.href;

    const fallbackCopy = () => {
      try {
        const ta = document.createElement("textarea");
        ta.value = link;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "0";
        ta.style.left = "0";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, link.length);
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    };

    let ok = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(link);
        ok = true;
      } catch {
        ok = fallbackCopy();
      }
    } else {
      ok = fallbackCopy();
    }

    showToast(ok ? successMsg : "Could not copy link");
  }, [showToast]);

  const handleSocialClick = useCallback(
    async (label: "Facebook" | "Twitter" | "Instagram" | "Share", e: React.MouseEvent) => {
      e.preventDefault();
      if (typeof window === "undefined") return;
      const url = window.location.href;
      const text = `Check out ${name} on Talli`;

      if (label === "Facebook") {
        openSharePopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        return;
      }
      if (label === "Twitter") {
        openSharePopup(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        );
        return;
      }
      if (label === "Instagram") {
        // Instagram has no direct web share URL — copy the link, then take the user to Instagram
        await copyLink("Link copied! Paste it in your Instagram story or post");
        window.open(TALLI_SOCIAL.instagram, "_blank", "noopener,noreferrer");
        return;
      }
      if (label === "Share") {
        // Native share sheet (system-level share dialog with all installed apps)
        const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
        if (typeof nav.share === "function") {
          try {
            await nav.share({ title: name, text, url });
            return;
          } catch {
            /* user cancelled or unsupported — fall through to copy */
          }
        }
        copyLink();
        return;
      }
    },
    [name, openSharePopup, copyLink],
  );

  const socialShare = (
    <div className="flex items-center justify-center gap-6">
      {([
        { src: "/assets/social/facebook.svg",  label: "Facebook"  as const },
        { src: "/assets/social/twitter.svg",   label: "Twitter"   as const },
        { src: "/assets/social/instagram.svg", label: "Instagram" as const },
        { src: "/assets/social/share.svg",     label: "Share"     as const },
      ]).map(({ src: iconSrc, label }) => (
        <button
          key={label}
          type="button"
          onClick={(e) => handleSocialClick(label, e)}
          className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity active:scale-90 cursor-pointer"
          aria-label={label === "Share" ? "Copy product link" : `Share on ${label}`}
        >
          <img src={iconSrc} alt={label} width={22} height={22} className="w-[22px] h-[22px] object-contain" />
          <span className="text-[9px] text-gray-500">{label}</span>
        </button>
      ))}
    </div>
  );

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
                className={`relative w-24 md:w-28 lg:w-28 h-24 md:h-28 lg:h-28 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
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
        <div className="relative w-full min-w-0 flex-1">
          <div
            className="relative w-full rounded border border-gray-200 overflow-hidden bg-white h-[300px] lg:h-[500px] cursor-zoom-in group"
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

          {/* Social share — centered under the main image (desktop only) */}
          <div className="hidden lg:block mt-5">
            {socialShare}
          </div>
        </div>
      </div>

      {/* Social share — mobile/tablet: below the thumbnail strip */}
      <div className="lg:hidden mt-5">
        {socialShare}
      </div>

      {/* Share toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1100] bg-[#1D1D1D] text-white text-sm px-4 py-2.5 rounded-full shadow-lg max-w-[90vw] text-center animate-[fadeIn_0.25s_ease-out]"
        >
          {toast}
        </div>
      )}

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
