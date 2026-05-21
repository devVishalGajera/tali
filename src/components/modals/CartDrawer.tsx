"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { fmtInr } from "@/lib/checkout/formatMoney";

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const CartDrawer = () => {
  const { isDrawerOpen, closeDrawer, items, summary, removeFromCart } = useCart();

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const grandTotal = summary.total;

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
          <h2 className="text-base font-bold text-[#00845F]">
            Shopping Cart({totalItems})
          </h2>
          <button
            onClick={closeDrawer}
            className="text-[#00845F] hover:text-[#006e4f] transition-colors text-lg font-bold leading-none"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* ── Items list ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-[#1D1D1D80] py-12">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-[#F0F0F0] last:border-0">
                {/* Image */}
                <div className="w-[90px] h-[110px] shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain p-2"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-[#1D1D1D] leading-snug line-clamp-2">
                        {item.name || "Product"}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="shrink-0 text-[#1D1D1D80] hover:text-[#F02A0B] transition-colors mt-0.5"
                        aria-label="Remove item"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    <p className="text-base font-bold text-[#1D1D1D] mt-1">{item.price}</p>
                  </div>
                  <div className="space-y-0.5">
                    {item.size && (
                      <p className="text-xs text-[#1D1D1D80]">Size: {item.size}</p>
                    )}
                    <p className="text-xs text-[#1D1D1D80]">Quantity: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Order summary ──────────────────────────────────── */}
        {items.length > 0 && (
          <div className="border-t border-[#F0F0F0] px-5 py-4 space-y-2">
            {[
              { label: `${totalItems} Items`, value: fmtInr(summary.orderTotal), bold: false },
              { label: "Shipping (per order)", value: fmtInr(summary.shippingCharge), bold: false },
              { label: "Total", value: fmtInr(grandTotal), bold: true },
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

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="mt-4 block w-full py-3.5 bg-[#00845F] hover:bg-[#006e4f] text-white text-sm font-semibold rounded-xl transition-colors text-center"
            >
              Proceed To Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
