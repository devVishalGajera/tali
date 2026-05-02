"use client";

import { useState } from "react";
import { proxyImageUrl } from "@/lib/utils/image";

interface Props {
  images: string[];
  name:   string;
  abv:    string;
}

export default function ProductDetailGallery({ images, name, abv }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const src = proxyImageUrl(images[activeIndex]);

  return (
    <div className="w-full flex gap-5 lg:flex-row flex-col-reverse">
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex flex-row lg:flex-col gap-3 md:gap-4 lg:gap-6">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-24 md:w-28 lg:w-28 h-24 md:h-28 lg:h-28 rounded overflow-hidden border-2 transition-all ${
                activeIndex === i
                  ? "border-gray-900"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <img
                src={proxyImageUrl(img)}
                alt={`${name} view ${i + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative w-full mb-4 lg:mb-0 min-h-[300px] lg:min-h-[500px]">
        <div className="relative w-full h-full rounded border border-gray-200 overflow-hidden bg-white min-h-[300px] lg:min-h-[500px]">
          <img
            src={src}
            alt={name}
            className="absolute inset-0 w-full h-full object-contain p-3 sm:p-4"
          />
        </div>
        {abv && (
          <div className="absolute top-2 left-2 text-xs sm:text-sm md:text-[15px] font-medium text-gray-900 z-10">
            {abv}% ABV
          </div>
        )}
      </div>
    </div>
  );
}
