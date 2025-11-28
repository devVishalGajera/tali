"use client";

import { useState } from "react";

const ProductFiltersSidebar = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 920]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = [
    { name: "Aluminum", count: 0 },
    { name: "Baby", count: 1 },
    { name: "Beauty", count: 1 },
    { name: "Bottle", count: 1 },
    { name: "Champagne", count: 5 },
    { name: "Concrete", count: 1 },
    { name: "Gin", count: 0 },
    { name: "Home", count: 1 },
    { name: "Liqueur", count: 7 },
    { name: "Pants", count: 0 },
    { name: "Tequila", count: 6 },
    { name: "Uncategorized", count: 1 },
    { name: "Vodka", count: 8 },
    { name: "Whisky", count: 5 },
    { name: "Win Accessories", count: 5 },
    { name: "Wine", count: 4 },
  ];

  const brands = [
    { name: "Alcohol", count: 0 },
    { name: "Bourbon", count: 0 },
    { name: "Cocktail Bar", count: 0 },
    { name: "Cocktails", count: 4 },
    { name: "Glenfiddich", count: 5 },
    { name: "Patron", count: 6 },
    { name: "Vodka", count: 3 },
    { name: "Wineclub", count: 2 },
  ];

  const tags = [
    "ad",
    "adipisci",
    "awesome",
    "Beer",
    "Beverage",
    "Beverages",
    "ergonomic",
    "est",
    "et",
    "eveniet",
    "expedita",
    "fantastic",
    "hic",
    "illo",
    "Liqueur",
    "Luxury Drinks",
    "Miniatures",
    "qui",
    "recusandae",
    "Vodka",
    "Whiskey",
    "White Wine",
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <>
      <style>{`
        .slider-input::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #F02A0B;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 20;
        }
        .slider-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #F02A0B;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 20;
        }
        .slider-input::-webkit-slider-runnable-track {
          background: transparent;
        }
        .slider-input::-moz-range-track {
          background: transparent;
        }
      `}</style>
      {/* Mobile Filter Dropdowns */}
      <div className="md:hidden mb-4 space-y-3">
        <select className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-lg bg-white text-sm text-[#646057] focus:outline-none focus:ring-2 focus:ring-[#F02A0B]">
          <option value="">Shop by category</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name} ({category.count})
            </option>
          ))}
        </select>
        <select className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-lg bg-white text-sm text-[#646057] focus:outline-none focus:ring-2 focus:ring-[#F02A0B]">
          <option value="">Filter by price</option>
          <option value="0-100">$0 - $100</option>
          <option value="100-300">$100 - $300</option>
          <option value="300-500">$300 - $500</option>
          <option value="500-920">$500 - $920</option>
        </select>
        <select className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-lg bg-white text-sm text-[#646057] focus:outline-none focus:ring-2 focus:ring-[#F02A0B]">
          <option value="">Product Brands</option>
          {brands.map((brand) => (
            <option key={brand.name} value={brand.name}>
              {brand.name} ({brand.count})
            </option>
          ))}
        </select>
        <select className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-lg bg-white text-sm text-[#646057] focus:outline-none focus:ring-2 focus:ring-[#F02A0B]">
          <option value="">Product tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      {/* Desktop Filter Sidebar */}
      <aside className="hidden md:block w-full md:w-64 lg:w-80 flex-shrink-0 mb-8 md:mb-0">
        <div className="border border-[#ECECEC] rounded-lg p-4 md:p-6 bg-white">
          <div className="space-y-6">
        {/* Shop by category */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex items-center justify-between text-base font-semibold text-[#1D1D1D] mb-4"
          >
            <span>Shop by category</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isCategoryOpen && (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between text-sm text-[#646057] cursor-pointer hover:text-[#F02A0B] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#646057]"></span>
                    <span>{category.name}</span>
                  </div>
                  <span className="text-gray-500">({category.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter by price */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className="w-full flex items-center justify-between text-base font-semibold text-[#1D1D1D] mb-4"
          >
            <span>Filter by price</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isPriceOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isPriceOpen && (
            <div className="space-y-4">
              <div className="relative">
                <div className="relative h-2 bg-gray-200 rounded-lg">
                  <div
                    className="absolute h-2 bg-[#F02A0B] rounded-lg"
                    style={{
                      left: `${(priceRange[0] / 920) * 100}%`,
                      width: `${((priceRange[1] - priceRange[0]) / 920) * 100}%`,
                    }}
                  ></div>
                  <input
                    type="range"
                    min="0"
                    max="920"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val <= priceRange[1]) {
                        setPriceRange([val, priceRange[1]]);
                      }
                    }}
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-10 slider-input"
                  />
                  <input
                    type="range"
                    min="0"
                    max="920"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= priceRange[0]) {
                        setPriceRange([priceRange[0], val]);
                      }
                    }}
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-10 slider-input"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#646057]">
                  Price: ${priceRange[0]} – ${priceRange[1]}
                </span>
                <button className="px-4 py-1.5 text-sm font-medium text-[#1D1D1D] bg-transparent hover:bg-gray-50 rounded transition-colors">
                  FILTER
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Brands */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => setIsBrandOpen(!isBrandOpen)}
            className="w-full flex items-center justify-between text-base font-semibold text-[#1D1D1D] mb-4"
          >
            <span>Product Brands</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isBrandOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isBrandOpen && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="flex items-center justify-between text-sm text-[#646057] cursor-pointer hover:text-[#F02A0B] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#646057]"></span>
                    <span>{brand.name}</span>
                  </div>
                  <span className="text-gray-500">({brand.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product tags */}
        <div>
          <button
            onClick={() => setIsTagsOpen(!isTagsOpen)}
            className="w-full flex items-center justify-between text-base font-semibold text-[#1D1D1D] mb-4"
          >
            <span>Product tags</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isTagsOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isTagsOpen && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors duration-300 border ${
                      isSelected
                        ? "bg-[#989389] text-white border-[#989389]"
                        : "bg-transparent text-[#989389] border-[#989389] hover:bg-gray-50"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default ProductFiltersSidebar;

