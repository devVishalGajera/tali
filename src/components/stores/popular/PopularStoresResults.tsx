"use client";

import StoresFilterSidebar, { type Filters } from "../StoresFilterSidebar";
import StoresListCard, { type StoreListItem } from "../StoresListCard";

interface Props {
  stores: StoreListItem[];
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
}

const PopularStoresResults = ({ stores, filters, onFiltersChange }: Props) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
    <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Popular Wine Wholesalers in Surat</h2>

    <div className="flex flex-col md:flex-row gap-6">
      <StoresFilterSidebar filters={filters} onChange={onFiltersChange} />

      <div className="flex-1 space-y-4">
        {stores.length > 0 ? (
          stores.map((store) => <StoresListCard key={store.id} store={store} />)
        ) : (
          <p className="text-sm text-[#1D1D1D80] py-10 text-center">
            No stores match your filters.
          </p>
        )}
      </div>
    </div>
  </section>
);

export default PopularStoresResults;
