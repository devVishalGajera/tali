"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocation } from "../modals/LocationProvider";
import { useCart } from "../modals/CartProvider";
import { useWishlist } from "../modals/WishlistProvider";
import { useAuth } from "../auth/AuthProvider";
import { getDisplayName } from "@/lib/api/auth";
import { proxyImageUrl } from "@/lib/utils/image";
import type { NavCategory } from "@/lib/api/categories";

interface Props {
  navCategories: NavCategory[];
}

/** Chunk a flat array into groups of `size` for column layout. */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

const Header = ({ navCategories }: Props) => {
  const router = useRouter();
  const { city, showModal, purchaseAllow } = useLocation();
  const { items, openDrawer }             = useCart();
  const { count: wishlistCount, openDrawer: openWishlistDrawer } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const cartCount                         = items.reduce((s, i) => s + i.quantity, 0);

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [showBanner, setShowBanner]     = useState(true);
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const userMenuRef  = useRef<HTMLDivElement>(null);
  const lastScrollY  = useRef(0);
  const ticking      = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y   = window.scrollY;
        const dir = y > lastScrollY.current ? "down" : "up";
        lastScrollY.current = y;
        // Enter compact mode only when scrolling DOWN past 100px
        // Exit compact mode only when scrolling UP below 40px
        // This prevents layout-shift feedback loops
        setScrolled((prev) => {
          if (!prev && dir === "down" && y > 100) return true;
          if (prev  && dir === "up"   && y < 40)  return false;
          return prev;
        });
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = headerSearch.trim();
    if (!trimmed) return;
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  const handleCategoryClick = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const openCategory = navCategories.find((c) => c.id === openDropdown);

  /* ── Shared sub-components ─────────────────────────────────── */

  const LocationBtn = () => (
    <div
      onClick={showModal}
      className="flex items-center gap-1.5 cursor-pointer group flex-shrink-0 z-10 transition-all duration-300 hover:opacity-80"
    >
      <Image src="/assets/header/icons/locationIcon.svg" alt="Location" width={16} height={16} className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-[9px] text-[#1D1D1D80] leading-tight">Delivering to</span>
        <div className="flex items-center gap-0.5">
          <span className="text-xs font-semibold text-[#1D1D1D] leading-tight">{city || "Select"}</span>
          <Image src="/assets/header/icons/arrowDownIcon.svg" alt="" width={10} height={10} className="transition-transform duration-300 group-hover:rotate-180" />
        </div>
      </div>
    </div>
  );

  const ActionIcons = () => (
    <div className="flex items-center gap-3 flex-shrink-0 z-10">
      {/* Wishlist */}
      <div onClick={openWishlistDrawer} className="relative cursor-pointer hover:scale-110 active:scale-95 transition-transform">
        <Image src="/assets/header/icons/wishlistIcon.svg" alt="Wishlist" width={26} height={26} className="w-6 h-6 md:w-7 md:h-7" />
        <span className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center leading-none">{wishlistCount}</span>
      </div>

      {/* Account */}
      {isAuthenticated ? (
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="w-7 h-7 rounded-full bg-[#006B4D] text-white text-xs font-bold flex items-center justify-center hover:bg-[#005a3f] transition-colors"
          >
            {user?.first_name?.charAt(0).toUpperCase() ?? "U"}
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-[#1D1D1D] truncate">{user ? getDisplayName(user) : ""}</p>
                <p className="text-xs text-[#1D1D1D60] truncate">{user?.email}</p>
              </div>
              {[
                { label: "My Profile",  href: "/profile"  },
                { label: "My Orders",   href: "/orders"   },
                { label: "My Wishlist", href: "/wishlist" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-[#1D1D1D] hover:bg-gray-50 transition-colors">
                  {label}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-1.5 bg-[#006B4D] hover:bg-[#005a3f] active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-full transition-all shadow-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          <span className="hidden sm:inline tracking-wide">Sign In</span>
        </Link>
      )}

      {/* Cart */}
      {purchaseAllow && (
        <div onClick={openDrawer} className="relative cursor-pointer hover:scale-110 active:scale-95 transition-transform">
          <Image src="/assets/header/icons/cartIcon.svg" alt="Cart" width={26} height={26} className="w-6 h-6 md:w-7 md:h-7" />
          <span className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center leading-none">{cartCount}</span>
        </div>
      )}
    </div>
  );

  const DropdownMenu = () => (
    <>
      {openDropdown !== null && openCategory && (
        <div ref={dropdownRef} className="absolute left-0 right-0 z-40 bg-white shadow-lg border-t border-gray-200 animate-fadeInDown" style={{ top: "100%" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-1">
                <div className="relative w-full h-[220px] rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={proxyImageUrl(openCategory.image_full_path)} alt={openCategory.name} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-[#1D1D1D]">{openCategory.name}</h3>
                  <button onClick={() => setOpenDropdown(null)} className="text-gray-400 hover:text-[#1D1D1D] transition-colors" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                {openCategory.subcategory.length > 0 ? (
                  <div className="grid grid-cols-3 gap-x-8 gap-y-1">
                    {chunkArray(openCategory.subcategory, Math.ceil(openCategory.subcategory.length / 3)).map((col, colIdx) => (
                      <div key={colIdx} className="space-y-3">
                        {col.map((sub) => (
                          <Link key={sub.id} href={`/products?categories=${openCategory.id}&subcats=${sub.id}`} className="block text-sm text-[#1D1D1D] hover:text-[#006B4D] transition-colors" onClick={() => setOpenDropdown(null)}>
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Link href={`/products?categories=${openCategory.id}`} className="inline-flex items-center gap-2 text-sm text-[#006B4D] font-medium hover:underline" onClick={() => setOpenDropdown(null)}>
                    Browse all {openCategory.name}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                )}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link href={`/products?categories=${openCategory.id}`} className="text-xs text-[#006B4D] font-semibold hover:underline" onClick={() => setOpenDropdown(null)}>
                    View all {openCategory.name} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-none"}`}
    >
      {/* ── Announcement banner ───────────────────────────────── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: showBanner ? "44px" : "0px", opacity: showBanner ? 1 : 0 }}
      >
        <div className="relative bg-[#1D1D1D] text-white h-[44px] flex items-center justify-center px-10 text-xs font-medium tracking-[2px]">
          <span>FREE SHIPPING ON ALL ORDERS FROM ₹500</span>
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Close announcement"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Single persistent top bar ─────────────────────────── */}
      <div className="relative flex items-center px-4 md:px-8 bg-white transition-all duration-300"
        style={{ paddingTop: scrolled ? "8px" : "10px", paddingBottom: scrolled ? "8px" : "10px" }}
      >
        {/* Left — location (always visible) */}
        <div className="flex-1 flex items-center justify-start min-w-0 z-10">
          <LocationBtn />
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 z-10 pointer-events-none max-w-[calc(100%-180px)] sm:max-w-[calc(100%-260px)]">
          {/* Logo — shrinks on scroll, always centered */}
          <Link
            href="/"
            className="flex-shrink-0 transition-all duration-300 pointer-events-auto"
            style={{ width: scrolled ? 36 : 48, height: scrolled ? 36 : 48 }}
          >
            <Image
              src="/assets/logo/talli-logo.jpeg"
              alt="Talli"
              width={52}
              height={52}
              className="rounded-full object-cover w-full h-full hover:scale-105 transition-transform duration-200"
              priority
            />
          </Link>

          {/* Search bar — slides in when scrolled */}
          <div
            className="overflow-hidden min-w-0 pointer-events-auto"
            style={{
              maxWidth: scrolled ? "min(480px, 50vw)" : "0px",
              opacity: scrolled ? 1 : 0,
              flex: scrolled ? "1" : "0 0 0px",
              transition: "max-width 350ms ease, opacity 300ms ease, flex 350ms ease",
            }}
          >
            <form onSubmit={handleHeaderSearch} className="w-full min-w-[180px]">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2 w-full">
                <Image src="/assets/header/icons/searchIcon.svg" alt="" width={15} height={15} className="opacity-40 flex-shrink-0" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Search for beer, wine, whiskey and more..."
                  className="flex-1 bg-transparent text-sm text-[#1D1D1D] placeholder:text-[#1D1D1D50] focus:outline-none min-w-0"
                />
                <button
                  type="submit"
                  className="bg-[#006B4D] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#005a3f] transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right — action icons */}
        <div className="flex-1 flex items-center justify-end min-w-0 z-10">
          <ActionIcons />
        </div>
      </div>

      {/* ── Category bar — morphs between icon+text and text-only ─ */}
      {navCategories.length > 0 && (
        <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 xl:gap-10 px-6 bg-white border-b border-gray-100 overflow-x-auto transition-all duration-300"
          style={{ paddingTop: scrolled ? "6px" : "10px", paddingBottom: scrolled ? "6px" : "10px" }}
        >
          {navCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0 transition-all duration-300
                hover:scale-105 active:scale-95
                ${openDropdown === category.id ? "opacity-100" : "opacity-90 hover:opacity-100"}
              `}
            >
              {/* Icon — collapses on scroll */}
              <div
                className="overflow-hidden rounded-full"
                style={{
                  maxHeight: scrolled ? "0px" : "52px",
                  opacity: scrolled ? 0 : 1,
                  width: scrolled ? 0 : 48,
                  marginBottom: scrolled ? 0 : 2,
                  transition: "max-height 350ms ease, opacity 300ms ease, width 350ms ease, margin 350ms ease",
                }}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proxyImageUrl(category.image_full_path)}
                    alt={category.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
              </div>

              {/* Label */}
              <div className="flex items-center gap-0.5">
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300 group-hover:text-[#006B4D]
                    ${scrolled ? "text-sm text-[#333]" : "text-sm text-[#444]"}
                    ${openDropdown === category.id ? "text-[#006B4D]" : ""}
                  `}
                >
                  {category.name}
                </span>
                <Image
                  src="/assets/header/icons/arrowDownIcon.svg"
                  alt=""
                  width={10}
                  height={10}
                  className={`transition-transform duration-300 ${openDropdown === category.id ? "rotate-180" : "group-hover:rotate-180"}`}
                />
              </div>

              {/* Active underline (scrolled state only) */}
              <div
                className="h-[2px] bg-[#006B4D] rounded-full transition-all duration-300"
                style={{ width: openDropdown === category.id && scrolled ? "100%" : "0%" }}
              />
            </button>
          ))}
        </div>
      )}

      <DropdownMenu />
    </header>
  );
};

export default Header;
