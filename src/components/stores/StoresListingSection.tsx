"use client";

import { useState } from "react";
import StoresFilterSidebar, { type Filters } from "./StoresFilterSidebar";
import StoresListCard, { type StoreListItem } from "./StoresListCard";

const mockStores: StoreListItem[] = [
  {
    id: 1,
    name: "The Grand Cellar",
    location: "Bandra West, Mumbai",
    image: "/assets/images/banner/store_banner.png",
    amenities: ["Free Wi-Fi", "Free parking", "Dining Table"],
    description: "A curated selection of fine spirits and wines from around the world.",
    storeRating: 4.74,
    deliveryRating: 4.9,
    deliveryAvailable: true,
    isPremium: true,
  },
  {
    id: 2,
    name: "Local Brews & Spirits",
    location: "Koramangala, Bengaluru",
    image: "/assets/images/banner/store_banner.png",
    amenities: ["Free Wi-Fi", "Free parking", "Dining Table"],
    description: "Your neighborhood spot for craft beers and popular local spirits.",
    storeRating: 4.74,
    deliveryRating: 4.9,
    deliveryAvailable: false,
  },
  {
    id: 3,
    name: "Vintage Vintages",
    location: "DLF Phase 4, Gurugram",
    image: "/assets/images/banner/store_banner.png",
    amenities: ["Free Wi-Fi", "Free parking", "Dining Table"],
    description: "Specializing in rare and aged wines, perfect for collectors.",
    storeRating: 4.74,
    deliveryRating: 4.9,
    deliveryAvailable: true,
  },
  {
    id: 4,
    name: "The Bottle Shop",
    location: "Adyar, Chennai",
    image: "/assets/images/banner/store_banner.png",
    amenities: ["Free Wi-Fi", "Free parking", "Dining Table"],
    description: "Your one-stop shop for all your beverage needs, great prices.",
    storeRating: 4.74,
    deliveryRating: 4.9,
    deliveryAvailable: true,
  },
  {
    id: 5,
    name: "The Bottle Shop",
    location: "Adyar, Chennai",
    image: "/assets/images/banner/store_banner.png",
    amenities: ["Free Wi-Fi", "Free parking", "Dining Table"],
    description: "Your one-stop shop for all your beverage needs, great prices.",
    storeRating: 4.74,
    deliveryRating: 4.9,
    deliveryAvailable: false,
  },
];

const defaultFilters: Filters = {
  premiumOnly: false,
  deliveryOnly: false,
  sort: "Relevance",
  localities: [],
};

const StoresListingSection = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
      <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Popular Wine Wholesalers in Surat</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <StoresFilterSidebar filters={filters} onChange={setFilters} />

        <div className="flex-1 space-y-4">
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
