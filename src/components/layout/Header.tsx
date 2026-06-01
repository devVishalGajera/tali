"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocation } from "../modals/LocationProvider";
import LocationCityLabel from "@/components/layout/LocationCityLabel";
import SearchWithDropdown from "@/components/shared/SearchWithDropdown";
import { useCart } from "../modals/CartProvider";
import { useWishlist } from "../modals/WishlistProvider";
import { useAuth } from "../auth/AuthProvider";
import { getDisplayName } from "@/lib/api/auth";
import { proxyImageUrl } from "@/lib/utils/image";
import type { NavCategory } from "@/lib/api/categories";

interface Props {
  navCategories: NavCategory[];
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

const LOGO_SIZE_DEFAULT = 60;
const LOGO_SIZE_SCROLLED = 40;

function profileImageSrc(path: string | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `/api/img?url=${encodeURIComponent(path)}`;
}

const Header = ({ navCategories }: Props) => {
  const { showModal, purchaseAllow } = useLocation();
  const { items, openDrawer } = useCart();
  const { count: wishlistCount, openDrawer: openWishlistDrawer } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const userAvatar = profileImageSrc(user?.profile_image_full_path);

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        lastScrollY.current = y;
        setScrolled((prev) => {
          if (!prev && y > 140) return true;
          if (prev && y < 60) return false;
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
      const target = event.target as Element | null;
      if (!target) return;
      if (!target.closest("[data-category-dropdown]")) {
        setOpenDropdown(null);
      }
      if (!target.closest("[data-user-menu]")) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const openCategory = navCategories.find((c) => c.id === openDropdown);

  const locationBtn = (
    <div
      onClick={showModal}
      className="flex items-center gap-1.5 cursor-pointer group flex-shrink-0 hover:opacity-80 transition-opacity"
    >
      <Image src="/assets/header/icons/locationIcon.svg" alt="Location" width={16} height={16} className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-[9px] text-[#1D1D1D80] leading-tight">Delivering to</span>
        <div className="flex items-center gap-0.5">
          <span className="text-xs font-semibold text-[#1D1D1D] leading-tight">
            <LocationCityLabel />
          </span>
          <Image src="/assets/header/icons/arrowDownIcon.svg" alt="" width={10} height={10} className="transition-transform duration-300 group-hover:rotate-180" />
        </div>
      </div>
    </div>
  );

  const iconBtnClass = scrolled
    ? "relative cursor-pointer hover:opacity-80 transition-opacity md:flex md:flex-col md:items-center md:gap-1"
    : "relative cursor-pointer hover:scale-110 active:scale-95 transition-transform";

  const iconBtnPlainClass = scrolled
    ? "relative cursor-pointer hover:opacity-80 transition-opacity"
    : iconBtnClass;

  const wishlistBtnClass = scrolled
    ? "flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity md:hidden"
    : iconBtnClass;

  const actionIcons = (
    <div className="flex items-center flex-shrink-0 gap-4">
      <div onClick={openWishlistDrawer} className={scrolled ? wishlistBtnClass : iconBtnClass}>
        <div className="relative">
          <Image src="/assets/header/icons/wishlistIcon.svg" alt="Wishlist" width={26} height={26} className="w-6 h-6 md:w-7 md:h-7" />
          <span className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {wishlistCount}
          </span>
        </div>
        {/* {scrolled && <span className="text-[11px] text-[#333] font-medium md:hidden">Wishlist</span>} */}
      </div>
      {scrolled && (
        <div onClick={openWishlistDrawer} className={`${iconBtnPlainClass} hidden md:block`}>
          <div className="relative">
            <Image src="/assets/header/icons/wishlistIcon.svg" alt="Wishlist" width={26} height={26} className="w-7 h-7" />
            <span className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {wishlistCount}
            </span>
          </div>
        </div>
      )}

      {isAuthenticated ? (
        <div className="relative" data-user-menu>
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            className={iconBtnClass}
          >
            {userAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userAvatar}
                alt={user ? getDisplayName(user) : "User"}
                className="w-7 h-7 rounded-full object-cover border border-[#006B4D]/20"
              />
            ) : (
              <span className="w-7 h-7 rounded-full bg-[#006B4D] text-white text-xs font-bold flex items-center justify-center hover:bg-[#005a3f] transition-colors">
                {user?.first_name?.charAt(0).toUpperCase() ?? "U"}
              </span>
            )}
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 top-full">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-[#1D1D1D] truncate">{user ? getDisplayName(user) : ""}</p>
                <p className="text-xs text-[#1D1D1D60] truncate">{user?.email}</p>
              </div>
              {[
                { label: "My Profile", href: "/profile" },
                { label: "My Orders", href: "/orders" },
                { label: "Track Order", href: "/track-order" },
                { label: "My Wishlist", href: "/wishlist" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-[#1D1D1D] hover:bg-gray-50 transition-colors">
                  {label}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button type="button" onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : scrolled ? (
        <Link href="/login" className={iconBtnClass}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#1D1D1D]">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          {/* <span className="hidden md:block text-[11px] text-[#333] font-medium">Account</span> */}
        </Link>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-1.5 bg-[#006B4D] hover:bg-[#005a3f] active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-full transition-all shadow-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span className="hidden sm:inline tracking-wide">Sign In</span>
        </Link>
      )}

      {purchaseAllow && (
        <div onClick={openDrawer} className={iconBtnClass}>
          <div className="relative">
            <Image src="/assets/header/icons/cartIcon.svg" alt="Cart" width={26} height={26} className="w-6 h-6 md:w-7 md:h-7" />
            <span className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {cartCount}
            </span>
          </div>
          {/* {scrolled && <span className="hidden md:block text-[11px] text-[#333] font-medium">Cart</span>} */}
        </div>
      )}
    </div>
  );

  const dropdownMenu = (
    <>
      {openDropdown !== null && openCategory && (
        <div data-category-dropdown className="absolute left-0 right-0 z-40 bg-white shadow-lg border-t border-gray-200 animate-fadeInDown" style={{ top: "100%" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="md:col-span-1">
                <div className="relative w-full h-[160px] md:h-[220px] rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={proxyImageUrl(openCategory.image_full_path)} alt={openCategory.name} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-[#1D1D1D]">{openCategory.name}</h3>
                  <button type="button" onClick={() => setOpenDropdown(null)} className="text-gray-400 hover:text-[#1D1D1D] transition-colors" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
                {openCategory.subcategory.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-1">
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 overflow-visible ${scrolled ? "shadow-md border-b border-gray-100" : "shadow-none"}`}
    >
      {/* Announcement banner — unchanged */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: showBanner ? "44px" : "0px", opacity: showBanner ? 1 : 0 }}
      >
        <div className="relative bg-[#1D1D1D] text-white h-[44px] flex items-center justify-center px-10 text-xs font-medium tracking-[2px]">
          <span>FREE SHIPPING ON ALL ORDERS FROM ₹500</span>
          <button
            type="button"
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

      {/* Top bar — desktop: single row; mobile: default centered logo / scrolled compact row + search */}
      <div
        className={`bg-white !pb-0 transition-[padding] duration-300 ease-out ${scrolled ? "px-3 py-2 md:px-8 md:py-3" : "px-4 py-3 md:px-8 md:py-4"
          }`}
      >
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center justify-start min-w-0 flex-1">
            {locationBtn}
          </div>
          <div
            className={`flex items-center justify-center flex-1 max-w-2xl mx-4 min-w-0 transition-[gap] duration-300 ease-out ${
              scrolled ? "gap-3" : "gap-0"
            }`}
          >
            <Link
              href="/"
              className="flex-shrink-0 transition-[width,height] duration-300 ease-out"
              style={{
                width: scrolled ? LOGO_SIZE_SCROLLED : LOGO_SIZE_DEFAULT,
                height: scrolled ? LOGO_SIZE_SCROLLED : LOGO_SIZE_DEFAULT,
              }}
            >
              <Image
                src="/assets/logo/talli-logo.jpeg"
                alt="Talli"
                width={60}
                height={60}
                className="rounded-full object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                priority
              />
            </Link>
            <div
              className={`overflow-hidden transition-all duration-300 ease-out min-w-0 ${
                scrolled ? "opacity-100 flex-1 max-w-xl ml-0" : "opacity-0 max-w-0 flex-[0]"
              }`}
              aria-hidden={!scrolled}
            >
              <SearchWithDropdown variant="header" />
            </div>
          </div>
          <div className="flex items-center justify-end min-w-0 flex-1">
            {actionIcons}
          </div>
        </div>

        {/* Mobile — not scrolled */}
        {!scrolled && (
          <div className="flex md:hidden items-center">
            <div className="flex items-center justify-start min-w-0 flex-1">
              {locationBtn}
            </div>
            <div className="flex items-center justify-center flex-1">
              <Link href="/" className="flex-shrink-0" style={{ width: 48, height: 48 }}>
                <Image
                  src="/assets/logo/talli-logo.jpeg"
                  alt="Talli"
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-full h-full"
                  priority
                />
              </Link>
            </div>
            <div className="flex items-center justify-end min-w-0 flex-1">
              {actionIcons}
            </div>
          </div>
        )}

        {/* Mobile — scrolled */}
        {scrolled && (
          <div className="flex md:hidden items-center justify-between animate-[fadeIn_0.25s_ease-out]">
            <div className="shrink-0">
              {locationBtn}
            </div>
            <Link href="/" className="shrink-0" style={{ width: 36, height: 36 }}>
              <Image
                src="/assets/logo/talli-logo.jpeg"
                alt="Talli"
                width={36}
                height={36}
                className="rounded-full object-cover w-full h-full"
              />
            </Link>
            <div className="flex items-center">
              {actionIcons}
            </div>
          </div>
        )}

        <div
          className={`md:hidden w-full min-w-0 overflow-hidden transition-all duration-300 ease-out ${
            scrolled ? "max-h-16 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
          }`}
          aria-hidden={!scrolled}
        >
          <SearchWithDropdown variant="header" />
        </div>
      </div>

      {/* Category bar — desktop always; mobile only when scrolled */}
      {navCategories.length > 0 && (
        <div
          className={`w-full max-w-7xl mx-auto bg-white border-b justify-center border-gray-100 flex items-center overflow-x-auto transition-[padding] duration-300 ease-out ${
            scrolled
              ? "flex gap-6 py-2.5 px-3 max-md:border-t max-md:border-gray-200 max-md:animate-[fadeIn_0.3s_ease-out] md:justify-center md:gap-14 md:py-3 md:px-8 md:mt-[5px] md:!pb-0"
              : "hidden md:flex gap-10 md:gap-14 py-3 px-4 md:px-8 "
          }`}
        >
          {navCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category.id)}
              className={`flex-shrink-0 cursor-pointer group ${scrolled
                ? "flex flex-col items-center"
                : "flex flex-col items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform duration-200"
                }`}
            >
              {!scrolled && (
                <div className="hidden md:flex w-14 h-14 rounded-xl overflow-hidden items-center justify-center bg-gray-50 border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proxyImageUrl(category.image_full_path)}
                    alt={category.name}
                    className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
              )}

              <div className={`flex items-center gap-0.5 ${scrolled ? "" : ""}`}>
                <span
                  className={`whitespace-nowrap transition-colors duration-300 group-hover:text-[#006B4D] ${scrolled
                    ? `text-sm font-medium text-[#333] ${openDropdown === category.id ? "text-[#006B4D]" : ""}`
                    : `text-sm font-medium text-[#444] ${openDropdown === category.id ? "text-[#006B4D]" : ""}`
                    }`}
                >
                  {category.name}
                </span>
                {!scrolled && (
                  <Image
                    src="/assets/header/icons/arrowDownIcon.svg"
                    alt=""
                    width={10}
                    height={10}
                    className={`hidden md:block transition-transform duration-300 ${openDropdown === category.id ? "rotate-180" : "group-hover:rotate-180"}`}
                  />
                )}
              </div>

              {scrolled && (
                <div
                  className="hidden md:block h-[2px] bg-[#006B4D] rounded-full transition-[width] duration-300 mt-1"
                  style={{ width: openDropdown === category.id ? "100%" : "0%" }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {dropdownMenu}
    </header>
  );
};

export default Header;
