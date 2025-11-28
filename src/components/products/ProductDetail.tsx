"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductDetailProps {
  productId: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: string;
  abv: string;
  sweetness: string;
  description: string;
  images: string[];
  sizes: { label: string; value: string }[];
  origin: {
    country: string;
    flag: string;
  };
  type: string;
  distillery: string;
}

const ProductDetail = ({ productId }: ProductDetailProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("1k");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Mock product data - In a real app, this would be fetched based on productId
  const product: Product = {
    id: 1,
    name: "Johnnie Walker Black Label 12 Year Old Blended Scotch Whisky",
    brand: "Johnnie Walker",
    category: "Black Label",
    price: "₹3,435",
    abv: "40%",
    sweetness: "Dry",
    description:
      "Johnnie Walker is the world's biggest-selling blended Scotch whisky. Established in the mid-19th Century, it has a long distilling history and is available globally.",
    images: [
      "/assets/images/bottles/product-page-1.png",
      "/assets/images/bottles/product-page-2.png",
      "/assets/images/bottles/product-page-3.png",
    ],
    sizes: [
      { label: "1.75ltr", value: "1.75ltr" },
      { label: "1k", value: "1k" },
      { label: "750ml", value: "750ml" },
      { label: "375ml", value: "375ml" },
      { label: "200ml", value: "200ml" },
      { label: "50ml", value: "50ml" },
      { label: "pack-50ml", value: "pack-50ml" },
    ],
    origin: {
      country: "Scotland",
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    },
    type: "Blended Whisky",
    distillery: "Johnnie Walker",
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    // In a real app, this would add the product to cart
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  return (
    <main className="w-full m-0 p-0 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 md:px-8 md:py-6 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="mb-4 sm:mb-6 md:mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-1 sm:mx-2">/</span>
            </li>
            <li>
              <Link href="/products" className="hover:text-gray-900">
                {product.brand}
              </Link>
            </li>
            <li>
              <span className="mx-1 sm:mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium">{product.category}</li>
          </ol>
        </nav>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
          {/* Left Column - Product Images */}
          <div className="w-full lg:relative">
            {/* Desktop: Thumbnail Gallery - Vertical Stack on Left */}
            <div className="hidden lg:flex flex-col gap-3 md:gap-4 lg:gap-6 absolute left-0 top-0 z-10">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-24 md:w-28 lg:w-28 h-24 md:h-28 lg:h-28 rounded overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-gray-900"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Product Image */}
            <div className="relative w-full aspect-square mb-4 lg:mb-0 lg:ml-36 lg:min-h-[500px]">
              <div className="relative w-full h-full rounded border border-gray-200 overflow-hidden bg-white">
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain p-3 sm:p-4"
                  priority
                />
              </div>
              {/* ABV Text - Top Left */}
              <div className="absolute top-2 left-2 text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-900 z-10">
                {product.abv} ABV
              </div>
            </div>

            {/* Mobile: Thumbnail Gallery - Horizontal Below Main Image */}
            <div className="flex lg:hidden flex-row gap-2 sm:gap-3 justify-center">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden border-2 transition-all touch-manipulation ${
                    selectedImageIndex === index
                      ? "border-gray-900"
                      : "border-gray-200 active:border-gray-400"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="flex flex-col w-full min-w-0">
            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              {product.name}
            </h1>

            {/* Alcohol Details */}
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
              [ABV - Sweetness: {product.sweetness}]
            </p>

            {/* Rating */}
            <div className="mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">5</span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
              {product.description}
            </p>

            {/* Size Options */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md border-2 text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                      selectedSize === size.value
                        ? "bg-[#006B4D] text-white border-[#006B4D]"
                        : "bg-white text-gray-700 border-gray-300 active:border-gray-400"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Bottles:
              </label>
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 border-gray-300 rounded-md active:bg-gray-50 transition-colors touch-manipulation"
                  aria-label="Decrease quantity"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span className="text-lg sm:text-xl font-semibold text-gray-900 min-w-[2.5rem] sm:min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 border-gray-300 rounded-md active:bg-gray-50 transition-colors touch-manipulation"
                  aria-label="Increase quantity"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Add To Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 sm:py-4 px-6 rounded-md font-semibold text-base sm:text-lg transition-all mb-4 sm:mb-6 touch-manipulation ${
                addedToCart
                  ? "bg-[#005a3f] text-white"
                  : "bg-[#006B4D] active:bg-[#005a3f] text-white"
              }`}
            >
              {addedToCart ? "Added to Cart" : "Add To Cart"}
            </button>

            {/* Product Information */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Product Information</h3>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <span className="font-semibold text-gray-900">Place of Origin:</span>
                  <span className="flex items-center gap-1 text-gray-700">
                    <span>{product.origin.flag}</span>
                    {product.origin.country}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <span className="font-semibold text-gray-900">Type of Spirit:</span>
                  <span className="text-gray-700">{product.type}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <span className="font-semibold text-gray-900">Distillery:</span>
                  <span className="text-gray-700">{product.distillery}</span>
                </div>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="flex flex-col gap-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-900">Share:</span>
              <div className="flex items-center gap-3 sm:gap-4">
                <a
                  href="#"
                  className="flex flex-col items-center gap-1 active:opacity-80 transition-opacity touch-manipulation"
                  aria-label="Share on Facebook"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">f</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-600">Facebook</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center gap-1 active:opacity-80 transition-opacity touch-manipulation"
                  aria-label="Share on Twitter"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-600">Twitter</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center gap-1 active:opacity-80 transition-opacity touch-manipulation"
                  aria-label="Share"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-600">Share</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ProductDetail;

