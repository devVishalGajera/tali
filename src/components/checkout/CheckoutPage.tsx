"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/modals/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocation } from "@/components/modals/LocationProvider";
import { saveUserAddressApi, extractAddressId } from "@/lib/api/address";
import { createOrderApi, extractOrderId } from "@/lib/api/order";
import { getDisplayName } from "@/lib/api/auth";

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

const inputClass =
  "w-full border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-sm text-[#1D1D1D] placeholder-[#1D1D1D40] outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 transition-colors";

const checkoutCard =
  "bg-white border-b border-[#E8E8E8] px-4 py-5 sm:border sm:border-[#E8E8E8] sm:rounded-2xl sm:px-6 sm:py-6";

const checkoutMain =
  "min-h-screen bg-[#FAFAFA] py-0 sm:py-10 px-0 sm:px-6 md:px-10";

const CheckoutPage = () => {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated, token, user } = useAuth();
  const { purchaseAllow, city, lat, long } = useLocation();

  const [coupon, setCoupon] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [permitNumber, setPermitNumber] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");

  useEffect(() => {
    if (!user) return;
    setFullName(getDisplayName(user));
    setPhone(user.mobile_number ?? "");
    if (user.user_address?.address) setAddressLine(user.user_address.address);
    if (user.user_address?.city) setAddressCity(user.user_address.city);
    else if (city) setAddressCity(city);
  }, [user, city]);

  const changeQty = (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = item.quantity + delta;
    if (next < 1) return;
    updateQuantity(id, next);
  };

  const subtotal = items.reduce((s, i) => s + i.priceValue * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalExclTax = subtotal + SHIPPING;
  const taxes = totalExclTax * TAX_RATE;
  const totalInclTax = totalExclTax + taxes;

  const resolveAddressId = async (): Promise<number> => {
    if (!token) throw new Error("Please log in to place an order.");

    const existingId = user?.user_address?.id ?? null;

    const saved = await saveUserAddressApi({
      token,
      address: addressLine.trim(),
      city: addressCity.trim(),
      existingId: existingId ?? undefined,
      house_no: houseNo.trim(),
      landmark: landmark.trim(),
      latitude: lat != null ? String(lat) : "",
      longitude: long != null ? String(long) : "",
      save_as: "Home",
    });

    if (saved.code !== 1) throw new Error(saved.message || "Could not save delivery address.");

    const newId = extractAddressId(saved.data);
    if (newId) return newId;
    if (existingId) return existingId;

    throw new Error("Address saved but no address id returned. Please try again.");
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
    if (!fullName.trim()) {
      setOrderError("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      setOrderError("Please enter your phone number.");
      return;
    }
    if (!addressLine.trim()) {
      setOrderError("Please enter your delivery address.");
      return;
    }
    if (!addressCity.trim()) {
      setOrderError("Please enter your city.");
      return;
    }

    setPlacing(true);
    try {
      const addressId = await resolveAddressId();

      const res = await createOrderApi({
        token,
        address_id: addressId,
        special_instruction: deliveryNote.trim(),
        permit_number: permitNumber.trim(),
      });

      if (res.code !== 1) {
        throw new Error(res.message || "Order could not be placed.");
      }

      clearCart();
      const orderId = extractOrderId(res.data as { id?: number; order_id?: number });
      if (orderId) {
        router.push(`/orders/${orderId}`);
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

  return (
    <main className={checkoutMain}>
      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-0 lg:gap-6 items-stretch lg:items-start">

        <div className="flex-1 min-w-0 flex flex-col gap-0 sm:gap-4">
          <div className={checkoutCard}>
            <h1 className="text-2xl font-bold text-[#1D1D1D] mb-6">Shopping Cart</h1>

            {items.length === 0 ? (
              <p className="text-sm text-[#1D1D1D80] py-10 text-center">Your cart is empty.</p>
            ) : (
              <div className="divide-y divide-[#F0F0F0]">
                {items.map((item) => {
                  const qty = item.quantity;
                  const lineTotal = item.priceValue * qty;

                  return (
                    <div key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 py-5">
                      <div className="flex gap-3 sm:contents">
                        <div className="w-[90px] h-[110px] shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1D1D1D] leading-snug">{item.name}</p>
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
                        {fmt(lineTotal)}
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

          {isAuthenticated && items.length > 0 && (
            <div className={checkoutCard}>
              <h2 className="text-lg font-bold text-[#1D1D1D] mb-4">Delivery details</h2>
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
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">House / flat no.</label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. C/9"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Street address</label>
                  <textarea
                    rows={2}
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Building, street, area"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">City</label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    className={inputClass}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className={inputClass}
                    placeholder="Optional"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Landmark</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className={inputClass}
                    placeholder="Optional — near…"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Permit number</label>
                  <input
                    type="text"
                    value={permitNumber}
                    onChange={(e) => setPermitNumber(e.target.value)}
                    className={inputClass}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
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

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[#1D1D1D80] hover:text-[#1D1D1D] transition-colors px-4 py-3 sm:px-0 sm:py-0"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-0 sm:gap-4">
          <div className={checkoutCard}>
            <p className="text-sm font-semibold text-[#1D1D1D] mb-3">Enter Coupon Code</p>
            <div className="flex w-full min-w-0 gap-2">
              <input
                type="text"
                placeholder="Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="min-w-0 flex-1 border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1D1D1D]"
              />
              <button type="button" className="shrink-0 bg-[#1D1D1D] hover:bg-[#333] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
                Submit
              </button>
            </div>
          </div>

          <div className={`${checkoutCard} space-y-3 max-lg:border-b-0`}>
            <div className="pb-3 border-b border-[#F0F0F0]">
              <p className="text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-2">Payment</p>
              <div className="flex items-center gap-2 rounded-xl border-2 border-[#006B4D] bg-[#006B4D0D] px-3 py-2.5">
                <span className="w-4 h-4 rounded-full border-[5px] border-[#006B4D] bg-white shrink-0" />
                <span className="text-sm font-semibold text-[#1D1D1D]">Cash on delivery</span>
              </div>
            </div>

            {[
              { label: `${totalItems} Items`, value: fmt(subtotal), bold: false },
              { label: "Shipping", value: fmt(SHIPPING), bold: false },
              { label: "Total (tax excl.)", value: fmt(totalExclTax), bold: false },
              { label: "Total (tax incl.)", value: fmt(totalInclTax), bold: true },
              { label: "Taxes:", value: fmt(taxes), bold: false },
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

            {orderError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {orderError}
              </p>
            )}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placing || items.length === 0}
                className="mt-3 w-full py-3.5 bg-[#00845F] hover:bg-[#006e4f] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {placing ? "Placing order…" : "Place order (Cash)"}
              </button>
            ) : (
              <div className="mt-3 rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] px-4 py-4 text-center">
                <p className="text-sm font-semibold text-[#1D1D1D] mb-1">Login required to checkout</p>
                <p className="text-xs text-[#1D1D1D80] mb-3">Sign in to add your delivery address and place an order.</p>
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
      </div>
    </main>
  );
};

export default CheckoutPage;
