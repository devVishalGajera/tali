"use client";

import { useState } from "react";
import StoresFilterSidebar, { type Filters } from "./StoresFilterSidebar";
import StoresListCard from "./StoresListCard";
import { talliStoreListItem } from "@/lib/store/talli-store";

const mockStores = [talliStoreListItem];

const defaultFilters: Filters = {
  premiumOnly: false,
  deliveryOnly: false,
  sort: "Relevance",
  localities: [],
};

const StoresListingSection = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = mockStores.filter((s) => {
    if (filters.premiumOnly && !s.isPremium) return false;
    if (filters.deliveryOnly && !s.deliveryAvailable) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (filters.sort === "Rating") return b.storeRating - a.storeRating;
    return 0;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
      <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1D] mb-4 sm:mb-6">
        Popular Wine Shops in Thane
      </h2>

      <button
        type="button"
        onClick={() => setFiltersOpen((o) => !o)}
        className="md:hidden w-full flex items-center justify-between gap-2 mb-4 px-4 py-3 border border-[#E8E8E8] rounded-xl text-sm font-semibold text-[#1D1D1D] bg-white"
      >
        <span>Filters &amp; sort</span>
        <svg
          className={`w-5 h-5 text-[#1D1D1D80] transition-transform ${filtersOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className={`${filtersOpen ? "block" : "hidden"} md:block`}>
          <StoresFilterSidebar filters={filters} onChange={setFilters} />
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          {sorted.length > 0 ? (
            sorted.map((store) => <StoresListCard key={store.id} store={store} />)
          ) : (
            <p className="text-sm text-[#1D1D1D80] py-10 text-center">
              No stores match your filters.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default StoresListingSection;
