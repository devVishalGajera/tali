"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { proxyImageUrl } from "@/lib/utils/image";
import { API_BASE_URL } from "@/lib/api/base-url";

interface SearchProduct {
  id: number;
  name: string;
  image_full_path: string;
  price: string;
  volume: string;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

async function fetchSearchResults(term: string): Promise<SearchProduct[]> {
  const form = new FormData();
  form.append("page_no", "1");
  form.append("term", term);

  const storeId = getCookie("talli_store_id");
  const city    = getCookie("talli_city");
  if (storeId) form.append("store_id", storeId);
  if (city)    form.append("city", city);

  const res = await fetch(`${API_BASE_URL}/product/viewAllNew`, {
    method: "POST",
    body: form,
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  if (json.code !== 1) return [];
  return (json.data ?? []).slice(0, 8);
}

const HeroSection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const [results, setResults]   = useState<SearchProduct[]>([]);
  const [loading, setLoading]   = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    const calculateHeaderHeight = () => {
      const header = document.getElementById("main-header");
      if (header) setHeaderHeight(header.offsetHeight);
    };
    const handleResize = () => { checkDesktop(); calculateHeaderHeight(); };

    checkDesktop();
    calculateHeaderHeight();

    const header = document.getElementById("main-header");
    let resizeObserver: ResizeObserver | null = null;
    if (header) {
      resizeObserver = new ResizeObserver(calculateHeaderHeight);
      resizeObserver.observe(header);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDrop(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  /* Debounced search */
  const runSearch = useCallback((term: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!term.trim()) { setResults([]); setShowDrop(false); setLoading(false); return; }
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
    setSearchQuery(val);
    runSearch(val);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setShowDrop(false);
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  const goToProduct = (id: number) => {
    setShowDrop(false);
    router.push(`/products/${id}`);
  };

  // Dynamic height calculation
  const heroHeight = isDesktop && headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : "75vh";

  return (
    <section
      className="relative w-full bg-[#FAF4F2] flex flex-col justify-center min-h-0"
      style={{ height: heroHeight }}
    >
      {/* Clipped background layer — overflow-hidden lives here only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Bottles Background */}
      <div className="absolute inset-0 w-full h-full animate-continuousFloat -top-[10px]">
        <Image
          src="/assets/header/icons/bottles.svg"
          alt="Bottles"
          fill
          className="object-contain object-bottom md:object-cover md:object-center"
          priority
        />
      </div>
      <div
        className="w-full absolute bottom-0 left-0 right-0 animate-fadeIn pointer-events-none -mt-[30px] sm:-mt-[40px] md:-mt-[50px] lg:-mt-[60px] xl:-mt-[70px]"
        style={{
          animationDelay: "0.4s",
          animationFillMode: "both",
        }}
      >
        <div
          className="w-full relative overflow-hidden"
          style={{ height: "clamp(50px, 8vw, 120px)" }}
        >
          <div className="absolute bottom-0 left-0 right-0 w-full">
            <Image
              src="/assets/images/WAVE.png"
              alt="Wave"
              width={1570}
              height={339}
              className="w-full h-auto"
              priority
              unoptimized
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                maxHeight: "clamp(50px, 8vw, 120px)",
              }}
            />
          </div>
        </div>
      </div>
      </div>{/* end clipped background layer */}
      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col justify-center flex-1">
        {/* Heading and Subheading */}
        <div className="text-center mb-6 md:mb-8 lg:mb-12 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D1D1D] mb-4">
            Find the best price for wines, beers and spirits.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#1D1D1D]">
            Search thousands of online stores
          </p>
        </div>

        {/* Search Bar */}
        <div
          ref={wrapperRef}
          className="w-full max-w-[680px] mx-auto animate-fadeIn relative"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <form onSubmit={handleSearch}>
            <div
              className={`relative flex items-center shadow-[0px_0px_32px_0px_#00000029] bg-white transition-all duration-300 ${
                showDrop ? "rounded-t-2xl" : "rounded-full"
              } ${isFocused ? "shadow-lg" : ""}`}
            >
              {/* Search Icon */}
              <div className="pl-4 md:pl-6 flex-shrink-0">
                <Image
                  src="/assets/header/icons/searchIcon.svg"
                  alt="Search"
                  width={20}
                  height={20}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </div>

              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={handleChange}
                onFocus={() => {
                  setIsFocused(true);
                  if (results.length > 0) setShowDrop(true);
                }}
                onBlur={() => setIsFocused(false)}
                placeholder="Shop And Product name"
                className="flex-1 px-3 md:px-4 py-4 text-sm md:text-base text-[#1D1D1D] placeholder:text-[#A1A1A1] focus:outline-none bg-transparent"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setResults([]); setShowDrop(false); }}
                  className="text-gray-400 hover:text-gray-600 px-2 flex-shrink-0"
                  aria-label="Clear search"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Search Button */}
              <div className="pr-2 md:pr-3 flex-shrink-0">
                <button
                  type="submit"
                  className="bg-[#006B4D] text-white font-semibold px-4 md:px-8 lg:px-5 py-2 text-sm md:text-base rounded-full hover:bg-[#005a40] transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95 transform"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Dropdown results */}
          {showDrop && (
            <div className="absolute left-0 right-0 top-full z-[9999] bg-white rounded-b-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.18)] border border-t-0 border-gray-100">
              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center gap-2 py-8">
                  <svg className="animate-spin w-4 h-4 text-[#006B4D]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="text-sm text-gray-400">Searching…</span>
                </div>
              )}

