"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/modals/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocation } from "@/components/modals/LocationProvider";
import { createOrderApi, extractOrderId, parsePlacedOrder, type PlacedOrderInfo } from "@/lib/api/order";
import OrderConfirmedModal from "@/components/orders/OrderConfirmedModal";
import { getPermitFee, getGrandTotal, MIN_CHECKOUT_ORDER } from "@/lib/api/cart";
import { getDisplayName } from "@/lib/api/auth";
import { applyVoucherApi, getVouchersApi, type VoucherItem } from "@/lib/api/vouchers";
import CheckoutDeliveryAddress from "@/components/checkout/CheckoutDeliveryAddress";
import MinCheckoutProgressBar from "@/components/checkout/MinCheckoutProgressBar";
import { fmtInr } from "@/lib/checkout/formatMoney";

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

const inputClass =
  "w-full border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-sm text-[#1D1D1D] placeholder-[#1D1D1D40] outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 transition-colors";

const checkoutCard =
  "bg-white border-b border-[#E8E8E8] px-4 py-5 sm:border sm:border-[#E8E8E8] sm:rounded-2xl sm:px-6 sm:py-6";

const checkoutMain =
  "min-h-screen bg-[#FAFAFA] py-0 sm:py-10 px-0 sm:px-6 md:px-10";

const PAYMENT_OPTIONS = [
  "Google Pay",
  "Paytm",
  "Credit/Debit Card",
  "Cash",
] as const;

type PaymentType = (typeof PAYMENT_OPTIONS)[number];

function paymentOptionLabel(option: PaymentType): string {
  return option === "Cash" ? "Cash on delivery" : option;
}

const PolicyIconWrap = ({ children }: { children: React.ReactNode }) => (
  <span className="w-9 h-9 shrink-0 rounded-full border border-[#C9A89E] flex items-center justify-center text-[#A67B6E]">
    {children}
  </span>
);

const CheckoutCancellationPolicy = () => (
  <div className={checkoutCard}>
    <h2 className="text-sm font-bold text-[#1D1D1D] tracking-wide uppercase mb-4">
      Cancellation Policy
    </h2>
    <ul className="space-y-4">
      <li className="flex items-center gap-3">
        <PolicyIconWrap>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PolicyIconWrap>
        <p className="text-sm text-[#1D1D1D80] leading-snug">
          Orders cannot be cancelled once out for delivery.
        </p>
      </li>
      <li className="flex items-center gap-3">
        <PolicyIconWrap>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1015.5-6.5M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PolicyIconWrap>
        <p className="text-sm text-[#1D1D1D80] leading-snug">
          In case of cancellation or modification, please contact support.
        </p>
      </li>
    </ul>
  </div>
);

