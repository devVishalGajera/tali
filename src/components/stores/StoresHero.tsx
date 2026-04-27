"use client";

import { useState } from "react";

const StoresHero = () => {
  const [search, setSearch] = useState("");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1D] mb-1">
        Wine Shops, Liquor Stores &amp; Producers, Worldwide
      </h1>
      <p className="text-sm text-[#1D1D1D80] mb-6">Find Shops and Producers</p>
      <div className="relative max-w-xl">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1D1D1D80]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Shop And Producer name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-full border border-[#E0E0E0] text-sm text-[#1D1D1D] focus:outline-none focus:border-[#1D1D1D] transition-colors"
        />
      </div>
    </section>
  );
};

export default StoresHero;