              {/* No results */}
              {!loading && results.length === 0 && searchQuery.trim() && (
                <div className="flex flex-col items-center gap-1 py-8 px-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <p className="text-sm text-gray-400 mt-1">No results for <span className="font-medium text-gray-600">&quot;{searchQuery}&quot;</span></p>
                </div>
              )}

              {/* Results list */}
              {!loading && results.length > 0 && (
                <ul className="max-h-[340px] overflow-y-auto divide-y divide-gray-50">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.id}`}
                        onClick={() => setShowDrop(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7FBF9] transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={proxyImageUrl(product.image_full_path)}
                            alt={product.name}
                            className="w-full h-full object-contain p-0.5"
                          />
                        </div>

                        {/* Name + volume */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1D1D1D] truncate group-hover:text-[#006B4D] transition-colors">
                            {product.name}
                          </p>
                          {product.volume && (
                            <p className="text-xs text-gray-400 mt-0.5">{product.volume}</p>
                          )}
                        </div>

                        {/* Price */}
                        {product.price && (
                          <span className="text-sm font-bold text-[#006B4D] flex-shrink-0 bg-[#EBF5F1] px-2 py-0.5 rounded-full">
                            ₹{parseFloat(product.price).toLocaleString("en-IN")}
                          </span>
                        )}

                        {/* Arrow */}
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-[#006B4D] transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* See all footer */}
              {!loading && results.length > 0 && (
                <Link
                  href={`/products?q=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={() => setShowDrop(false)}
                  className="flex items-center justify-between px-4 py-3 bg-[#F7FBF9] border-t border-gray-100 hover:bg-[#EBF5F1] transition-colors group"
                >
                  <span className="text-sm font-semibold text-[#006B4D]">
                    See all results for <span className="italic">&quot;{searchQuery}&quot;</span>
                  </span>
                  <svg className="w-4 h-4 text-[#006B4D]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Wavy Shape at Bottom */}
      {/* <div
        className="absolute bottom-0 left-0 right-0 w-full animate-fadeIn pointer-events-none"
        style={{ animationDelay: "0.4s", animationFillMode: "both" }}
      >
        <Image
          src="/assets/header/icons/wave-shape.svg"
          alt="Wave"
          width={1920}
          height={200}
          className="w-full h-auto"
        />
      </div> */}
    </section>
  );
};

export default HeroSection;
