"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchSearchResults, type SearchProduct } from "@/lib/api/search";
import { proxyImageUrl } from "@/lib/utils/image";

type Variant = "hero" | "header";

interface Props {
  variant?: Variant;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export default function SearchWithDropdown({
  variant = "hero",
  className = "",
  inputClassName = "",
  placeholder,
}: Props) {
  const router = useRouter();
  const isHeader = variant === "header";

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const defaultPlaceholder = isHeader
    ? "Search for beer, wine, whiskey and more..."
    : "Shop And Product name";

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDrop(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const runSearch = useCallback((term: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!term.trim()) {
      setResults([]);
      setShowDrop(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setShowDrop(true);
    debounceRef.current = setTimeout(async () => {
      const data = await fetchSearchResults(term.trim());
      setResults(data);
      setLoading(false);
    }, 400);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    runSearch(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setShowDrop(false);
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  const barClosedClass = isHeader
    ? "flex items-center bg-gray-100 gap-2 w-full rounded-full px-3 py-2 transition-all duration-200"
    : `relative flex items-center shadow-[0px_0px_32px_0px_#00000029] bg-white rounded-full transition-all duration-300 ${
        isFocused ? "shadow-lg" : ""
      }`;

  const barOpenClass = isHeader
    ? "flex items-center bg-gray-100 gap-2 w-full px-3 py-2 border-b border-gray-100"
    : "relative flex items-center bg-white px-1 border-b border-gray-100";

  const openShellClass = showDrop
    ? `relative z-[60] rounded-lg border border-gray-200 bg-white overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${
        isHeader ? "" : "shadow-[0px_0px_32px_0px_#00000029]"
      }`
    : "";

  const searchBar = (
    <form onSubmit={handleSubmit}>
      <div className={showDrop ? barOpenClass : barClosedClass}>
        <div className={isHeader ? "flex-shrink-0" : "pl-4 md:pl-6 flex-shrink-0"}>
          <Image
            src="/assets/header/icons/searchIcon.svg"
            alt=""
            width={isHeader ? 15 : 20}
            height={isHeader ? 15 : 20}
            className={isHeader ? "opacity-40 w-[15px] h-[15px]" : "w-5 h-5 md:w-6 md:h-6"}
          />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0 || query.trim()) setShowDrop(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder ?? defaultPlaceholder}
          className={
            inputClassName ||
            (isHeader
              ? "flex-1 bg-transparent text-sm text-[#1D1D1D] placeholder:text-[#1D1D1D50] focus:outline-none min-w-0"
              : "flex-1 px-3 md:px-4 py-4 text-sm md:text-base text-[#1D1D1D] placeholder:text-[#A1A1A1] focus:outline-none bg-transparent")
          }
        />

        {query && !isHeader && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowDrop(false);
            }}
            className="text-gray-400 hover:text-gray-600 px-2 flex-shrink-0"
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className={isHeader ? "flex-shrink-0" : "pr-2 md:pr-3 flex-shrink-0"}>
          <button
            type="submit"
            className={
              isHeader
                ? "bg-[#006B4D] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#005a3f] transition-colors whitespace-nowrap"
                : "bg-[#006B4D] text-white font-semibold px-4 md:px-8 lg:px-5 py-2 text-sm md:text-base rounded-full hover:bg-[#005a40] transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95 transform"
            }
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );

  const dropdownInner = showDrop ? (
        <div className="bg-white overflow-hidden border-t border-gray-100">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-6">
              <svg className="animate-spin w-4 h-4 text-[#006B4D]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-sm text-gray-400">Searching…</span>
            </div>
          )}

          {!loading && results.length === 0 && query.trim() && (
            <div className="flex flex-col items-center gap-1 py-6 px-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <p className="text-sm text-gray-400 mt-1 text-center">
                No results for <span className="font-medium text-gray-600">&quot;{query}&quot;</span>
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="max-h-[280px] overflow-y-auto divide-y divide-gray-50">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    onClick={() => setShowDrop(false)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#F7FBF9] transition-colors group"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={proxyImageUrl(product.image_full_path)}
                        alt={product.name}
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1D1D1D] truncate group-hover:text-[#006B4D] transition-colors">
                        {product.name}
                      </p>
                      {product.volume && (
                        <p className="text-xs text-gray-400 mt-0.5">{product.volume}</p>
                      )}
                    </div>
                    {product.price && (
                      <span className="text-xs font-bold text-[#006B4D] flex-shrink-0 bg-[#EBF5F1] px-2 py-0.5 rounded-full">
                        ₹{parseFloat(product.price).toLocaleString("en-IN")}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!loading && results.length > 0 && (
            <Link
              href={`/products?q=${encodeURIComponent(query.trim())}`}
              onClick={() => setShowDrop(false)}
              className="flex items-center justify-between px-3 py-2.5 bg-[#F7FBF9] border-t border-gray-100 hover:bg-[#EBF5F1] transition-colors"
            >
              <span className="text-xs font-semibold text-[#006B4D]">
                See all results for &quot;{query}&quot;
              </span>
              <svg className="w-4 h-4 text-[#006B4D]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
  ) : null;

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {showDrop ? (
        isHeader ? (
          <div className="relative">
            <div className="rounded-lg border border-gray-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
              {searchBar}
            </div>
            <div className="absolute left-0 right-0 top-full z-[60] overflow-hidden border border-t-0 border-gray-200 rounded-b-lg bg-white shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
              {dropdownInner}
            </div>
          </div>
        ) : (
          <div className={openShellClass}>
            {searchBar}
            {dropdownInner}
          </div>
        )
      ) : (
        searchBar
      )}
    </div>
  );
}
