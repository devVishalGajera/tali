"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ProductCarouselSection from "@/components/shared/ProductCarouselSection";
import { ProductCardItem } from "@/components/shared/ProductCard";
import StarRating, { StarIcon } from "@/components/shared/StarRating";

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
  const [activeTab, setActiveTab] = useState<
    "prices" | "additional" | "description"
  >("prices");
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

  const relatedProducts: ProductCardItem[] = [
    { id: 1, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png", isNewArrival: true },
    { id: 2, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
    { id: 3, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
    { id: 4, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
    { id: 5, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  ];

  return (
    <main className="w-full m-0 p-0 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 md:px-8 md:py-6 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="mb-4 sm:mb-6 md:mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900 text-[#1D1D1D80]">
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
                  <span className="font-semibold text-gray-900">
                    Place of Origin:
                  </span>
                  <span className="flex items-center gap-1 text-gray-700">
                    {product.origin.country}
                    <span>{product.origin.flag}</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-base leading-[26px]">
                  <span className="font-semibold text-gray-900">
                    Type of Spirit:
                  </span>
                  <span className="text-gray-700">{product.type}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-base leading-[26px]">
                  <span className="font-semibold text-gray-900">
                    Distillery/Producer:
                  </span>
                  <span className="text-gray-700">{product.distillery}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-base leading-[26px]">
                  <span className="font-semibold text-gray-900">
                    Alcohol ABV :
                  </span>
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
                <span className="text-[10px] sm:text-xs text-gray-600">
                  Facebook
                </span>
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
                <span className="text-[10px] sm:text-xs text-gray-600">
                  Twitter
                </span>
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
                <span className="text-[10px] sm:text-xs text-gray-600">
                  Instagram
                </span>
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
                <span className="text-[10px] sm:text-xs text-gray-600">
                  Share
                </span>
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
              Delivered to{" "}
              <span className="font-semibold">Saturday, 26 April</span>
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
              Lorem ipsum dolor sit amet consectetur. Sed egestas tincidunt
              mauris ultricies semper eget fermentum. Sit porttitor ornare et
              lorem. Faucibus amet urna adipiscing massa sit eu. Quis velit orci
              a pellentesque.
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
          Pairs beautifully with Indian cuisine, thanks to its rich and balanced
          profile.
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
              {
                name: "Tandoori Chicken, Chicken Tikka",
                image: "/assets/images/tandoori-chicken.png",
              },
              {
                name: "Chilli Chicken",
                image: "/assets/images/chilli-chicken.png",
              },
              {
                name: "Paneer Tikka",
                image: "/assets/images/paneer-tikka.png",
              },
              {
                name: "Spiced Cashews or Masala Peanuts",
                image: "/assets/images/spiced-cashews.png",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center w-full max-w-[140px] sm:max-w-[160px] md:max-w-[190px]"
              >
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

      <div className="w-full border-b border-[#1D1D1D33] pt-[30px]">
        <div className="flex items-center justify-center">
          {(
            [
              { key: "prices", label: "Prices" },
              { key: "additional", label: "Additional information" },
              { key: "description", label: "Description" },
            ] as { key: "prices" | "additional" | "description"; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 text-center text-sm sm:text-base md:text-lg leading-snug tracking-[0px] transition-colors cursor-pointer ${activeTab === key
                ? "text-[#1D1D1D] font-bold -mb-px"
                : "text-[#3C3232] font-normal"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Prices / Additional Info / Description Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 md:px-8 md:py-6">
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
                  <div className="relative w-[260px] h-[168px] rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={shop.image}
                      alt={shop.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Shop Details */}
                  <div className="flex-1 min-w-0 gap-7.5 flex flex-col">
                    {/* Product Name & Volume - Same Row */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-base sm:text-lg font-medium text-[#1D1D1D] leading-tight">
                          {product.name}
                        </h4>
                        <span className="flex-shrink-0 px-3 py-1 bg-[#FCCCC5] text-[#1D1D1D] text-xs font-medium rounded-full">
                          {shop.volume}
                        </span>
                      </div>
                    </div>
                    {/* Shop Name */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/assets/icons/briefcase.svg"
                          alt="Store"
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5 opacity-70"
                        />
                        <span className="text-sm text-[#1D1D1D]">
                          {shop.name}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-0.5">
                        <StarRating score={shop.rating} />
                      </div>

                      {/* Location, Hours, Delivery Row */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm items-start">
                        {/* Location */}
                        <div className="flex items-center gap-1.5">
                          <Image
                            src={shop.flagIcon}
                            alt={shop.country}
                            width={18}
                            height={18}
                            className="w-[18px] h-[18px]"
                          />
                          <span className="text-[#00A624] font-medium">
                            {shop.country}:
                          </span>
                          <span className="text-[#00A624]">
                            {shop.location}
                          </span>
                        </div>

                        {/* Hours */}
                        <div className="flex items-center gap-1.5 text-[#6B7280]">
                          <Image
                            src="/assets/icons/time.svg"
                            alt="Clock"
                            width={18}
                            height={18}
                            className="w-[18px] h-[18px]"
                          />
                          <span>{shop.hours}</span>
                        </div>

                        {/* Delivery */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <Image
                              src="/assets/icons/truck_orange.svg"
                              alt="Delivery"
                              width={18}
                              height={18}
                              className="w-[18px] h-[18px]"
                            />
                            <span className="text-[#FF9900]">
                              {shop.delivery}
                            </span>
                          </div>
                          <div>
                            <a
                              href="#"
                              className="text-sm text-[#1D1D1D] underline hover:text-[#1D1D1D]"
                            >
                              More shipping info
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* More shipping info - Separate Row */}
                  </div>
                  {/* Go to Shop Button */}
                  <div className="flex flex-col h-full justify-end items-end">
                    <button className="w-full lg:w-auto px-6 py-2.5 border border-[#FF5C00] text-[#FF5C00] rounded-lg text-sm font-medium hover:bg-[#FFF0E8] transition-colors cursor-pointer whitespace-nowrap mt-auto">
                      Go to Shop
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Shop Button */}
            <div className="flex justify-center mt-6">
              <button className="flex items-center gap-2 text-sm text-[#1D1D1D] hover:text-[#1D1D1D80] transition-colors cursor-pointer">
                <img src="/assets/icons/arrow_drop_down.svg" alt="dropdown" className="w-4 h-2" />
                <span className="font-medium">View More Shop</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "additional" && (
          <div>
            <p className="px-8 font-poppins font-normal text-[10px] sm:text-xs md:text-sm leading-relaxed tracking-[0px] text-center text-[#1D1D1D80]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu malesuada ante, eu maximus erat. Integer eleifend
              elementum massa, nec cursus lorem consequat in. Curabitur quis arcu magna. Mauris efficitur dui ante, id tempus lacus
              fringilla quis. Pellentesque posuere sollicitudin tempor. Cras blandit accumsan luctus.
            </p>
            <div className="flex flex-col sm:flex-row items-center pt-[30px] gap-12">
              {/* Left — image */}
              <div className="w-full sm:w-[280px] md:w-[320px]">
                <img
                  src="/assets/images/shops/shop-additional.png"
                  alt="Additional information"
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
              {/* Right — details */}
              <div className="space-y-3 text-sm sm:text-base text-[#1D1D1D]">
                {[
                  { label: "Producer", value: `${product.brand} (Owned by Diageo)` },
                  { label: "Type", value: product.type },
                  { label: "Base Grains", value: "Malt and Grain Whisky from multiple Scottish distilleries" },
                  { label: "Region", value: product.origin.country },
                  { label: "Whisky Style", value: `Blended Scotch, Aged 12 Years` },
                  { label: "Additives/No", value: "Contains caramel colouring (E150a) for consistency" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-1">
                    <span className="font-semibold">{label}:</span>
                    <span className="text-[#1D1D1D]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "description" && (
          <div className="py-8">
            <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">
              Product Description
            </h3>
            <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed mb-4">
              {product.description}
            </p>
            <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Sed egestas tincidunt
              mauris ultricies semper eget fermentum. Sit porttitor ornare et
              lorem. Faucibus amet urna adipiscing massa sit eu. Quis velit orci
              a pellentesque. Vulputate justo at massa volutpat. Diam nulla
              posuere donec sit amet.
            </p>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Main Label */}
          <h2 className="mb-6 text-[32px] font-semibold leading-none tracking-normal text-[#1D1D1D]">
            Customer Reviews
          </h2>

          {/* Rating Summary Card */}
          <div className="mb-6 max-w-[817px] mx-auto rounded-[14.52px] px-[38px] py-[28px] bg-white shadow-[-8px_-4px_29px_0px_rgba(0,0,0,0.08)]">
            <h3 className="text-base font-semibold text-[#1D1D1D] mb-4">
              Customer Reviews
            </h3>
            <div className="flex items-center gap-8 mt-[30px]">
              {/* Bar chart */}
              <div className="flex-1 space-y-[30px]">
                {[
                  { label: "1", width: "85%" },
                  { label: "2", width: "72%" },
                  { label: "3", width: "30%" },
                  { label: "4", width: "55%" },
                  { label: "5", width: "48%" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span className="text-xs text-[#1D1D1D80] w-2">{row.label}</span>
                    <div className="flex-1 h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#FBBC05]"
                        style={{ width: row.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Score */}
              <div className="flex flex-col items-center gap-1 min-w-[90px]">
                <span className="text-6xl font-black text-[#1D1D1D] leading-none">
                  5.0
                </span>
                <StarRating score={5} size="md" />
                <span className="text-xs text-[#1D1D1D80]">500 reviews</span>
              </div>
            </div>
          </div>

          {/* Individual Review Cards */}
          <div className="space-y-[30px] max-w-[1000px] mx-auto">
            {[
              {
                name: "Lorem ipsum dolor",
                rating: 4,
                date: "01 Jun 2025",
                text: "Lorem ipsum dolor sit amet consectetur. Nec et semper dignissim mauris tristique quisque. Non morbi consequat euismod odio pharetra consequat amet semper. Tellus id. Lorem ipsum dolor sit amet consectetur. Nec et semper dignissim mauris tristique quisque. Non morbi consequat euismod odio pharetra consequat amet semper. Tellus id.",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Lorem ipsum dolor",
                rating: 4,
                date: "01 Jun 2025",
                text: "Lorem ipsum dolor sit amet consectetur. Nec et semper dignissim mauris tristique quisque. Non morbi consequat euismod odio pharetra consequat amet semper. Tellus id. Lorem ipsum dolor sit amet consectetur. Nec et semper dignissim mauris tristique quisque. Non morbi consequat euismod odio pharetra consequat amet semper. Tellus id.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="rounded-[30px] p-[30px] bg-white shadow-[0px_20px_40px_0px_rgba(0,0,0,0.10)]"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-[10px]">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-[40px] h-[40px] rounded-full object-cover"
                    />
                    <span className="font-semibold text-sm text-[#1D1D1D]">
                      {review.name}
                    </span>
                  </div>
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} filled={s <= review.rating} size="sm" />
                    ))}
                  </div>
                </div>
                {/* Body */}
                <p className="text-sm text-[#1D1D1D] leading-relaxed mb-3">
                  {review.text}
                </p>
                {/* Date */}
                <span className="text-xs text-[#1D1D1D80]">{review.date}</span>
              </div>
            ))}
          </div>

          {/* View More Review Button */}
          <div className="flex justify-center mt-6 mb-4">
            <button className="flex items-center gap-2 text-sm text-[#1D1D1D] hover:text-[#1D1D1D80] transition-colors cursor-pointer font-medium">
              <img src="/assets/icons/arrow_drop_down.svg" alt="dropdown" className="w-4 h-2" />
              <span>View More Review</span>
            </button>
          </div>
        </div>
      </section>

      {/* Related & Similar Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
        <ProductCarouselSection
          title="Related products"
          products={relatedProducts}
          linkProducts={true}
          centerTitle={true}
        />
        <ProductCarouselSection
          title="Similar products"
          products={relatedProducts}
          linkProducts={true}
          centerTitle={true}
        />
      </div>
    </main>
  );
};

export default ProductDetail;
