"use client";

import { useState } from "react";
import type { Filters } from "./StoresFilterSidebar";
import PopularStoresHero    from "./popular/PopularStoresHero";
import PopularStoresResults from "./popular/PopularStoresResults";
import { popularStores }    from "./popular/popularStoresMock";

const defaultFilters: Filters = {
  premiumOnly: false,
  deliveryOnly: false,
  sort: "Relevance",
  localities: [],
};

const PopularStoresPage = () => {
  const [search, setSearch]   = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const filtered = popularStores
    .filter((s) => {
      if (filters.premiumOnly && !s.isPremium) return false;
      if (filters.deliveryOnly && !s.deliveryAvailable) return false;
      if (search &&
          !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.location.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => filters.sort === "Rating" ? b.storeRating - a.storeRating : 0);

  return (
    <main className="w-full bg-white">
      <PopularStoresHero search={search} onSearch={setSearch} />
      <PopularStoresResults stores={filtered} filters={filters} onFiltersChange={setFilters} />
    </main>
  );
};

export default PopularStoresPage;
