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
  const [activeTab, setActiveTab] = useState<"prices" | "additional" | "description">("prices");
  const [selectedLocation, setSelectedLocation] = useState("India");

  // Shop data for prices section
  const shops = [
    {
      id: 1,
      name: "Delhi Duty Free (Departures Terminal 3, IGI Airport)",
      image: "/assets/images/shops/delhi-duty-free.png",
      location: "New Delhi",
      country: "India",
      flagIcon: "/assets/icons/indianFlag.svg",
      hours: "Mon - Sat,  09:00am - 10:00pm",
      rating: 4,
      delivery: "Standard delivery 1-2 weeks",
      volume: "750ml",
    },
    {
      id: 2,
      name: "Wine Dock Goa",
      image: "/assets/images/shops/wine-dock-goa.png",
      location: "Goa",
      country: "India",
      flagIcon: "/assets/icons/indianFlag.svg",
      hours: "Mon - Sat,  09:00am - 10:00pm",
      rating: 4,
      delivery: "Standard delivery 1-2 weeks",
      volume: "750ml",
    },
    {
      id: 3,
      name: "Hyderabad Duty Free",
      image: "/assets/images/shops/hyderabad-duty-free.png",
      location: "Hyderabad",
      country: "India",
      flagIcon: "/assets/icons/indianFlag.svg",
      hours: "Mon - Sat,  09:00am - 10:00pm",
      rating: 4,
      delivery: "Standard delivery 1-2 weeks",
      volume: "750ml",
    },
  ];

  // Star Rating Component - supports half stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-[#FFB800]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Half star - using clip-path for reliable half fill
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          {/* Empty star background */}
          <svg className="absolute w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {/* Half filled star overlay */}
          <svg 
            className="absolute w-4 h-4 text-[#FFB800]" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

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
                  className={`relative w-24 md:w-28 lg:w-28 h-24 md:h-28 lg:h-28 rounded overflow-hidden border-2 transition-all ${selectedImageIndex === index
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
                    className={`px-1 py-1 sm:px-4 sm:py-3 rounded-md border-2 text-[10px] sm:text-[17px] font-medium transition-all touch-manipulation cursor-pointer whitespace-nowrap ${selectedSize === size.value
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
            className={`w-full py-2 sm:py-3 px-5 rounded-md font-semibold text-base sm:text-lg transition-all mb-4 sm:mb-6 touch-manipulation cursor-pointer ${addedToCart
              ? "bg-[#005a3f] text-white"
              : "bg-[#006B4D] active:bg-[#005a3f] text-white"
              }`}
          >
            {addedToCart ? "Added to Cart" : "Add To Cart"}
          </button>
        </div>
      </div>

      {/* Delivery & Taste Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Time */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-3">
              Delivery Time
            </h3>
            <p className="text-sm sm:text-base text-[#1D1D1D] mb-2">
              Delivered to <span className="font-semibold">Saturday, 26 April</span>
            </p>
            <div className="flex items-center gap-2 text-sm sm:text-base text-[#1D1D1D80]">
              <Image
                src="/assets/icons/location-pin.svg"
                alt="Location"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span>Delivering to Mumbai 400001</span>
            </div>
          </div>
          {/* Sold By */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-3">
              Sold By
            </h3>
            <div className="flex items-center gap-2 text-sm sm:text-base text-[#1D1D1D]">
              <Image
                src="/assets/icons/briefcase.svg"
                alt="Store"
                width={18}
                height={18}
                className="w-[18px] h-[18px]"
              />
              <span>Delhi Duty Free (Departures Terminal 3, IGI Airport)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Taste Notes */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-3">
              Taste Notes:
            </h3>
            <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Sed egestas tincidunt mauris ultricies semper eget fermentum. Sit porttitor ornare et lorem. Faucibus amet urna adipiscing massa sit eu. Quis velit orci a pellentesque.
              <br />
              Vulputate justo at massa volutpat.
            </p>
          </div>
          {/* Taste Characteristics */}
          <div className="space-y-8">
            {[
              { left: "Light", right: "Bold", value: 75 },
              { left: "Smooth", right: "Spicy", value: 40 },
              { left: "Delicate", right: "Smoky/Peaty", value: 80 },
              { left: "Dry", right: "Sweet", value: 10 },
            ].map((item, index) => {
              const isRight = item.value >= 50;
              const distance = Math.abs(item.value - 50);

              return (
                <div
                  key={index}
                  className="grid grid-cols-[100px_1fr_120px] items-center gap-4"
                >
                  {/* ✅ LEFT LABEL — FIXED WIDTH */}
                  <span className="text-sm text-[#1D1D1D] truncate">
                    {item.left}
                  </span>

                  {/* ✅ SLIDER TRACK */}
                  <div className="relative h-[6px] bg-[#E5E5E5] rounded-full overflow-visible">

                    {/* ✅ CENTER PIPE */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-[6px] h-6 bg-[#1D1D1D] rounded-full" />
                    </div>

                    {/* ✅ DIRECTIONAL FILL (NO OVERLAP) */}
                    {isRight ? (
                      <div
                        className="absolute top-0 h-full bg-[#1D1D1D] rounded-full"
                        style={{
                          left: "50%",
                          width: `${distance}%`,
                        }}
                      />
                    ) : (
                      <div
                        className="absolute top-0 h-full bg-[#1D1D1D] rounded-full"
                        style={{
                          right: "50%",
                          width: `${distance}%`,
                        }}
                      />
                    )}
                  </div>

                  {/* ✅ RIGHT LABEL — FIXED WIDTH */}
                  <span className="text-sm text-[#1D1D1D] text-right truncate">
                    {item.right}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Food Pairing Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-2">
          Food Pairing:
        </h3>
        <p className="text-sm sm:text-base text-[#1D1D1D80] mb-6">
          Pairs beautifully with Indian cuisine, thanks to its rich and balanced profile.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Main Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="/assets/images/food-pairing-main.png"
              alt="Food Pairing"
              fill
              className="object-cover"
            />
          </div>

          {/* Right - Food Items Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 place-items-center">
            {[
              { name: "Tandoori Chicken, Chicken Tikka", image: "/assets/images/tandoori-chicken.png" },
              { name: "Chilli Chicken", image: "/assets/images/chilli-chicken.png" },
              { name: "Paneer Tikka", image: "/assets/images/paneer-tikka.png" },
              { name: "Spiced Cashews or Masala Peanuts", image: "/assets/images/spiced-cashews.png" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center w-full max-w-[140px] sm:max-w-[160px] md:max-w-[190px]">
                <p className="text-xs sm:text-sm text-[#1D1D1D] text-center mb-2 min-h-[32px] sm:min-h-[40px] line-clamp-2">
                  {item.name}
                </p>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prices / Additional Info / Description Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8 md:py-10">
        {/* Tabs */}
        <div className="flex items-center justify-center border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("prices")}
            className={`px-4 sm:px-8 py-3 text-sm sm:text-base font-medium transition-colors cursor-pointer ${
              activeTab === "prices"
                ? "text-[#FF5C00] border-b-2 border-[#FF5C00]"
                : "text-[#1D1D1D80] hover:text-[#1D1D1D]"
            }`}
          >
            Prices
          </button>
          <button
            onClick={() => setActiveTab("additional")}
            className={`px-4 sm:px-8 py-3 text-sm sm:text-base font-medium transition-colors cursor-pointer ${
              activeTab === "additional"
                ? "text-[#FF5C00] border-b-2 border-[#FF5C00]"
                : "text-[#1D1D1D80] hover:text-[#1D1D1D]"
            }`}
          >
            Additional information
          </button>
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 sm:px-8 py-3 text-sm sm:text-base font-medium transition-colors cursor-pointer ${
              activeTab === "description"
                ? "text-[#FF5C00] border-b-2 border-[#FF5C00]"
                : "text-[#1D1D1D80] hover:text-[#1D1D1D]"
            }`}
          >
            Description
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "prices" && (
          <div>
            {/* Header with count and location filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-[#FF5C00]">
                0{shops.length} Prices
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#1D1D1D]">Shop Location</span>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-[#1D1D1D] bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent"
                >
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="UAE">UAE</option>
                </select>
              </div>
            </div>

            {/* Shop Cards */}
            <div className="space-y-4">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="border border-[#E5E5E5] rounded-lg p-4 sm:p-5 flex flex-col lg:flex-row gap-4 lg:gap-5"
                >
                  {/* Shop Image */}
                  <div className="relative w-full lg:w-[140px] h-[100px] lg:h-[100px] rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={shop.image}
                      alt={shop.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Shop Details */}
                  <div className="flex-1 min-w-0">
                    {/* Product Name & Volume - Same Row */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-base sm:text-lg font-medium text-[#FF5C00] leading-tight">
                        {product.name}
                      </h4>
                      <span className="flex-shrink-0 px-3 py-1 bg-[#FFF0E8] text-[#FF5C00] text-xs font-medium rounded-full">
                        {shop.volume}
                      </span>
                    </div>

                    {/* Shop Name */}
                    <div className="flex items-center gap-2 mb-2">
                      <Image
                        src="/assets/icons/briefcase.svg"
                        alt="Store"
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 opacity-70"
                      />
                      <span className="text-sm text-[#1D1D1D]">{shop.name}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {renderStars(shop.rating)}
                    </div>

                    {/* Location, Hours, Delivery Row */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      {/* Location */}
                      <div className="flex items-center gap-1.5">
                        <Image
                          src={shop.flagIcon}
                          alt={shop.country}
                          width={18}
                          height={18}
                          className="w-[18px] h-[18px]"
                        />
                        <span className="text-[#FF5C00] font-medium">{shop.country}:</span>
                        <span className="text-[#1D1D1D]">{shop.location}</span>
                      </div>

                      {/* Hours */}
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9" strokeWidth="2" />
                          <path strokeLinecap="round" strokeWidth="2" d="M12 7v5l3 3" />
                        </svg>
                        <span>{shop.hours}</span>
                      </div>

                      {/* Delivery */}
                      <div className="flex items-center gap-1.5">
                        <svg width="18" height="18" viewBox="0 0 36 36" fill="none" className="w-[18px] h-[18px]">
                          <path d="M24 4.5H1.5V24H24V4.5Z" stroke="#FF5C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M24 12H30L34.5 16.5V24H24V12Z" stroke="#FF5C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.25 31.5C10.32 31.5 12 29.82 12 27.75C12 25.68 10.32 24 8.25 24C6.18 24 4.5 25.68 4.5 27.75C4.5 29.82 6.18 31.5 8.25 31.5Z" stroke="#FF5C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M27.75 31.5C29.82 31.5 31.5 29.82 31.5 27.75C31.5 25.68 29.82 24 27.75 24C25.68 24 24 25.68 24 27.75C24 29.82 25.68 31.5 27.75 31.5Z" stroke="#FF5C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-[#FF5C00]">{shop.delivery}</span>
                      </div>
                    </div>

                    {/* More shipping info - Separate Row */}
                    <div className="mt-1">
                      <a
                        href="#"
                        className="text-sm text-[#006B4D] underline hover:text-[#005a3f] transition-colors"
                      >
                        More shipping info
                      </a>
                    </div>
                  </div>

                  {/* Go to Shop Button */}
                  <div className="flex items-start lg:items-center lg:self-center flex-shrink-0">
                    <button className="w-full lg:w-auto px-6 py-2.5 border border-[#FF5C00] text-[#FF5C00] rounded-lg text-sm font-medium hover:bg-[#FFF0E8] transition-colors cursor-pointer whitespace-nowrap">
                      Go to Shop
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Shop Button */}
            <div className="flex justify-center mt-6">
              <button className="flex items-center gap-2 text-sm text-[#1D1D1D] hover:text-[#1D1D1D80] transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="font-medium">View More Shop</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "additional" && (
          <div className="py-8">
            <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">Additional Information</h3>
            <div className="space-y-3 text-sm text-[#1D1D1D80]">
              <div className="flex gap-2">
                <span className="font-medium text-[#1D1D1D] min-w-[120px]">Weight:</span>
                <span>1.2 kg</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-[#1D1D1D] min-w-[120px]">Dimensions:</span>
                <span>30 × 10 × 10 cm</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-[#1D1D1D] min-w-[120px]">Alcohol Content:</span>
                <span>{product.abv}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-[#1D1D1D] min-w-[120px]">Country:</span>
                <span>{product.origin.country}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "description" && (
          <div className="py-8">
            <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">Product Description</h3>
            <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed mb-4">
              {product.description}
            </p>
            <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Sed egestas tincidunt mauris ultricies semper eget fermentum. 
              Sit porttitor ornare et lorem. Faucibus amet urna adipiscing massa sit eu. Quis velit orci a pellentesque. 
              Vulputate justo at massa volutpat. Diam nulla posuere donec sit amet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
