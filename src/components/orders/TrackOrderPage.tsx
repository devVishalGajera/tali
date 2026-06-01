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
import OrderTracker from "@/components/orders/OrderTracker";

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
  const displayPlacedAt =
    tracking?.scheduledAt ?? (detail ? formatOrderDate(detail.placedAt) : "");

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
          <section className="mt-8 text-center bg-white border border-[#E8E8E8] rounded-2xl px-5 py-10 sm:py-12">
            <div className="w-28 h-28 mx-auto rounded-full bg-[#006B4D]/5 flex items-center justify-center mb-5">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#006B4D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <path d="M7.5 4.21L12 6.81l4.5-2.6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1D1D1D]">No order to track yet!</h2>
            <p className="text-sm text-[#1D1D1D80] mt-2 max-w-md mx-auto">
              Looks like you haven&apos;t placed any orders with us. When you place an order,
              you&apos;ll be able to track it here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center mt-5 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
            >
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
                    <p className="text-xs text-[#1D1D1D80] mt-1">Scheduled: {displayPlacedAt}</p>
                  )}
                  {tracking.deliveryTime && (
                    <p className="text-xs text-[#006B4D] mt-1 font-medium">
                      Estimated delivery: {tracking.deliveryTime}
                    </p>
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
                <OrderTracker steps={tracking.steps} compact />
              )}
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-[#1D1D1D] mb-3">Delivery Details</h3>
                  <div className="space-y-2 text-sm">
                    {tracking.driverName ? (
                      <>
                        <p className="text-[#1D1D1D80]">Delivery Partner</p>
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
                                href={`tel:${tracking.driverMobile}`}
                                className="text-xs text-[#006B4D] hover:underline"
                              >
                                {tracking.driverMobile}
                              </a>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-[#1D1D1D80]">Delivery Partner</p>
                        <p className="font-semibold text-[#1D1D1D]">Talli Express</p>
                      </>
                    )}
                    <p className="text-[#1D1D1D80] mt-3">Delivery Address</p>
                    <p className="text-[#1D1D1D] leading-relaxed">
                      {detail?.address || "Address unavailable."}
                    </p>
                  </div>
                </div>

                {detail ? (
                  <div>
                    <h3 className="text-sm font-bold text-[#1D1D1D] mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      {detail.items.map((item, idx) => (
                        <div key={`${item.name}-${idx}`} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-[#1D1D1D] truncate">
                            {item.name} <span className="text-[#1D1D1D80]">x {item.quantity}</span>
                          </span>
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
                          <span>{fmtInr(summary?.shipping ?? 0)}</span>
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
            <a href={PHONE_HREF} className="border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm text-center font-semibold hover:bg-[#FAFAFA]">
              {PHONE_DISPLAY}
            </a>
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm text-center font-semibold hover:bg-[#FAFAFA]">
              WhatsApp Us
            </a>
            <a href={EMAIL_HREF} className="border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm text-center font-semibold hover:bg-[#FAFAFA]">
              Email Us
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

