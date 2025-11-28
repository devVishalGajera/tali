"use client";

import { useState } from "react";

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState("All Whiskey");

  const categories = [
    "All Whiskey",
    "Bourbon",
    "Moonshine",
    "Scotch",
    "Irish",
    "Japanese",
    "Rye",
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6 md:mb-8 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveTab(category)}
          className={`px-5 py-2.5 text-sm md:text-base font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${
            activeTab === category
              ? "bg-[#F02A0B] text-white"
              : "bg-white text-[#646057] border border-gray-200 hover:border-gray-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;

