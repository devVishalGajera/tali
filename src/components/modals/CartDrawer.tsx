"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { fmtInr } from "@/lib/checkout/formatMoney";
import { MIN_CHECKOUT_ORDER } from "@/lib/api/cart";
import MinCheckoutProgressBar from "@/components/checkout/MinCheckoutProgressBar";

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

const LocationPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#F02A0B]" stroke="currentColor" strokeWidth="2">
    <path d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="11" r="2.5" />
  </svg>
);

const CartDrawer = () => {
  const { isDrawerOpen, closeDrawer, items, summary, removeFromCart, updateQuantity } = useCart();

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const grandTotal = summary.total;
  const orderSubtotal = summary.orderTotal;
  const meetsMinimum = orderSubtotal >= MIN_CHECKOUT_ORDER;

  const changeQty = (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = item.quantity + delta;
    if (next < 1) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, next);
  };

  return (
    <>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={closeDrawer}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
          <h2 className="text-base font-bold text-[#00845F]">
            Shopping Cart ({totalItems})
          </h2>
          <button
            onClick={closeDrawer}
            className="text-[#00845F] hover:text-[#006e4f] transition-colors text-lg font-bold leading-none"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pt-3 pb-2">
          <div className="flex items-start gap-2 rounded-lg bg-[#FFF8F0] border border-[#F5E6D3] px-3 py-2.5">
            <LocationPinIcon />
            <p className="text-xs text-[#1D1D1D] leading-snug">
              Delivery address will be selected during checkout
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-[#1D1D1D80] py-12">Your cart is empty.</p>
          ) : (
            items.map((item) => {
              const lineTotal = item.priceValue * item.quantity;
              return (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-[#F0F0F0] last:border-0">
                  <Link
                    href={`/products/${item.id}`}
                    onClick={closeDrawer}
                    className="w-[90px] h-[110px] shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-2"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.id}`}
                          onClick={closeDrawer}
                          className="text-sm font-bold text-[#1D1D1D] leading-snug line-clamp-2 hover:text-[#006B4D] transition-colors"
                        >
                          {item.name || "Product"}
                        </Link>
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
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                      {item.size && (
                        <p className="text-xs text-[#1D1D1D80]">Size: {item.size}</p>
                      )}
                      <div className="flex items-center gap-3 ml-auto">
                        <div className="flex items-center border border-[#E8E8E8] rounded-lg overflow-hidden shrink-0">
                          <span className="px-3 py-1.5 text-sm font-medium text-[#1D1D1D] min-w-[36px] text-center">
                            {item.quantity}
                          </span>
                          <div className="flex flex-col border-l border-[#E8E8E8]">
                            <button
                              type="button"
                              onClick={() => changeQty(item.id, 1)}
                              className="px-2 py-0.5 hover:bg-[#F5F5F5] transition-colors border-b border-[#E8E8E8]"
                              aria-label="Increase quantity"
                            >
                              <ChevronUp />
                            </button>
                            <button
                              type="button"
                              onClick={() => changeQty(item.id, -1)}
                              className="px-2 py-0.5 hover:bg-[#F5F5F5] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <ChevronDown />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-[#1D1D1D] shrink-0">
                          {fmtInr(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#F0F0F0] px-5 py-4 space-y-3">
            <MinCheckoutProgressBar orderSubtotal={orderSubtotal} />

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

            {meetsMinimum ? (
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="mt-1 block w-full py-3.5 bg-[#00845F] hover:bg-[#006e4f] text-white text-sm font-semibold rounded-xl transition-colors text-center"
              >
                Proceed To Checkout
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-1 block w-full py-3.5 bg-[#E8E8E8] text-[#1D1D1D80] text-sm font-semibold rounded-xl cursor-not-allowed text-center"
              >
                Proceed To Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
