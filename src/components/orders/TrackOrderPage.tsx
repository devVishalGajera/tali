"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { fmtInr } from "@/lib/checkout/formatMoney";
import {
  formatOrderDate,
  getOrderIdApi,
  getOrderDetailApi,
  getOrdersApi,
  getOrderStatusBadgeClass,
  giveOrderRatingApi,
  resolveOrderIdFromInput,
  trackOrderApi,
  type OrderDetail,
  type OrderTracking,
} from "@/lib/api/order";
import OrderTrackTimeline from "@/components/orders/OrderTrackTimeline";
import Image from "next/image";

type TrackMode = "orderId" | "mobile";

const PHONE_DISPLAY = "+91 7779027171";
const PHONE_HREF = "tel:+917779027171";
const WHATSAPP_HREF = "https://wa.me/917779027171";
const EMAIL_HREF = "mailto:support@tallidrinks.com";

export default function TrackOrderPage() {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuth();
  const [mode, setMode] = useState<TrackMode>("orderId");
  const [orderIdInput, setOrderIdInput] = useState("");
  const [mobileInput, setMobileInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratingMsg, setRatingMsg] = useState<string | null>(null);
  const [shopRating, setShopRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [shopReview, setShopReview] = useState("");
  const [deliveryReview, setDeliveryReview] = useState("");

  const summary = useMemo(() => {
    if (!detail) return null;
    const itemsTotal =
      detail.subtotal ??
      detail.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      itemsTotal,
      shipping: detail.shipping ?? 0,
      permitCharge: detail.permitCharge ?? 0,
      voucherAmount: detail.voucherAmount ?? 0,
    };
  }, [detail]);

  const resolveTrackOrderId = async (): Promise<string> => {
    if (mode === "orderId") {
      const raw = orderIdInput.trim();
      if (!raw) throw new Error("Please enter your order ID.");
      return resolveOrderIdFromInput(raw);
    }

    const entered = mobileInput.replace(/\s+/g, "");
    if (!entered) throw new Error("Please enter your mobile number.");
    const own = `${user?.country_code ?? ""}${user?.mobile_number ?? ""}`.replace(/\s+/g, "");
    if (own && entered !== own && entered !== (user?.mobile_number ?? "")) {
      throw new Error("Please enter your registered mobile number.");
    }

    const orderIdRes = await getOrderIdApi({
      token: token!,
      voucher_id: "",
      permit_number: "",
    });
    if (orderIdRes.code === 1 && orderIdRes.data?.id) {
      return String(orderIdRes.data.id);
    }

    const ordersRes = await getOrdersApi({ token: token!, page_no: 1 });
    const first = ordersRes.data?.[0];
    if (!first?.id) throw new Error("No orders found for this mobile number.");
    return String(first.id);
  };

  const handleTrack = async () => {
    setError(null);
    if (!isAuthenticated || !token) {
      router.push("/login?redirect=/track-order");
      return;
    }

    setLoading(true);
    try {
      const id = await resolveTrackOrderId();
      const trackRes = await trackOrderApi({ token, id });
      if (trackRes.code !== 1 || !trackRes.data) {
        throw new Error(trackRes.message || "Could not track this order.");
      }

      let orderDetail: OrderDetail | null = null;
      try {
        const detailRes = await getOrderDetailApi({ token, id });
        if (detailRes.code === 1 && detailRes.data) {
          orderDetail = detailRes.data;
        }
      } catch {
        orderDetail = null;
      }

      setTracking(trackRes.data);
      setDetail(orderDetail);
      setRatingError(null);
      setRatingMsg(null);
    } catch (err) {
      setDetail(null);
      setTracking(null);
      setError(err instanceof Error ? err.message : "Unable to track order right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!token || !detail || !tracking?.isDelivered) return;
    if (shopRating < 1 || shopRating > 5 || deliveryRating < 1 || deliveryRating > 5) {
      setRatingError("Ratings must be between 1 and 5.");
      return;
    }

    setRatingLoading(true);
    setRatingError(null);
    try {
      const res = await giveOrderRatingApi({
        token,
        id: tracking?.orderId ?? detail.id,
        shop_review: shopReview.trim() || "Good Service",
        shop_rating: shopRating,
        delivery_boy_review: deliveryReview.trim() || "Good Delivery",
        delivery_boy_rating: deliveryRating,
      });
      if (res.code !== 1) {
        throw new Error(res.message || "Could not submit rating.");
      }
      setRatingMsg(res.message || "Thanks for your feedback!");
    } catch (err) {
      setRatingError(err instanceof Error ? err.message : "Could not submit rating.");
      setRatingMsg(null);
    } finally {
      setRatingLoading(false);
    }
  };

  const hasResult = tracking != null;
  const displayOrderNumber =
    tracking?.orderNumber ?? detail?.orderNumber ?? (tracking?.orderId ? `TL${tracking.orderId}` : "");
  const displayPlacedAt = detail
    ? formatOrderDate(detail.placedAt)
    : tracking?.placedDate
      ? formatOrderDate(tracking.placedDate)
      : tracking?.scheduledAt ?? "";

  const deliveryWindow =
    tracking?.scheduledAt ||
    (tracking?.placedDate && tracking?.scheduledTime
      ? `${tracking.placedDate} ${tracking.scheduledTime}`
      : tracking?.deliveryTime ?? "");

  const deliveryPartner =
    detail?.storeName || tracking?.driverName || "Talli Express";

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
        <nav className="text-xs text-[#1D1D1D80] mb-4">
          <Link href="/" className="hover:text-[#006B4D]">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[#1D1D1D] font-semibold">Track Order</span>
        </nav>

        <section className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-6 md:p-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1D1D1D]">Track Your Order</h1>
            <p className="text-sm text-[#1D1D1D80] mt-2">
              Enter your order details to check real-time status
            </p>
          </div>

          <div className="mt-6 border-b border-[#EFEFEF]">
            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setMode("orderId")}
                className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
                  mode === "orderId"
                    ? "border-[#006B4D] text-[#006B4D]"
                    : "border-transparent text-[#1D1D1D80] hover:text-[#1D1D1D]"
                }`}
              >
                Track by Order ID
              </button>
              <button
                type="button"
                onClick={() => setMode("mobile")}
                className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
                  mode === "mobile"
                    ? "border-[#006B4D] text-[#006B4D]"
                    : "border-transparent text-[#1D1D1D80] hover:text-[#1D1D1D]"
                }`}
              >
                Track by Mobile Number
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={mode === "orderId" ? "Enter your Order ID" : "Enter your Mobile Number"}
              value={mode === "orderId" ? orderIdInput : mobileInput}
              onChange={(e) => {
                if (mode === "orderId") setOrderIdInput(e.target.value);
                else setMobileInput(e.target.value);
              }}
              className="flex-1 border border-[#E8E8E8] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10"
            />
            <button
              type="button"
              onClick={handleTrack}
              disabled={loading}
              className="bg-[#006B4D] hover:bg-[#005a3f] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </section>

        {!hasResult && !loading && (
          <section className="mt-8 text-center px-5 py-10 sm:py-14">
            <div className="relative w-56 h-44 sm:w-64 sm:h-48 mx-auto mb-6">
              <div className="absolute inset-x-6 bottom-0 h-24 rounded-2xl bg-[#FFE8E6]" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-28 h-20 rounded-lg bg-[#F5C4BE] border-2 border-[#E8A8A0] shadow-sm" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[88px] w-0 h-0 border-l-[14px] border-r-[14px] border-b-[18px] border-l-transparent border-r-transparent border-b-[#F5C4BE]" />
              <svg
                className="absolute right-10 top-2 text-[#006B4D]/70"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">No order to track yet!</h2>
            <p className="text-sm text-[#1D1D1D80] mt-2 max-w-lg mx-auto leading-relaxed">
              Looks like you haven&apos;t placed any orders with us. When you place an order,
              you&apos;ll be able to track it here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 justify-center mt-6 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" />
              </svg>
              Start Shopping
            </Link>
          </section>
        )}

        {hasResult && tracking && (
          <section className="mt-8 space-y-5">
            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1D1D1D]">
                    Order #{displayOrderNumber}
                  </h2>
                  {displayPlacedAt && (
                    <p className="text-xs text-[#1D1D1D80] mt-1">Placed on {displayPlacedAt}</p>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${getOrderStatusBadgeClass(tracking.orderStatus, tracking.statusCode)}`}
                >
                  {tracking.orderStatus}
                </span>
              </div>

              {(tracking.isRejected || tracking.isCancelled || detail?.isRejected || detail?.isCancelled) ? (
                <p className="text-sm text-[#1D1D1D80] bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl px-4 py-3">
                  This order is{" "}
                  {(tracking.isRejected || detail?.isRejected) ? "rejected" : "cancelled"}.
                  {detail?.rejectReason ? ` Reason: ${detail.rejectReason}.` : ""} Contact support if you need help.
                </p>
              ) : (
                <OrderTrackTimeline steps={tracking.steps} />
              )}
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-[#1D1D1D] mb-3">Delivery Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-[#1D1D1D80] text-xs mb-0.5">Delivery Partner</p>
                      <p className="font-semibold text-[#1D1D1D]">{deliveryPartner}</p>
                    </div>
                    {tracking.driverName && (
                      <div>
                        <p className="text-[#1D1D1D80] text-xs mb-0.5">Delivery Person</p>
                        <div className="flex items-center gap-3">
                          {tracking.driverImage ? (
                            <img
                              src={tracking.driverImage}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover border border-[#E8E8E8]"
                            />
                          ) : null}
                          <div>
                            <p className="font-semibold text-[#1D1D1D]">{tracking.driverName}</p>
                            {tracking.driverMobile && (
                              <a
                                href={`tel:${tracking.driverMobile.replace(/\s/g, "")}`}
                                className="text-xs text-[#006B4D] hover:underline"
                              >
                                {tracking.driverMobile}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-[#1D1D1D80] text-xs mb-0.5">Delivery Address</p>
                      <p className="text-[#1D1D1D] leading-relaxed">
                        {detail?.address || "Address unavailable."}
                      </p>
                    </div>
                    {deliveryWindow && (
                      <div>
                        <p className="text-[#1D1D1D80] text-xs mb-0.5">Delivery Time</p>
                        <p className="font-semibold text-[#1D1D1D]">{deliveryWindow}</p>
                      </div>
                    )}
                    {detail?.specialInstruction && (
                      <div>
                        <p className="text-[#1D1D1D80] text-xs mb-0.5">Instructions</p>
                        <p className="text-[#1D1D1D]">{detail.specialInstruction}</p>
                      </div>
                    )}
                  </div>
                </div>

                {detail ? (
                  <div>
                    <h3 className="text-sm font-bold text-[#1D1D1D] mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      {detail.items.map((item, idx) => (
                        <div key={`${item.name}-${idx}`} className="flex items-center gap-3 text-sm py-1">
                          <div className="w-12 h-12 rounded-lg border border-[#E8E8E8] bg-[#FAFAFA] overflow-hidden shrink-0 flex items-center justify-center">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-contain"
                                unoptimized
                              />
                            ) : (
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5C5C5" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#1D1D1D] font-medium truncate">{item.name}</p>
                            <p className="text-xs text-[#1D1D1D80]">
                              {item.volume ? `${item.volume} · ` : ""}Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-semibold text-[#1D1D1D] shrink-0">
                            {fmtInr(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-[#EFEFEF] space-y-1.5 text-sm">
                        <div className="flex justify-between text-[#1D1D1D80]">
                          <span>Subtotal</span>
                          <span>{fmtInr(summary?.itemsTotal ?? 0)}</span>
                        </div>
                        <div className="flex justify-between text-[#1D1D1D80]">
                          <span>Delivery Fee</span>
                          <span>
                            {(summary?.shipping ?? 0) <= 0 ? "FREE" : fmtInr(summary?.shipping ?? 0)}
                          </span>
                        </div>
                        {(summary?.permitCharge ?? 0) > 0 && (
                          <div className="flex justify-between text-[#1D1D1D80]">
                            <span>Permit fee</span>
                            <span>{fmtInr(summary?.permitCharge ?? 0)}</span>
                          </div>
                        )}
                        {(summary?.voucherAmount ?? 0) > 0 && (
                          <div className="flex justify-between text-[#1D1D1D80]">
                            <span>Voucher discount</span>
                            <span>- {fmtInr(summary?.voucherAmount ?? 0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[#1D1D1D] font-bold pt-1">
                          <span>Total Amount</span>
                          <span className="text-[#006B4D]">{fmtInr(detail.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-bold text-[#1D1D1D] mb-3">Order info</h3>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-[#1D1D1D80]">Order ID</dt>
                        <dd className="font-semibold text-[#1D1D1D]">{displayOrderNumber}</dd>
                      </div>
                      {tracking.deliveryTime && (
                        <div>
                          <dt className="text-[#1D1D1D80]">Estimated delivery</dt>
                          <dd className="font-semibold text-[#1D1D1D]">{tracking.deliveryTime}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>
            </div>

            {tracking.isDelivered && detail && (
              <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-6">
                <h3 className="text-base font-bold text-[#1D1D1D] mb-4">Rate Your Order</h3>
                {ratingError && (
                  <p className="mb-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {ratingError}
                  </p>
                )}
                {ratingMsg && (
                  <p className="mb-3 text-sm text-[#006B4D] bg-[#E8F5EF] border border-[#CFEBDD] rounded-lg px-3 py-2">
                    {ratingMsg}
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                      Shop Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={shopRating}
                      onChange={(e) => setShopRating(Number(e.target.value) || 1)}
                      className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                      Delivery Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={deliveryRating}
                      onChange={(e) => setDeliveryRating(Number(e.target.value) || 1)}
                      className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                      Shop Review
                    </label>
                    <textarea
                      rows={3}
                      value={shopReview}
                      onChange={(e) => setShopReview(e.target.value)}
                      className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                      Delivery Review
                    </label>
                    <textarea
                      rows={3}
                      value={deliveryReview}
                      onChange={(e) => setDeliveryReview(e.target.value)}
                      className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 resize-none"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmitRating}
                    disabled={ratingLoading}
                    className="bg-[#006B4D] hover:bg-[#005a3f] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    {ratingLoading ? "Submitting..." : "Submit Rating"}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="mt-8 bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-6">
          <h3 className="text-xl font-bold text-[#1D1D1D] text-center">Need Help?</h3>
          <p className="text-sm text-[#1D1D1D80] text-center mt-1">
            Our support team is here for you
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={PHONE_HREF}
              className="flex items-center justify-center gap-2 border border-[#E8E8E8] rounded-full px-4 py-3 text-sm font-semibold hover:bg-[#FAFAFA] transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-[#006B4D]/10 flex items-center justify-center text-[#006B4D]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                </svg>
              </span>
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#E8E8E8] rounded-full px-4 py-3 text-sm font-semibold hover:bg-[#FAFAFA] transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] font-bold text-xs">
                WA
              </span>
              WhatsApp Us
            </a>
            <a
              href={EMAIL_HREF}
              className="flex items-center justify-center gap-2 border border-[#E8E8E8] rounded-full px-4 py-3 text-sm font-semibold hover:bg-[#FAFAFA] transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-[#006B4D]/10 flex items-center justify-center text-[#006B4D]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v16H4z" strokeLinejoin="round" />
                  <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Email Us
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

