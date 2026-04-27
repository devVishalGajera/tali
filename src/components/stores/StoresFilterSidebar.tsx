"use client";

import { useState } from "react";

const localities = [
  "Use Precise Location",
  "Mira Road East",
  "Kandivali",
  "Malad West",
  "Thane West",
  "Nalasopara East",
  "Vashi",
  "Andheri East",
  "Colaba",
];

const sortOptions = ["Relevance", "Rating", "Newest"];

interface Filters {
  premiumOnly: boolean;
  deliveryOnly: boolean;
  sort: string;
  localities: string[];
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const StoresFilterSidebar = ({ filters, onChange }: Props) => {
  const toggle = (key: keyof Pick<Filters, "premiumOnly" | "deliveryOnly">) =>
    onChange({ ...filters, [key]: !filters[key] });

  const toggleLocality = (loc: string) => {
    const next = filters.localities.includes(loc)
      ? filters.localities.filter((l) => l !== loc)
      : [...filters.localities, loc];
    onChange({ ...filters, localities: next });
  };

  return (
    <aside className="w-full md:w-[200px] shrink-0">
      <div className="border border-[#F0F0F0] rounded-xl p-4 space-y-5">
        {/* Star Rating */}
        <div>
          <p className="text-sm font-semibold text-[#1D1D1D] mb-3">Star rating</p>
          <div className="space-y-2">
            {[
              { key: "premiumOnly" as const, label: "Premium Stores" },
              { key: "deliveryOnly" as const, label: "Delivery Available" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={() => toggle(key)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#00845F]"
                />
                <span className="text-sm text-[#1D1D1D]">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort by */}
        <div>
          <p className="text-sm font-semibold text-[#1D1D1D] mb-3">Sort by:</p>
          <div className="space-y-2">
            {sortOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value={opt}
                  checked={filters.sort === opt}
                  onChange={() => onChange({ ...filters, sort: opt })}
                  className="w-4 h-4 accent-[#00845F]"
                />
                <span className="text-sm text-[#1D1D1D]">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Find Results Near You */}
        <div>
          <p className="text-sm font-semibold text-[#1D1D1D] mb-3">Find Results Near You:</p>
          <div className="space-y-2">
            {localities.map((loc) => (
              <label key={loc} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.localities.includes(loc)}
                  onChange={() => toggleLocality(loc)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#00845F]"
                />
                <span className="text-sm text-[#1D1D1D]">{loc}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StoresFilterSidebar;
export type { Filters };
