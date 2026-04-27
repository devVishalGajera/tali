"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

const SHIPPING = 596;
const TAX_RATE = 0;

const fmt = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CartModal = () => {
  const { isModalOpen, closeModal, lastAdded, items } = useCart();

  if (!isModalOpen || !lastAdded) return null;

  const totalItems   = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal     = items.reduce((s, i) => s + i.priceValue * i.quantity, 0);
  const totalExclTax = subtotal + SHIPPING;
  const taxes        = totalExclTax * TAX_RATE;
  const totalInclTax = totalExclTax + taxes;

  const qty = items.find((i) => i.id === lastAdded.id)?.quantity ?? 1;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={closeModal}
    >
      {/* Modal panel */}
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Success banner ─────────────────────────────────── */}
        <div className="flex items-center justify-between bg-[#F0FFF4] px-5 py-3 border-b border-[#D1FAE5]">
          <p className="text-sm font-medium text-[#00845F]">
            Product Successfully added to your shopping cart
          </p>
          <button
            onClick={closeModal}
            className="text-[#00845F] hover:text-[#006e4f] transition-colors text-lg font-bold leading-none"
          >
            ✕
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="flex gap-6 p-6">

          {/* Left — product info */}
          <div className="flex gap-4 flex-1">
            <div className="w-[110px] h-[130px] shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={lastAdded.image}
                alt={lastAdded.name}
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <h3 className="text-base font-bold text-[#1D1D1D]">{lastAdded.name}</h3>
              <p className="text-lg font-bold text-[#1D1D1D]">{lastAdded.price}</p>
              {lastAdded.size && (
                <p className="text-sm text-[#1D1D1D80]">Size: {lastAdded.size}</p>
              )}
              <p className="text-sm text-[#1D1D1D80]">Quantity: {qty}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-[#F0F0F0] self-stretch" />

          {/* Right — order summary */}
          <div className="w-[240px] shrink-0 flex flex-col justify-between">
            <div>
              <p className="text-sm text-[#1D1D1D] mb-4">
                There are <span className="font-semibold">{totalItems}</span> items in your cart.
              </p>

              <div className="space-y-2">
                {[
                  { label: "Subtotal:",          value: fmt(subtotal),     bold: true },
                  { label: "Shipping:",           value: fmt(SHIPPING),     bold: false },
                  { label: "Total (tax excl.):",  value: fmt(totalExclTax), bold: false },
                  { label: "Total (tax incl.):",  value: fmt(totalInclTax), bold: true },
                  { label: "Taxes:",              value: fmt(taxes),        bold: false },
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
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer buttons ─────────────────────────────────── */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={closeModal}
            className="flex-1 py-3 bg-[#F0F0F0] hover:bg-[#E0E0E0] text-[#1D1D1D] text-sm font-semibold rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
          <Link
            href="/checkout"
            onClick={closeModal}
            className="flex-1 py-3 bg-[#00845F] hover:bg-[#006e4f] text-white text-sm font-semibold rounded-xl transition-colors text-center"
          >
            Proceed To Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
