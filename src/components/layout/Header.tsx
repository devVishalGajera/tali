"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  const { city, showModal }               = useLocation();
  const { items, openDrawer }             = useCart();
  const { count: wishlistCount, openDrawer: openWishlistDrawer } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const cartCount                         = items.reduce((s, i) => s + i.quantity, 0);

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const handleCategoryClick = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const openCategory = navCategories.find((c) => c.id === openDropdown);

  return (
    <header id="main-header" className="sticky top-0 z-50 w-full bg-white">
      {/* Announcement Bar */}
      <div className="bg-[#1D1D1D] text-white py-2 text-xs font-medium h-[44px] flex items-center justify-center tracking-[2px] animate-fadeInDown">
        <span className="text-center px-4">FREE SHIPPING ON ALL ORDERS FROM $100</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="relative flex items-center justify-between px-3 sm:px-4 md:px-8 py-3 sm:py-4 bg-white overflow-hidden">
        {/* Left — Location */}
        <div
          onClick={showModal}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group flex-shrink-0 z-10 transition-all duration-300 hover:opacity-80"
        >
          <Image
            src="/assets/header/icons/locationIcon.svg"
            alt="Location"
            width={20}
            height={20}
            className="sm:w-[24px] sm:h-[24px] md:w-[30px] md:h-[30px] transition-transform duration-300 group-hover:scale-110"
          />
          <div className="flex items-center gap-1">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-[#1D1D1D80] leading-tight">Location</span>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="text-sm sm:text-base md:text-[20px] font-medium text-[#1D1D1D] leading-tight">
                  {city || "Select Location"}
                </span>
              </div>
            </div>
            <Image
              src="/assets/header/icons/arrowDownIcon.svg"
              alt="Arrow Down"
              width={12}
              height={12}
              className="sm:w-[16px] sm:h-[16px] md:w-[20px] md:h-[20px] transition-transform duration-300 group-hover:rotate-180"
            />
          </div>
        </div>

        {/* Center — Logo */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 z-0">
          <Image
            src="/assets/logo/logo-64x64.svg"
            alt="Talli Logo"
            width={64}
            height={64}
            className="md:w-20 md:h-20 transition-transform duration-300 hover:scale-110"
            priority
          />
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 z-10">
          {/* Wishlist */}
          <div
            onClick={openWishlistDrawer}
            className="relative cursor-pointer w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <Image
              src="/assets/header/icons/wishlistIcon.svg"
              alt="Wishlist"
              width={24}
              height={24}
              className="w-full h-full transition-opacity duration-300 hover:opacity-80"
            />
            <span className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-black text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center leading-none">
              {wishlistCount}
            </span>
          </div>

          {/* Account */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="w-8 h-8 rounded-full bg-[#006B4D] text-white text-xs font-bold flex items-center justify-center hover:bg-[#005a3f] transition-colors"
                aria-label="Account menu"
              >
                {user?.first_name?.charAt(0).toUpperCase() ?? "U"}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-[#1D1D1D] truncate">
                      {user ? getDisplayName(user) : ""}
                    </p>
                    <p className="text-xs text-[#1D1D1D60] truncate">{user?.email}</p>
                  </div>
                  {[
                    { label: "My Profile",  href: "/profile"  },
                    { label: "My Orders",   href: "/orders"   },
                    { label: "My Wishlist", href: "/wishlist" },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-[#1D1D1D] hover:bg-gray-50 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#006B4D] text-[#006B4D] text-xs font-semibold hover:bg-[#006B4D] hover:text-white transition-all"
            >
              <Image src="/assets/header/icons/userIcon.svg" alt="Account" width={16} height={16} className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Cart */}
          <div
            onClick={openDrawer}
            className="relative cursor-pointer w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <Image
              src="/assets/header/icons/cartIcon.svg"
              alt="Cart"
              width={24}
              height={24}
              className="w-full h-full transition-opacity duration-300 hover:opacity-80"
            />
            <span className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-black text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center leading-none">
              {cartCount}
            </span>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      {navCategories.length > 0 && (
        <div className="hidden md:flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide relative">
          {navCategories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex flex-col items-center gap-1 sm:gap-1.5 cursor-pointer group hover:text-gray-600 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[60px] sm:min-w-[70px] lg:min-w-[80px] hover:scale-110 active:scale-95"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proxyImageUrl(category.image_full_path)}
                  alt={category.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-[#666666] group-hover:text-gray-600 transition-colors duration-300">
                  {category.name}
                </span>
                <Image
                  src="/assets/header/icons/arrowDownIcon.svg"
                  alt=""
                  width={8}
                  height={8}
                  className={`sm:w-[10px] sm:h-[10px] transition-transform duration-300 ${
                    openDropdown === category.id ? "rotate-180" : "group-hover:rotate-180"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Menu */}
      {openDropdown !== null && openCategory && (
        <div
          ref={dropdownRef}
          className="hidden md:block absolute left-0 right-0 z-40 bg-white shadow-lg border-t border-gray-200 animate-fadeInDown"
          style={{ top: "100%" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
            <div className="grid grid-cols-3 gap-8">
              {/* Left — Category image */}
              <div className="col-span-1">
                <div className="relative w-full h-[220px] rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proxyImageUrl(openCategory.image_full_path)}
                    alt={openCategory.name}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* <span className="absolute bottom-4 left-4 text-white text-xl font-bold">
                    {openCategory.name}
                  </span> */}
                </div>
              </div>

              {/* Right — Subcategories */}
              <div className="col-span-2">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-[#1D1D1D]">{openCategory.name}</h3>
                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="text-gray-400 hover:text-[#1D1D1D] transition-colors"
                    aria-label="Close dropdown"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {openCategory.subcategory.length > 0 ? (
                  <div className="grid grid-cols-3 gap-x-8 gap-y-1">
                    {chunkArray(openCategory.subcategory, Math.ceil(openCategory.subcategory.length / 3)).map(
                      (col, colIdx) => (
                        <div key={colIdx} className="space-y-3">
                          {col.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/products?category_id=${openCategory.id}&sub_category_id=${sub.id}`}
                              className="block text-sm text-[#1D1D1D] hover:text-[#006B4D] transition-colors"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <Link
                    href={`/products?category_id=${openCategory.id}`}
                    className="inline-flex items-center gap-2 text-sm text-[#006B4D] font-medium hover:underline"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Browse all {openCategory.name}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                )}

                {/* "View all" link at the bottom */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={`/products?category_id=${openCategory.id}`}
                    className="text-xs text-[#006B4D] font-semibold hover:underline"
                    onClick={() => setOpenDropdown(null)}
                  >
                    View all {openCategory.name} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
