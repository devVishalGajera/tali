"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/modals/CartProvider";

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
  const { items, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState<Record<number, number>>(
    Object.fromEntries(items.map((i) => [i.id, i.quantity]))
  );
  const [coupon, setCoupon] = useState("");

  const changeQty = (id: number, delta: number) => {
    setQuantities((prev) => {
      const next = (prev[id] ?? 1) + delta;
      if (next < 1) return prev;
      return { ...prev, [id]: next };
    });
  };

  const subtotal     = items.reduce((s, i) => s + i.priceValue * (quantities[i.id] ?? i.quantity), 0);
  const totalItems   = items.reduce((s, i) => s + (quantities[i.id] ?? i.quantity), 0);
  const totalExclTax = subtotal + SHIPPING;
  const taxes        = totalExclTax * TAX_RATE;
  const totalInclTax = totalExclTax + taxes;

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
                  const qty      = quantities[item.id] ?? item.quantity;
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

            <button className="mt-3 w-full py-3.5 bg-[#00845F] hover:bg-[#006e4f] text-white text-sm font-semibold rounded-xl transition-colors">
              Proceed To Checkout
            </button>
          </div>

        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
