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
        <nav
          className="mb-4 sm:mb-6 md:mb-8"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
            <li>
              <Link
                href="/"
                className="hover:text-gray-900 text-[#1D1D1D80]"
              >
                Home
              </Link>
            </li>
            <li>
              <span className="block">
                <Image
                  src="/assets/icons/arrow.svg"
                  alt="Arrow"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </span>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-gray-900 text-[#1D1D1D80]"
              >
                {product.brand}
              </Link>
            </li>
            <li>
              <span className="block">
                <Image
                  src="/assets/icons/arrow.svg"
                  alt="Arrow"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </span>
            </li>
            <li className="text-gray-900 font-medium">{product.category}</li>
          </ol>
        </nav>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column - Product Images */}
          <div className="w-full flex gap-5 lg:flex-row flex-col-reverse">
            {/* Desktop: Thumbnail Gallery - Vertical Stack on Left */}
            <div className="flex flex-row lg:flex-col gap-3 md:gap-4 lg:gap-6">
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
                    className="object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main Product Image */}
            <div className="relative w-full mb-4 lg:mb-0 min-h-[300px] lg:min-h-[500px]">
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
              <div className="absolute top-2 left-2 text-xs sm:text-sm md:text-[15px] font-medium text-gray-900 z-10">
                {product.abv} ABV
              </div>
            </div>

            {/* Mobile: Thumbnail Gallery - Horizontal Below Main Image */}
            {/* <div className="flex lg:hidden flex-row gap-2 sm:gap-3 justify-center">
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
            </div> */}
          </div>

          {/* Right Column - Product Details */}
          <div className="flex flex-col w-full min-w-0">
            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold text-gray-900 mb-2 sm:mb-3">
              {product.name}
            </h1>

            {/* Alcohol Details */}
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
              [{product.abv} Alcohol ABV - Sweetness: {product.sweetness}]
            </p>

            {/* Rating */}
            <div className="mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl md:text-[30px] font-bold text-gray-900">
                ₹ 5
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-[#1D1D1D80] leading-relaxed mb-4 sm:mb-6">
              {product.description}
            </p>

            {/* Size Options */}
            <div className="mb-4 sm:mb-10">
              <label className="block text-xs sm:text-[26px] font-semibold text-[#1D1D1D] mb-2">
                Sizes:
              </label>
              <div className="grid grid-cols-4 gap-4">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={`px-1.5 py-1.5 sm:px-5 sm:py-4 rounded-md border-2 text-[10px] sm:text-[17px] font-medium transition-all touch-manipulation cursor-pointer whitespace-nowrap ${
                      selectedSize === size.value
                        ? "bg-[#006B4D] text-white border-[#006B4D]"
                        : "bg-white text-[#1D1D1D] border-[#1D1D1D] active:border-gray-400"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="mb-4 sm:mb-20">
              {/* <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                Product Information
              </h3> */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-base leading-[26px]">
                  <span className="font-semibold text-gray-900">Place of Origin:</span>
                  <span className="flex items-center gap-1 text-gray-700">
                    {product.origin.country}
                    <span>{product.origin.flag}</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-base leading-[26px]">
                  <span className="font-semibold text-gray-900">Type of Spirit:</span>
                  <span className="text-gray-700">{product.type}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-base leading-[26px]">
                  <span className="font-semibold text-gray-900">Distillery/Producer:</span>
                  <span className="text-gray-700">{product.distillery}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-base leading-[26px]">
                  <span className="font-semibold text-gray-900">Alcohol ABV :</span>
                  <span className="text-gray-700">{product.abv}</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs sm:text-[26px] font-semibold text-[#1D1D1D] mb-2">
                Bottles:
              </label>
              <div className="flex items-center justify-between gap-3 sm:gap-4 border border-[#DFDEDE] rounded-md py-2 px-5">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="flex items-center justify-center transition-colors touch-manipulation cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Image
                    src="/assets/icons/arrow.svg"
                    alt="Decrease quantity"
                    className="rotate-180"
                    width={25}
                    height={25}
                  />
                </button>
                <span className="text-lg sm:text-[26px] font-semibold text-gray-900 min-w-[2.5rem] sm:min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="flex items-center justify-center transition-colors touch-manipulation cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Image
                    src="/assets/icons/arrow.svg"
                    alt="Increase quantity"
                    width={25}
                    height={25}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-[30px]">
          {/* Social Sharing */}
          <div className="flex flex-col gap-2 w-full lg:ml-32">
            <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-5">
              <a
                href="#"
                className="flex flex-col items-center gap-3.5 active:opacity-80 transition-opacity touch-manipulation w-[70px]"
                aria-label="Share on Facebook"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                  <Image
                    src="/assets/social/facebook.svg"
                    alt="Facebook"
                    width={30}
                    height={30}
                    className="object-contain w-[30px] h-[30px]"
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-600">Facebook</span>
              </a>
              <a
                href="#"
                className="flex flex-col items-center gap-3.5 active:opacity-80 transition-opacity touch-manipulation w-[70px]"
                aria-label="Share on Twitter"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                  <Image
                    src="/assets/social/twitter.svg"
                    alt="Twitter"
                    width={30}
                    height={30}
                    className="object-contain w-[30px] h-[30px]"
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-600">Twitter</span>
              </a>
              <a
                href="#"
                className="flex flex-col items-center gap-3.5 active:opacity-80 transition-opacity touch-manipulation w-[70px]"
                aria-label="Share on Twitter"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                  <Image
                    src="/assets/social/instagram.svg"
                    alt="Instagram"
                    width={30}
                    height={30}
                    className="object-contain w-[30px] h-[30px]"
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-600">Instagram</span>
              </a>
              <a
                href="#"
                className="flex flex-col items-center gap-3.5 active:opacity-80 transition-opacity touch-manipulation w-[70px]"
                aria-label="Share"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                  <Image
                    src="/assets/social/share.svg"
                    alt="Share"
                    width={30}
                    height={30}
                    className="object-contain w-[30px] h-[30px]"
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-600">Share</span>
              </a>
            </div>
          </div>
          {/* Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 sm:py-4 px-6 rounded-md font-semibold text-base sm:text-lg transition-all mb-4 sm:mb-6 touch-manipulation cursor-pointer ${
              addedToCart
                ? "bg-[#005a3f] text-white"
                : "bg-[#006B4D] active:bg-[#005a3f] text-white"
            }`}
          >
            {addedToCart ? "Added to Cart" : "Add To Cart"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