const CheckoutPage = () => {
  const router = useRouter();
  const { items, summary, removeFromCart, updateQuantity, clearCart, refreshCart } = useCart();
  const { isAuthenticated, token, user } = useAuth();
  const { purchaseAllow, city, lat, long } = useLocation();

  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [applyingVoucherId, setApplyingVoucherId] = useState<number | null>(null);
  const [appliedVoucherId, setAppliedVoucherId] = useState<number | null>(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState<string | null>(null);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("Cash");
  const [permitNumber, setPermitNumber] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrderInfo | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const lastVoucherFetchKey = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFullName(getDisplayName(user));
    setPhone(user.mobile_number ?? "");
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && token) refreshCart();
  }, [isAuthenticated, token, refreshCart]);

  useEffect(() => {
    if (!isAuthenticated || !token || items.length === 0) {
      setVouchers([]);
      setAppliedVoucherId(null);
      setVoucherDiscount(0);
      setVoucherMessage(null);
      setVoucherError(null);
      lastVoucherFetchKey.current = null;
      return;
    }
    const fetchKey = `${token}:${items.length}`;
    if (lastVoucherFetchKey.current === fetchKey) return;
    lastVoucherFetchKey.current = fetchKey;
    setVoucherLoading(true);
    setVoucherError(null);
    getVouchersApi({ token })
      .then((res) => {
        if (res.code !== 1) {
          setVoucherError(null);
          setVouchers([]);
          return;
        }
        setVouchers(res.data);
      })
      .catch(() => {
        setVoucherError(null);
        setVouchers([]);
      })
      .finally(() => setVoucherLoading(false));
  }, [isAuthenticated, token, items.length]);

  const changeQty = (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = item.quantity + delta;
    if (next < 1) return;
    updateQuantity(id, next);
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const meetsMinimum = summary.orderTotal >= MIN_CHECKOUT_ORDER;
  const permitFee = getPermitFee(permitNumber);
  const grandTotalBeforeVoucher = getGrandTotal(summary, permitFee);
  const grandTotal = Math.max(0, grandTotalBeforeVoucher - voucherDiscount);

  const summaryRows = [
    { label: `${totalItems} Items`, value: fmtInr(summary.orderTotal), bold: false },
    { label: "Shipping (per order)", value: fmtInr(summary.shippingCharge), bold: false },
    ...(permitFee > 0
      ? [{ label: "Permit fee", value: fmtInr(permitFee), bold: false as const }]
      : []),
    ...(voucherDiscount > 0
      ? [{ label: "Voucher discount", value: `- ${fmtInr(voucherDiscount)}`, bold: false as const }]
      : []),
    { label: "Total", value: fmtInr(grandTotal), bold: true as const },
  ];

  const handleApplyVoucher = async (voucher: VoucherItem) => {
    if (!token) return;
    setApplyingVoucherId(voucher.id);
    setVoucherError(null);
    setVoucherMessage(null);
    try {
      const res = await applyVoucherApi({ token, id: voucher.id });
      if (res.code !== 1) {
        throw new Error(res.message || "Could not apply voucher.");
      }
      const fallbackAmount = voucher.amount > 0 ? voucher.amount : 0;
      setVoucherDiscount(res.data.amount > 0 ? res.data.amount : fallbackAmount);
      setAppliedVoucherId(voucher.id);
      setVoucherMessage(res.message || "Voucher applied successfully.");
    } catch (err) {
      setAppliedVoucherId(null);
      setVoucherDiscount(0);
      setVoucherError(err instanceof Error ? err.message : "Could not apply voucher.");
    } finally {
      setApplyingVoucherId(null);
    }
  };

  const handlePlaceOrder = async () => {
    setOrderError(null);

    if (!isAuthenticated || !token) {
      router.push("/login?redirect=/checkout");
      return;
    }
    if (items.length === 0) {
      setOrderError("Your cart is empty.");
      return;
    }
    if (summary.orderTotal < MIN_CHECKOUT_ORDER) {
      setOrderError(`Minimum order value is ${fmtInr(MIN_CHECKOUT_ORDER)}. Please add more items to your cart.`);
      return;
    }
    if (!fullName.trim()) {
      setOrderError("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      setOrderError("Please enter your phone number.");
      return;
    }
    if (!selectedAddressId) {
      setOrderError("Please add and select a delivery address.");
      return;
    }
    setPlacing(true);
    try {
      const res = await createOrderApi({
        token,
        address_id: selectedAddressId,
        payment_type: paymentType,
        special_instruction: deliveryNote.trim(),
        permit_number: permitNumber.trim(),
        placed_date: "",
        time: "",
        voucher_id: appliedVoucherId ? String(appliedVoucherId) : "",
        voucher_amount: voucherDiscount > 0 ? String(voucherDiscount) : "0.0",
      });

      if (res.code !== 1) {
        throw new Error(res.message || "Order could not be placed.");
      }

      clearCart();
      const placed =
        parsePlacedOrder(res.data, grandTotal) ??
        (() => {
          const orderId = extractOrderId(res.data);
          if (orderId == null) return null;
          return {
            id: orderId,
            orderNumber: `TL${orderId}`,
            total: grandTotal,
            placedAt: new Date().toISOString(),
          };
        })();
      if (placed) {
        setConfirmedOrder(placed);
      } else {
        router.push("/orders");
      }
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (!purchaseAllow) {
    return (
      <main className={`${checkoutMain} flex items-center justify-center px-4 py-20 sm:px-4`}>
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-[#1D1D1D] mb-3">Purchases Not Available</h2>
          <p className="text-sm text-[#1D1D1D80] leading-relaxed mb-8">
            Online purchases are currently not available in your area or selected location.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const orderSummaryBlock = (
    <div className={`${checkoutCard} flex flex-col lg:max-h-[calc(100vh-3rem)]`}>
      <h2 className="text-lg font-bold text-[#1D1D1D] mb-4">Order summary</h2>

      {items.length > 0 && (
        <MinCheckoutProgressBar
          orderSubtotal={summary.orderTotal}
          className="mb-4"
          reachedMessage="Minimum order value reached — you can place your order"
        />
      )}

      <div className="space-y-2 flex-1 min-h-0">
        {summaryRows.map(({ label, value, bold }) => (
          <div key={label} className="flex justify-between items-center gap-3">
            <span className={`text-sm ${bold ? "font-bold text-[#1D1D1D]" : "text-[#1D1D1D80]"}`}>
              {label}
            </span>
            <span className={`text-sm shrink-0 ${bold ? "font-bold text-[#1D1D1D]" : "text-[#1D1D1D]"}`}>
              {value}
            </span>
          </div>
        ))}
        <p className="text-[11px] text-[#1D1D1D50] pt-1">
          Shipping is charged once per order, not per item.
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-[#F0F0F0] space-y-3 shrink-0">
        <div>
          <p className="text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-2">Payment</p>
          <div className="space-y-2" role="radiogroup" aria-label="Payment method">
            {PAYMENT_OPTIONS.map((option) => {
              const selected = paymentType === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPaymentType(option)}
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "border-[#006B4D] bg-[#006B4D0D]"
                      : "border-[#E8E8E8] bg-white hover:border-[#CFEBDD]"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full shrink-0 border-2 flex items-center justify-center ${
                      selected ? "border-[#006B4D]" : "border-[#D0D0D0]"
                    }`}
                  >
                    {selected && <span className="w-2 h-2 rounded-full bg-[#006B4D]" />}
                  </span>
                  <span className="text-sm font-semibold text-[#1D1D1D]">
                    {paymentOptionLabel(option)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {orderError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {orderError}
          </p>
        )}

        {isAuthenticated ? (
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placing || items.length === 0 || !meetsMinimum}
            className="w-full py-3.5 bg-[#00845F] hover:bg-[#006e4f] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {placing ? "Placing order…" : "Place order"}
          </button>
        ) : (
          <div className="rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] px-4 py-4 text-center">
            <p className="text-sm font-semibold text-[#1D1D1D] mb-1">Login required</p>
            <p className="text-xs text-[#1D1D1D80] mb-3">Sign in to complete checkout.</p>
            <Link
              href="/login?redirect=/checkout"
              className="w-full py-3 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold rounded-xl flex items-center justify-center"
            >
              Login / Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <main className={checkoutMain}>
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-0 py-4 sm:py-0">
        <h1 className="text-2xl font-bold text-[#1D1D1D] mb-4 sm:mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">

        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className={checkoutCard}>
            <h2 className="text-lg font-bold text-[#1D1D1D] mb-4">Your items</h2>

            {items.length === 0 ? (
              <p className="text-sm text-[#1D1D1D80] py-10 text-center">Your cart is empty.</p>
            ) : (
              <div className="divide-y divide-[#F0F0F0] max-h-[min(420px,50vh)] overflow-y-auto">
                {items.map((item) => {
                  const qty = item.quantity;
                  const lineTotal = item.priceValue * qty;

                  return (
                    <div key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 py-5">
                      <div className="flex gap-3 sm:contents">
                        <Link
                          href={`/products/${item.id}`}
                          className="w-[90px] h-[110px] shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain p-2"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.id}`}
                            className="text-sm font-bold text-[#1D1D1D] leading-snug line-clamp-2 hover:text-[#006B4D] transition-colors"
                          >
                            {item.name || "Product"}
                          </Link>
                          <p className="text-base font-bold text-[#1D1D1D] mt-1">{item.price}</p>
                          {item.size && (
                            <p className="text-xs text-[#1D1D1D80] mt-1">Size: {item.size}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end sm:flex-nowrap sm:gap-4">
                      <div className="flex items-center border border-[#E8E8E8] rounded-lg overflow-hidden shrink-0">
                        <span className="px-4 py-2 text-sm font-medium text-[#1D1D1D] min-w-[40px] text-center">
                          {qty}
                        </span>
                        <div className="flex flex-col border-l border-[#E8E8E8]">
                          <button
                            type="button"
                            onClick={() => changeQty(item.id, 1)}
                            className="px-2 py-1 hover:bg-[#F5F5F5] transition-colors border-b border-[#E8E8E8]"
                            aria-label="Increase quantity"
                          >
                            <ChevronUp />
                          </button>
                          <button
                            type="button"
                            onClick={() => changeQty(item.id, -1)}
                            className="px-2 py-1 hover:bg-[#F5F5F5] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <ChevronDown />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-[#1D1D1D] min-w-[4.5rem] text-right shrink-0">
                        {fmtInr(lineTotal)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#1D1D1D80] hover:text-[#F02A0B] transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <TrashIcon />
                      </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {isAuthenticated && token && items.length > 0 && (
            <>
              <CheckoutDeliveryAddress
                token={token}
                defaultCity={city ?? ""}
                latitude={lat}
                longitude={long}
                selectedId={selectedAddressId}
                onSelectedIdChange={setSelectedAddressId}
              />
              {/* <div className={checkoutCard}>
                <h2 className="text-lg font-bold text-[#1D1D1D] mb-4">Contact details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                      placeholder="Mobile number"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Permit number</label>
                    <input
                      type="text"
                      value={permitNumber}
                      onChange={(e) => setPermitNumber(e.target.value)}
                      className={inputClass}
                      placeholder="Optional — leave empty adds ₹5 fee"
                    />
                    <p className="text-[11px] text-[#1D1D1D60] mt-1">
                      {permitNumber.trim()
                        ? "No permit fee when permit number is provided."
                        : "₹5 permit fee applies if permit number is not provided."}
                    </p>
                  </div>
                </div>
              </div> */}
            </>
          )}

          <div className={checkoutCard}>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-sm font-semibold text-[#1D1D1D]">Delivery instructions</p>
            </div>
            <textarea
              rows={3}
              placeholder="e.g. Leave at the door, call before delivery…"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              maxLength={300}
              className={`${inputClass} resize-none`}
            />
            <p className="text-right text-[11px] text-[#1D1D1D40] mt-1">{deliveryNote.length}/300</p>
          </div>

          <CheckoutCancellationPolicy />

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[#1D1D1D80] hover:text-[#1D1D1D] transition-colors"
          >
            ← Continue shopping
          </Link>
        </div>

        <aside className="w-full lg:w-[340px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-6">
          <div className={checkoutCard}>
            <p className="text-sm font-semibold text-[#1D1D1D] mb-3">Available vouchers</p>
            {voucherMessage && (
              <p className="text-xs text-[#006B4D] mt-2">{voucherMessage}</p>
            )}
            {voucherError && (
              <p className="text-xs text-red-600 mt-2">{voucherError}</p>
            )}
            {voucherLoading ? (
              <p className="text-xs text-[#1D1D1D60] mt-3">Loading vouchers…</p>
            ) : vouchers.length > 0 ? (
              <div className="mt-3 space-y-2">
                {vouchers.map((voucher) => (
                  <div key={voucher.id} className="border border-[#E8E8E8] rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1D1D1D] truncate">
                          {voucher.title}
                        </p>
                        <p className="text-xs text-[#1D1D1D80] mt-0.5">
                          Code: {voucher.code}
                          {voucher.amount > 0 ? ` • ${fmtInr(voucher.amount)} off` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyVoucher(voucher)}
                        disabled={applyingVoucherId === voucher.id || appliedVoucherId === voucher.id}
                        className="shrink-0 bg-[#006B4D] hover:bg-[#005a3f] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                      >
                        {appliedVoucherId === voucher.id
                          ? "Applied"
                          : applyingVoucherId === voucher.id
                            ? "Applying..."
                            : "Apply"}
                      </button>
                    </div>
                    {voucher.description && (
                      <p className="text-xs text-[#1D1D1D60] mt-1.5">{voucher.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#1D1D1D60] mt-3">No vouchers available right now.</p>
            )}
          </div>

          {items.length > 0 && (
            <div className={checkoutCard}>
              <p className="text-sm font-semibold text-[#1D1D1D] mb-3">Permit number</p>
              <input
                type="text"
                value={permitNumber}
                onChange={(e) => setPermitNumber(e.target.value)}
                className={inputClass}
                placeholder="Optional — leave empty adds ₹5 fee"
              />
              <p className="text-[11px] text-[#1D1D1D60] mt-1">
                {permitNumber.trim()
                  ? "No permit fee when permit number is provided."
                  : "₹5 permit fee applies if permit number is not provided."}
              </p>
            </div>
          )}

          {orderSummaryBlock}
        </aside>
        </div>
      </div>

      <OrderConfirmedModal
        open={confirmedOrder != null}
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />
    </main>
  );
};

export default CheckoutPage;
