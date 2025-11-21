"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocation } from "../modals/LocationProvider";

const Header = () => {
  const { location, showModal } = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      name: "Wine",
      icon: "/assets/categories/icons/wineIcon.svg",
      image: "/assets/images/bottles/single-bottle.png",
      subcategories: [
        ["All Wine", "Red Wine", "White Wine"],
        ["Rose Wine", "Sparkling Wine", "Champagne"],
        ["Dessert Wine", "Fortified Wine", "Organic Wine"],
      ],
    },
    {
      name: "Spirits",
      icon: "/assets/categories/icons/spiritsIcon.svg",
      image: "/assets/images/bottles/single-bottle.png",
      subcategories: [
        ["All Spirits", "Premium Spirits", "Craft Spirits"],
        ["Liqueurs", "Aperitifs", "Digestifs"],
        ["Cocktail Mixers", "Syrups", "Bitters"],
      ],
    },
    {
      name: "Whiskey",
      icon: "/assets/categories/icons/whiskeyIcon.svg",
      image: "/assets/images/bottles/single-bottle.png",
      subcategories: [
        ["All Whiskey", "Scotch", "Limited Release"],
        ["Bourbon", "Irish", "Rye"],
        ["Moonshine", "Japanese", "Canadian"],
      ],
    },
    {
      name: "Tequila",
      icon: "/assets/categories/icons/tequilaIcon.svg",
      image: "/assets/images/bottles/single-bottle.png",
      subcategories: [
        ["All Tequila", "Blanco", "Reposado"],
        ["Anejo", "Extra Anejo", "Mezcal"],
        ["Premium Tequila", "Flavored", "Limited Edition"],
      ],
    },
    {
      name: "Rum",
      icon: "/assets/categories/icons/rumIcon.svg",
      image: "/assets/images/bottles/single-bottle.png",
      subcategories: [
        ["All Rum", "White Rum", "Dark Rum"],
        ["Spiced Rum", "Aged Rum", "Premium Rum"],
        ["Flavored Rum", "Overproof", "Coconut Rum"],
      ],
    },
    {
      name: "Beer",
      icon: "/assets/categories/icons/beerIcon.svg",
      image: "/assets/images/bottles/single-bottle.png",
      subcategories: [
        ["All Beer", "Lager", "IPA"],
        ["Stout", "Porter", "Wheat Beer"],
        ["Craft Beer", "Imported Beer", "Local Brews"],
      ],
    },
    {
      name: "Vodka",
      icon: "/assets/categories/icons/vodkaIcon.svg",
      image: "/assets/images/bottles/single-bottle.png",
      subcategories: [
        ["All Vodka", "Premium Vodka", "Flavored Vodka"],
        ["Russian Vodka", "Polish Vodka", "Craft Vodka"],
        ["Grey Goose", "Belvedere", "Ketel One"],
      ],
    },
    {
      name: "Gin",
      icon: "/assets/categories/icons/ginIcon.svg",
      image: "/assets/images/bottles/single-bottle.png",
      subcategories: [
        ["All Gin", "London Dry", "Plymouth Gin"],
        ["Old Tom", "Navy Strength", "Craft Gin"],
        ["Flavored Gin", "Sloe Gin", "Premium Gin"],
      ],
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleCategoryClick = (categoryName: string) => {
    setOpenDropdown(openDropdown === categoryName ? null : categoryName);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-50 w-full bg-white"
    >
      {/* Top Announcement Bar */}
      <div className="bg-[#1D1D1D] text-white py-2 text-xs font-medium h-[44px] flex items-center justify-center tracking-[2px] animate-fadeInDown">
        <span className="text-center px-4">FREE SHIPPING ON ALL ORDERS FROM $100</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="relative flex items-center justify-between px-3 sm:px-4 md:px-8 py-3 sm:py-4 bg-white overflow-hidden">
        {/* Left Section - Location */}
        <div
          onClick={showModal}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group flex-shrink-0 z-10 transition-all duration-300 hover:opacity-80"
        >
          <Image
            src="/assets/header/icons/locationIcon.svg"
            alt="Location"
            width={20}
            height={20}
            className="sm:w-[24px] sm:h-[24px] md:w-[30px] md:h-[30px] transition-transform duration-300 group-hover:scale-110"
          />
          <div className="flex items-center gap-1">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-[#1D1D1D80] leading-tight">
                Location
              </span>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="text-sm sm:text-base md:text-[20px] font-medium text-[#1D1D1D] leading-tight">
                  {location}
                </span>
              </div>
            </div>
            <Image
              src="/assets/header/icons/arrowDownIcon.svg"
              alt="Arrow Down"
              width={12}
              height={12}
              className="sm:w-[16px] sm:h-[16px] md:w-[20px] md:h-[20px] transition-transform duration-300 group-hover:rotate-180"
            />
          </div>
        </div>

        {/* Center Section - Logo (Hidden on mobile, visible on desktop) */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 z-0">
          <Image
            src="/assets/logo/logo-64x64.svg"
            alt="Talli Logo"
            width={64}
            height={64}
            className="md:w-20 md:h-20 transition-transform duration-300 hover:scale-110"
            priority
          />
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 z-10">
          {/* Wishlist */}
          <div className="relative cursor-pointer w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300 hover:scale-110 active:scale-95">
            <Image
              src="/assets/header/icons/wishlistIcon.svg"
              alt="Wishlist"
              width={24}
              height={24}
              className="w-full h-full transition-opacity duration-300 hover:opacity-80"
            />
            <span className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-black text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center leading-none transition-transform duration-300 hover:scale-110">
              0
            </span>
          </div>

          {/* Account */}
          <div className="cursor-pointer w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 relative transition-transform duration-300 hover:scale-110 active:scale-95">
            <Image
              src="/assets/header/icons/userIcon.svg"
              alt="Account"
              width={24}
              height={24}
              className="w-full h-full transition-opacity duration-300 hover:opacity-80"
            />
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300 hover:scale-110 active:scale-95">
            <Image
              src="/assets/header/icons/cartIcon.svg"
              alt="Cart"
              width={24}
              height={24}
              className="w-full h-full transition-opacity duration-300 hover:opacity-80"
            />
            <span className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-black text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center leading-none transition-transform duration-300 hover:scale-110">
              0
            </span>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar - Hidden on mobile, visible on md and above */}
      <div className="hidden md:flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide relative">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className="flex flex-col items-center gap-1 sm:gap-1.5 cursor-pointer group hover:text-gray-600 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[60px] sm:min-w-[70px] md:min-w-[70px] lg:min-w-[90px] xl:min-w-[100px] hover:scale-110 active:scale-95"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="text-black group-hover:text-gray-600 transition-transform duration-300 group-hover:scale-110">
              <Image
                src={category.icon}
                alt={category.name}
                width={24}
                height={24}
                className="sm:w-7 sm:h-7 md:w-8 md:h-8"
              />
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <span className="text-[10px] sm:text-xs font-medium text-[#666666] group-hover:text-gray-600 transition-colors duration-300">
                {category.name}
              </span>
              <Image
                src="/assets/header/icons/arrowDownIcon.svg"
                alt="Arrow Down"
                width={8}
                height={8}
                className={`sm:w-[10px] sm:h-[10px] transition-transform duration-300 ${
                  openDropdown === category.name ? "rotate-180" : "group-hover:rotate-180"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dropdown Menu */}
      {openDropdown && (
        <div
          ref={dropdownRef}
          className="hidden md:block absolute left-0 right-0 z-40 bg-white shadow-lg border-t border-gray-200 animate-fadeInDown"
          style={{
            top: "100%",
          }}
        >
          {(() => {
            const selectedCategory = categories.find((cat) => cat.name === openDropdown);
            if (!selectedCategory) return null;

            return (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                  {/* Left Side - Product Image */}
                  <div className="col-span-1">
                    <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
                      <Image
                        src={selectedCategory.image}
                        alt={selectedCategory.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Right Side - Subcategories */}
                  <div className="col-span-2">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-bold text-[#1D1D1D]">{selectedCategory.name}</h3>
                      <button
                        onClick={() => setOpenDropdown(null)}
                        className="text-gray-500 hover:text-[#1D1D1D] transition-colors"
                        aria-label="Close dropdown"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {selectedCategory.subcategories.map((column, columnIndex) => (
                        <div
                          key={columnIndex}
                          className="space-y-3"
                        >
                          {column.map((subcategory, subIndex) => (
                            <Link
                              key={subIndex}
                              href={`/category/${subcategory.toLowerCase().replace(/\s+/g, "-")}`}
                              className="block text-sm text-[#1D1D1D] hover:text-gray-600 transition-colors"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {subcategory}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </header>
  );
};

export default Header;
