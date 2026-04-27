"use client";

/**
 * ProductFiltersSidebar
 *
 * All active filters are stored in the URL (searchParams), NOT in useState.
 * This means:
 *  - Google can crawl every filtered combination
 *  - Users can bookmark / share filtered URLs
 *  - Browser back/forward restores filters correctly
 *  - No hydration mismatch between server and client
 *
 * On every checkbox / radio change we call router.push() with the
 * updated URLSearchParams, which triggers a server re-render of the
 * page (and a fresh product list fetch) while keeping the sidebar interactive.
 */

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition }     from "react";
import type { FilterOptions }        from "@/lib/api/filters";
import type { ProductsSearchParams } from "@/app/products/page";


/* ── Helpers ─────────────────────────────────────────────────── */
const toIds  = (val?: string): number[] =>
  val ? val.split(",").map(Number).filter(Boolean) : [];

const fromIds = (ids: number[]): string => ids.join(",");

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
  <div className="border-b border-gray-100 last:border-0 last:pb-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-sm font-semibold text-[#1D1D1D] mb-3"
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
export default function ProductFiltersSidebar({ filterOptions, searchParams }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /* Derive active filters from URL */
  const activeSubcatIds = toIds(params.get("subcats") ?? searchParams.subcats);
  const activeBrandIds    = toIds(params.get("brands")     ?? searchParams.brands);
  const activePrice       = params.get("price") ?? searchParams.price ?? "All";

  /* Local accordion state only */
  const [openSections, setOpenSections] = useState({
    subcat: true, price: true, brand: true,
  });
  const toggle = (key: keyof typeof openSections) =>
    setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  const [brandSearch, setBrandSearch] = useState("");

  /* Core URL-push helper */
  const pushFilter = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "All") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }, [params, pathname, router]);

  /* Toggle helpers */
  const toggleId = (key: string, current: number[], id: number) => {
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    pushFilter(key, fromIds(next));
  };

  const data = {
    prices:  filterOptions?.priceRangeArray  ?? [],
    subcats: filterOptions?.subcategoryArray ?? [],
    brands:  filterOptions?.brandArray       ?? [],
  };

  const filteredBrands = data.brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const hasActiveFilters =
    activeSubcatIds.length > 0 ||
    activeBrandIds.length  > 0 ||
    (activePrice !== "All" && activePrice !== "");

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <>
      {/* ── Mobile dropdowns ───────────────────────────────── */}
      <div className="md:hidden mb-4 space-y-3">
        <select
          className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-lg bg-white text-sm text-[#646057] focus:outline-none focus:ring-2 focus:ring-[#F02A0B]"
          onChange={(e) => pushFilter("price", e.target.value)}
        >
          <option value="">Filter by price</option>
          {data.prices.map((p) => (
            <option key={p.title} value={p.title}>{p.title}</option>
          ))}
        </select>
        <select
          className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-lg bg-white text-sm text-[#646057] focus:outline-none focus:ring-2 focus:ring-[#F02A0B]"
          onChange={(e) => pushFilter("brands", e.target.value)}
        >
          <option value="">Product Brands</option>
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
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[#1D1D1D]">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-[#F02A0B] font-medium hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-5">

            {/* ── 1. Sub-category ──────────────────────────── */}
            {data.subcats.length > 0 && (
              <Section title="Sub-category" open={openSections.subcat} onToggle={() => toggle("subcat")}>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                  {data.subcats.map((s) => (
                    <label key={s.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={activeSubcatIds.includes(s.id)}
                        onChange={() => toggleId("subcats", activeSubcatIds, s.id)}
                        className="w-3.5 h-3.5 accent-[#F02A0B] shrink-0"
                      />
                      <span className="text-sm text-[#646057] group-hover:text-[#F02A0B] transition-colors">
                        {s.name}
                      </span>
                    </label>
                  ))}
                </div>
              </Section>
            )}

            {/* ── 3. Price range ────────────────────────────── */}
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
                    <span className="text-sm text-[#646057] group-hover:text-[#F02A0B] transition-colors">
                      {range.title}
                    </span>
                  </label>
                ))}
              </div>
            </Section>

            {/* ── 4. Brands ─────────────────────────────────── */}
            {data.brands.length > 0 && (
              <Section title="Product Brands" open={openSections.brand} onToggle={() => toggle("brand")}>
                <input
                  type="text"
                  placeholder="Search brands…"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full mb-3 px-3 py-1.5 text-xs border border-[#ECECEC] rounded-md outline-none focus:border-[#F02A0B] text-[#1D1D1D] placeholder-[#1D1D1D40]"
                />
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                  {filteredBrands.map((b) => (
                    <label key={b.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={activeBrandIds.includes(b.id)}
                        onChange={() => toggleId("brands", activeBrandIds, b.id)}
                        className="w-3.5 h-3.5 accent-[#F02A0B] shrink-0"
                      />
                      <span className="text-sm text-[#646057] group-hover:text-[#F02A0B] transition-colors">
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
