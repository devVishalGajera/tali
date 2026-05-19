"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/modals/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocation } from "@/components/modals/LocationProvider";

const SHIPPING = 596;
const TAX_RATE = 0;

const fmt = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const ChevronUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckoutPage = () => {
  const { items, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const { purchaseAllow } = useLocation();
  const [coupon, setCoupon] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");

  const changeQty = (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = item.quantity + delta;
    if (next < 1) return;
    updateQuantity(id, next);
  };

  const subtotal     = items.reduce((s, i) => s + i.priceValue * i.quantity, 0);
  const totalItems   = items.reduce((s, i) => s + i.quantity, 0);
  const totalExclTax = subtotal + SHIPPING;
  const taxes        = totalExclTax * TAX_RATE;
  const totalInclTax = totalExclTax + taxes;

  if (!purchaseAllow) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#FFF3ED] mx-auto mb-6">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF5C00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1D1D1D] mb-3">Purchases Not Available</h2>
          <p className="text-sm text-[#1D1D1D80] leading-relaxed mb-2">
            Online purchases are currently not available in your area or selected location.
          </p>
          <p className="text-sm text-[#1D1D1D80] leading-relaxed mb-8">
            Try changing your delivery location or check back later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 items-start">

        {/* ── Left — Cart items ──────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-[#E8E8E8] px-6 py-6">
            <h1 className="text-2xl font-bold text-[#1D1D1D] mb-6">Shopping Cart</h1>

            {items.length === 0 ? (
              <p className="text-sm text-[#1D1D1D80] py-10 text-center">Your cart is empty.</p>
            ) : (
              <div className="divide-y divide-[#F0F0F0]">
                {items.map((item) => {
                  const qty = item.quantity;
                  const lineTotal = item.priceValue * qty;

                  return (
                    <div key={item.id} className="flex items-center gap-4 py-5">
                      {/* Image */}
                      <div className="w-[90px] h-[110px] shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>

                      {/* Name + price */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1D1D1D] leading-snug">{item.name}</p>
                        <p className="text-base font-bold text-[#1D1D1D] mt-1">{item.price}</p>
                        {item.size && (
                          <p className="text-xs text-[#1D1D1D80] mt-1">Size: {item.size}</p>
                        )}
                      </div>

                      {/* Qty stepper */}
                      <div className="flex items-center border border-[#E8E8E8] rounded-lg overflow-hidden shrink-0">
                        <span className="px-4 py-2 text-sm font-medium text-[#1D1D1D] min-w-[40px] text-center">
                          {qty}
                        </span>
                        <div className="flex flex-col border-l border-[#E8E8E8]">
                          <button
                            onClick={() => changeQty(item.id, 1)}
                            className="px-2 py-1 hover:bg-[#F5F5F5] transition-colors border-b border-[#E8E8E8]"
                            aria-label="Increase quantity"
                          >
                            <ChevronUp />
                          </button>
                          <button
                            onClick={() => changeQty(item.id, -1)}
                            className="px-2 py-1 hover:bg-[#F5F5F5] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <ChevronDown />
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <p className="text-sm font-bold text-[#1D1D1D] w-[70px] text-right shrink-0">
                        {fmt(lineTotal)}
                      </p>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#1D1D1D80] hover:text-[#F02A0B] transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delivery instructions */}
          <div className="bg-white rounded-2xl border border-[#E8E8E8] px-6 py-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006B4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <p className="text-sm font-semibold text-[#1D1D1D]">Delivery Instructions</p>
            </div>
            <textarea
              rows={3}
              placeholder="e.g. Leave at the door, call before delivery, gate code #1234…"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              maxLength={300}
              className="w-full border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-sm text-[#1D1D1D] placeholder-[#1D1D1D40] outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 transition-colors resize-none"
            />
            <p className="text-right text-[11px] text-[#1D1D1D40] mt-1">{deliveryNote.length}/300</p>
          </div>

          {/* Continue shopping */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 mt-4 text-sm text-[#1D1D1D80] hover:text-[#1D1D1D] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* ── Right — Summary ────────────────────────────────── */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-4">

          {/* Coupon */}
          <div className="bg-white rounded-2xl border border-[#E8E8E8] px-5 py-5">
            <p className="text-sm font-semibold text-[#1D1D1D] mb-3">Enter Coupon Code</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-[#1D1D1D] placeholder-[#1D1D1D40] outline-none focus:border-[#1D1D1D] transition-colors"
              />
              <button className="bg-[#1D1D1D] hover:bg-[#333] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
                Submit
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-[#E8E8E8] px-5 py-5 space-y-3">
            {[
              { label: `${totalItems} Items`,     value: fmt(subtotal),     bold: false },
              { label: "Shipping",                value: fmt(SHIPPING),     bold: false },
              { label: "Total (tax excl.)",       value: fmt(totalExclTax), bold: false },
              { label: "Total (tax incl.)",       value: fmt(totalInclTax), bold: true  },
              { label: "Taxes:",                  value: fmt(taxes),        bold: false },
            ].map(({ label, value, bold }) => (
              <div key={label} className="flex justify-between items-center">
                <span className={`text-sm ${bold ? "font-bold text-[#1D1D1D]" : "text-[#1D1D1D80]"}`}>
                  {label}
                </span>
                <span className={`text-sm ${bold ? "font-bold text-[#1D1D1D]" : "text-[#1D1D1D]"}`}>
                  {value}
                </span>
              </div>
            ))}

            {isAuthenticated ? (
              <button className="mt-3 w-full py-3.5 bg-[#00845F] hover:bg-[#006e4f] text-white text-sm font-semibold rounded-xl transition-colors">
                Proceed To Checkout
              </button>
            ) : (
              <div className="mt-3 rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] px-4 py-4 text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#006B4D]/10 mx-auto mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006B4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#1D1D1D] mb-1">Login required to checkout</p>
                <p className="text-xs text-[#1D1D1D80] mb-3">Please sign in or create an account to place your order.</p>
                <Link
                  href="/login?redirect=/checkout"
                  className="w-full py-3 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                  </svg>
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
