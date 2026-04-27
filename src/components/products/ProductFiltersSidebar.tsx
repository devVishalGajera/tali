"use client";

/**
 * ProductFiltersSidebar
 *
 * All active filters live in the URL — single-select for sub-category and
 * brand (matches the API's single-value fields), radio for price range.
 * Reading exclusively from useSearchParams() avoids stale server-prop race.
 */

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition }     from "react";
import type { FilterOptions }                        from "@/lib/api/filters";
import type { ProductsSearchParams }                 from "@/app/products/page";

/* ── Sub-components ──────────────────────────────────────────── */
const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const Section = ({
  title, open, onToggle, children,
}: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) => (
  <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-sm font-semibold text-[#1D1D1D] mb-3 pt-1"
    >
      {title}
      <Chevron open={open} />
    </button>
    {open && children}
  </div>
);

/* ── Props ───────────────────────────────────────────────────── */
interface Props {
  filterOptions: FilterOptions | null;
  searchParams:  ProductsSearchParams;
}

/* ── Main component ──────────────────────────────────────────── */
export default function ProductFiltersSidebar({ filterOptions }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();           // always fresh — no stale prop fallback
  const [isPending, startTransition] = useTransition();

  /* Derive active filters exclusively from live URL params */
  const activeSubcat = params.get("subcats") ?? "";   // single id string e.g. "14"
  const activeBrand  = params.get("brands")  ?? "";   // single id string e.g. "46"
  const activePrice  = params.get("price")   ?? "All";

  const [openSections, setOpenSections] = useState({ subcat: true, price: true, brand: true });
  const toggle = (key: keyof typeof openSections) =>
    setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  const [brandSearch, setBrandSearch] = useState("");

  /* Push a single key→value to the URL; empty string removes the key */
  const pushFilter = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "All") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    /* Changing subcategory also clears brand and vice-versa to avoid conflicts */
    if (key === "subcats") next.delete("brands");
    if (key === "brands")  next.delete("subcats");
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }, [params, pathname, router]);

  /* Selecting the same radio again → deselect (clear the filter) */
  const selectOrClear = (key: string, id: string) => {
    pushFilter(key, params.get(key) === id ? "" : id);
  };

  const data = {
    prices:  filterOptions?.priceRangeArray  ?? [],
    subcats: filterOptions?.subcategoryArray ?? [],
    brands:  filterOptions?.brandArray       ?? [],
  };

  const filteredBrands = data.brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const hasActiveFilters = !!activeSubcat || !!activeBrand || (activePrice !== "All" && activePrice !== "");

  const clearAll = () =>
    startTransition(() => { router.push(pathname, { scroll: false }); });

  return (
    <>
      {/* ── Mobile dropdowns ───────────────────────────────── */}
      <div className="md:hidden mb-4 space-y-3">
        <select
          value={activeSubcat}
          className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-lg bg-white text-sm text-[#646057] focus:outline-none focus:ring-2 focus:ring-[#F02A0B]"
          onChange={(e) => pushFilter("subcats", e.target.value)}
        >
          <option value="">All Sub-categories</option>
          {data.subcats.map((s) => (
            <option key={s.id} value={String(s.id)}>{s.name}</option>
          ))}
        </select>
        <select
          value={activePrice}
          className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-lg bg-white text-sm text-[#646057] focus:outline-none focus:ring-2 focus:ring-[#F02A0B]"
          onChange={(e) => pushFilter("price", e.target.value)}
        >
          <option value="All">Filter by price</option>
          {data.prices.filter(p => p.title !== "All").map((p) => (
            <option key={p.title} value={p.title}>{p.title}</option>
          ))}
        </select>
        <select
          value={activeBrand}
          className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-lg bg-white text-sm text-[#646057] focus:outline-none focus:ring-2 focus:ring-[#F02A0B]"
          onChange={(e) => pushFilter("brands", e.target.value)}
        >
          <option value="">All Brands</option>
          {data.brands.map((b) => (
            <option key={b.id} value={String(b.id)}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* ── Desktop sidebar ────────────────────────────────── */}
      <aside
        aria-label="Product filters"
        className={`hidden md:block w-full md:w-60 lg:w-64 flex-shrink-0 mb-8 md:mb-0 transition-opacity ${isPending ? "opacity-60 pointer-events-none" : ""}`}
      >
        <div className="border border-[#ECECEC] rounded-xl p-5 bg-white sticky top-[88px]">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#1D1D1D]">Filters</h2>
            {hasActiveFilters && (
              <button onClick={clearAll} className="text-xs text-[#F02A0B] font-medium hover:underline">
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-1">

            {/* ── 1. Sub-category (single select) ──────────── */}
            {data.subcats.length > 0 && (
              <Section title="Sub-category" open={openSections.subcat} onToggle={() => toggle("subcat")}>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {data.subcats.map((s) => (
                    <label key={s.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="subcat"
                        checked={activeSubcat === String(s.id)}
                        onChange={() => selectOrClear("subcats", String(s.id))}
                        className="w-3.5 h-3.5 accent-[#F02A0B] shrink-0"
                      />
                      <span className={`text-sm transition-colors ${
                        activeSubcat === String(s.id)
                          ? "text-[#F02A0B] font-medium"
                          : "text-[#646057] group-hover:text-[#F02A0B]"
                      }`}>
                        {s.name}
                      </span>
                    </label>
                  ))}
                </div>
              </Section>
            )}

            {/* ── 2. Price range (single select) ───────────── */}
            {data.prices.length > 0 && (
              <Section title="Filter by price" open={openSections.price} onToggle={() => toggle("price")}>
                <div className="space-y-2">
                  {data.prices.map((range) => (
                    <label key={range.title} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="price_range"
                        checked={activePrice === range.title}
                        onChange={() => pushFilter("price", range.title)}
                        className="w-3.5 h-3.5 accent-[#F02A0B] shrink-0"
                      />
                      <span className={`text-sm transition-colors ${
                        activePrice === range.title
                          ? "text-[#F02A0B] font-medium"
                          : "text-[#646057] group-hover:text-[#F02A0B]"
                      }`}>
                        {range.title}
                      </span>
                    </label>
                  ))}
                </div>
              </Section>
            )}

            {/* ── 3. Brands (single select + search) ───────── */}
            {data.brands.length > 0 && (
              <Section title="Product Brands" open={openSections.brand} onToggle={() => toggle("brand")}>
                <input
                  type="text"
                  placeholder="Search brands…"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full mb-3 px-3 py-1.5 text-xs border border-[#ECECEC] rounded-md outline-none focus:border-[#F02A0B] text-[#1D1D1D] placeholder-[#1D1D1D40]"
                />
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {filteredBrands.map((b) => (
                    <label key={b.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="brand"
                        checked={activeBrand === String(b.id)}
                        onChange={() => selectOrClear("brands", String(b.id))}
                        className="w-3.5 h-3.5 accent-[#F02A0B] shrink-0"
                      />
                      <span className={`text-sm transition-colors ${
                        activeBrand === String(b.id)
                          ? "text-[#F02A0B] font-medium"
                          : "text-[#646057] group-hover:text-[#F02A0B]"
                      }`}>
                        {b.name}
                      </span>
                    </label>
                  ))}
                  {filteredBrands.length === 0 && (
                    <p className="text-xs text-[#1D1D1D80] py-2">No brands found.</p>
                  )}
                </div>
              </Section>
            )}

          </div>
        </div>
      </aside>
    </>
  );
}
