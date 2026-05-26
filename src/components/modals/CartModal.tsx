"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { fmtInr } from "@/lib/checkout/formatMoney";

const CartModal = () => {
  const { isModalOpen, closeModal, lastAdded, items, summary } = useCart();

  if (!isModalOpen || !lastAdded) return null;

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const grandTotal = summary.total;

  const qty = items.find((i) => i.id === lastAdded.id)?.quantity ?? 1;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 sm:px-4"
      onClick={closeModal}
    >
      {/* Modal panel */}
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Success banner ─────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 bg-[#F0FFF4] px-4 sm:px-5 py-2.5 sm:py-3 border-b border-[#D1FAE5] shrink-0">
          <p className="text-xs sm:text-sm font-medium text-[#00845F] leading-snug">
            Product Successfully added to your shopping cart
          </p>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="shrink-0 text-[#00845F] hover:text-[#006e4f] transition-colors text-lg font-bold leading-none w-7 h-7 flex items-center justify-center -mr-1"
          >
            ✕
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 sm:p-5 md:p-6 overflow-y-auto">

          {/* Left — product info */}
          <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-[88px] h-[104px] sm:w-[100px] sm:h-[118px] md:w-[110px] md:h-[130px] shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={lastAdded.image}
                alt={lastAdded.name}
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="flex flex-col justify-center gap-1.5 sm:gap-2 min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-[#1D1D1D] line-clamp-2">
                {lastAdded.name}
              </h3>
              <p className="text-base sm:text-lg font-bold text-[#1D1D1D]">{lastAdded.price}</p>
              {lastAdded.size && (
                <p className="text-xs sm:text-sm text-[#1D1D1D80]">Size: {lastAdded.size}</p>
              )}
              <p className="text-xs sm:text-sm text-[#1D1D1D80]">Quantity: {qty}</p>
            </div>
          </div>

          {/* Divider — horizontal on mobile, vertical on desktop */}
          <div className="h-px w-full md:w-px md:h-auto bg-[#F0F0F0] md:self-stretch" />

          {/* Right — order summary */}
          <div className="w-full md:w-[240px] shrink-0 flex flex-col justify-between">
            <div>
              <p className="text-xs sm:text-sm text-[#1D1D1D] mb-3 sm:mb-4">
                There are <span className="font-semibold">{totalItems}</span> items in your cart.
              </p>

              <div className="space-y-1.5 sm:space-y-2">
                {[
                  { label: "Subtotal:", value: fmtInr(summary.orderTotal), bold: true },
                  { label: "Shipping (per order):", value: fmtInr(summary.shippingCharge), bold: false },
                  { label: "Total:", value: fmtInr(grandTotal), bold: true },
                ].map(({ label, value, bold }) => (
                  <div key={label} className="flex justify-between items-center gap-3">
                    <span className={`text-xs sm:text-sm ${bold ? "font-bold text-[#1D1D1D]" : "text-[#1D1D1D80]"}`}>
                      {label}
                    </span>
                    <span className={`text-xs sm:text-sm whitespace-nowrap ${bold ? "font-bold text-[#1D1D1D]" : "text-[#1D1D1D]"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer buttons ─────────────────────────────────── */}
        <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 shrink-0">
          <button
            onClick={closeModal}
            className="flex-1 py-2.5 sm:py-3 bg-[#F0F0F0] hover:bg-[#E0E0E0] active:scale-[0.98] text-[#1D1D1D] text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
          <Link
            href="/checkout"
            onClick={closeModal}
            className="flex-1 py-2.5 sm:py-3 bg-[#00845F] hover:bg-[#006e4f] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors text-center"
          >
            Proceed To Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
