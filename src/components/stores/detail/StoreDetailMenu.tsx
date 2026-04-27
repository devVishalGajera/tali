"use client";

import { useState } from "react";
import type { MenuItem } from "./storeDetailTypes";

interface Props {
  menuTabs: string[];
  menuItems: MenuItem[];
}

const TOTAL_PAGES = 10;

/** Returns the page numbers (and "..." gaps) to display in the pagination bar. */
const getPageItems = (current: number, total: number): (number | "...")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | "...")[] = [1];

  if (current > 3) items.push("...");

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) items.push(p);

  if (current < total - 2) items.push("...");

  items.push(total);
  return items;
};

const StoreDetailMenu = ({ menuTabs, menuItems }: Props) => {
  const [activeTab, setActiveTab]   = useState(menuTabs[0] ?? "");
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);

  const goTo = (p: number) => setPage(Math.min(TOTAL_PAGES, Math.max(1, p)));

  const filtered = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-6 border-t border-[#F0F0F0]">
      <h2 className="text-xl font-bold text-[#1D1D1D] mb-4">Our Menu</h2>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#F0F0F0] mb-4">
        {menuTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-[#1D1D1D] border-b-2 border-[#1D1D1D]"
                : "text-[#1D1D1D80]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1D1D1D80]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={`Search in ${activeTab} menu...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-[#E0E0E0] rounded-lg text-sm text-[#1D1D1D] placeholder:text-[#1D1D1D80] focus:outline-none focus:border-[#1D1D1D]"
        />
      </div>

      {/* Product list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3 border border-[#F0F0F0] rounded-lg"
          >
            <span className="text-sm text-[#1D1D1D]">{item.name}</span>
            <span className="text-sm font-medium text-[#1D1D1D]">{item.price}</span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1">
        {/* First / Prev */}
        <button onClick={() => goTo(1)}          disabled={page === 1} className="w-8 h-8 rounded-full text-xs text-[#1D1D1D80] border border-[#F1F1F1] hover:text-[#1D1D1D] disabled:opacity-40 transition-colors">«</button>
        <button onClick={() => goTo(page - 1)}   disabled={page === 1} className="w-8 h-8 rounded-full text-xs text-[#1D1D1D80] border border-[#F1F1F1] hover:text-[#1D1D1D] disabled:opacity-40 transition-colors">‹</button>

        {/* Dynamic page numbers */}
        {getPageItems(page, TOTAL_PAGES).map((item, idx) =>
          item === "..." ? (
            <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-[#1D1D1D80]">...</span>
          ) : (
            <button
              key={item}
              onClick={() => goTo(item)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                page === item
                  ? "bg-[#F02A0B] text-white border border-[#F02A0B]"
                  : "text-[#1D1D1D80] border border-[#F1F1F1] hover:text-[#1D1D1D]"
              }`}
            >
              {item}
            </button>
          )
        )}

        {/* Next / Last */}
        <button onClick={() => goTo(page + 1)}       disabled={page === TOTAL_PAGES} className="w-8 h-8 rounded-full text-xs text-[#1D1D1D80] border border-[#F1F1F1] hover:text-[#1D1D1D] disabled:opacity-40 transition-colors">›</button>
        <button onClick={() => goTo(TOTAL_PAGES)}    disabled={page === TOTAL_PAGES} className="w-8 h-8 rounded-full text-xs text-[#1D1D1D80] border border-[#F1F1F1] hover:text-[#1D1D1D] disabled:opacity-40 transition-colors">»</button>
      </div>
    </section>
  );
};

export default StoreDetailMenu;
