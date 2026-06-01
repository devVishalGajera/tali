"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getOrderDetailApi,
  getOrderStatusBadgeClass,
  trackOrderApi,
  formatOrderDate,
  type OrderDetail,
  type OrderTracking,
} from "@/lib/api/order";
import OrderTracker from "@/components/orders/OrderTracker";
import { fmtInr } from "@/lib/checkout/formatMoney";

interface Props {
  orderId: string;
}

export default function OrderDetailPage({ orderId }: Props) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace(`/login?redirect=/orders/${orderId}`);
      return;
    }

    setLoading(true);
    Promise.all([
      getOrderDetailApi({ token, id: orderId }),
      trackOrderApi({ token, id: orderId }).catch(() => null),
    ])
      .then(([detailRes, trackRes]) => {
        if (detailRes.code === 1 && detailRes.data) {
          setDetail(detailRes.data);
        } else {
          setError(detailRes.message || "Order not found.");
        }
        if (trackRes?.code === 1 && trackRes.data) {
          setTracking(trackRes.data);
        }
      })
      .catch(() => setError("Could not load order."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, orderId, router]);

  const steps = tracking?.steps;
  const displayTotal = detail?.total ?? 0;
  const displayStatus = tracking?.orderStatus ?? detail?.status ?? "Unknown";
  const isTerminalFailure =
    tracking?.isRejected ||
    tracking?.isCancelled ||
    detail?.isRejected ||
    detail?.isCancelled;
  const showTracker = steps && steps.length > 0 && !isTerminalFailure;

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-8 px-4 sm:px-6 md:px-10">
      <div className="max-w-3xl mx-auto space-y-5">
        <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-[#006B4D] hover:underline">
          ← Back to orders
        </Link>

        {loading && (
          <p className="text-sm text-[#1D1D1D80] text-center py-16">Loading order…</p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        {detail && !loading && (
          <>
            <div className="bg-white rounded-2xl border border-[#E8E8E8] px-5 sm:px-6 py-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-[#1D1D1D]">Order {detail.orderNumber}</h1>
                  <p className="text-xs text-[#1D1D1D80] mt-1">{formatOrderDate(detail.placedAt)}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getOrderStatusBadgeClass(displayStatus, detail.statusCode)}`}
                >
                  {displayStatus}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F0F7F4] rounded-xl px-4 py-4">
                <div>
                  <p className="text-[10px] font-semibold text-[#1D1D1D60] uppercase">Order ID</p>
                  <p className="text-sm font-bold text-[#1D1D1D] mt-0.5">{detail.orderNumber}</p>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-[#E8E8E8] pt-3 sm:pt-0 sm:pl-4">
                  <p className="text-[10px] font-semibold text-[#1D1D1D60] uppercase">Payment</p>
                  <p className="text-sm font-bold text-[#1D1D1D] mt-0.5">{detail.paymentType ?? "Cash"}</p>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-[#E8E8E8] pt-3 sm:pt-0 sm:pl-4">
                  <p className="text-[10px] font-semibold text-[#1D1D1D60] uppercase">Total</p>
                  <p className="text-sm font-bold text-[#006B4D] mt-0.5">{fmtInr(displayTotal)}</p>
                </div>
              </div>
            </div>

            {showTracker && (
              <div className="bg-white rounded-2xl border border-[#E8E8E8] px-5 sm:px-6 py-6">
                <h2 className="text-sm font-bold text-[#1D1D1D] mb-2">Order status</h2>
                {tracking?.deliveryTime && (
                  <p className="text-xs text-[#006B4D] mb-4 font-medium">
                    Estimated delivery: {tracking.deliveryTime}
                  </p>
                )}
                <OrderTracker steps={steps!} />
              </div>
            )}

            {isTerminalFailure && (
              <div className="bg-white rounded-2xl border border-[#E8E8E8] px-5 sm:px-6 py-5">
                <p className="text-sm text-[#1D1D1D80]">
                  This order is{" "}
                  {(tracking?.isRejected || detail?.isRejected) ? "rejected" : "cancelled"}.
                  {detail?.rejectReason ? ` Reason: ${detail.rejectReason}.` : ""}
                </p>
              </div>
            )}

            {detail.storeName && (
              <div className="bg-white rounded-2xl border border-[#E8E8E8] px-5 py-5">
                <h2 className="text-sm font-bold text-[#1D1D1D] mb-2">Store</h2>
                <p className="text-sm font-semibold text-[#1D1D1D]">{detail.storeName}</p>
                {detail.storeAddress && (
                  <p className="text-sm text-[#1D1D1D80] mt-1 leading-relaxed">{detail.storeAddress}</p>
                )}
              </div>
            )}

            {detail.address && (
              <div className="bg-white rounded-2xl border border-[#E8E8E8] px-5 py-5">
                <h2 className="text-sm font-bold text-[#1D1D1D] mb-2">Delivery address</h2>
                <p className="text-sm text-[#1D1D1D80] leading-relaxed">{detail.address}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
              <h2 className="text-sm font-bold text-[#1D1D1D] px-5 pt-5 pb-3">Items</h2>
              {detail.items.length === 0 ? (
                <p className="text-sm text-[#1D1D1D80] px-5 pb-5">No line items returned for this order.</p>
              ) : (
                <ul className="divide-y divide-[#E8E8E8]">
                  {detail.items.map((item, idx) => (
                    <li key={`${item.name}-${idx}`} className="flex gap-4 px-5 py-4">
                      <div className="w-14 h-14 rounded-lg bg-[#F5F5F5] shrink-0 overflow-hidden relative">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-contain p-1"
                            sizes="56px"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl opacity-40">🍾</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1D1D1D] truncate">{item.name}</p>
                        {item.volume && (
                          <p className="text-xs text-[#1D1D1D60] mt-0.5">{item.volume}</p>
                        )}
                        <p className="text-xs text-[#1D1D1D80] mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[#1D1D1D] shrink-0">
                        {fmtInr(item.price * item.quantity || item.price)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="border-t border-[#E8E8E8] px-5 py-4 space-y-2">
                {detail.subtotal != null && detail.subtotal > 0 && (
                  <div className="flex justify-between text-sm text-[#1D1D1D80]">
                    <span>Subtotal</span>
                    <span>{fmtInr(detail.subtotal)}</span>
                  </div>
                )}
                {detail.shipping != null && detail.shipping > 0 && (
                  <div className="flex justify-between text-sm text-[#1D1D1D80]">
                    <span>Shipping</span>
                    <span>{fmtInr(detail.shipping)}</span>
                  </div>
                )}
                {detail.permitCharge != null && detail.permitCharge > 0 && (
                  <div className="flex justify-between text-sm text-[#1D1D1D80]">
                    <span>Permit fee</span>
                    <span>{fmtInr(detail.permitCharge)}</span>
                  </div>
                )}
                {detail.voucherAmount != null && detail.voucherAmount > 0 && (
                  <div className="flex justify-between text-sm text-[#1D1D1D80]">
                    <span>Voucher discount</span>
                    <span>- {fmtInr(detail.voucherAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#1D1D1D] pt-1">
                  <span>Total</span>
                  <span className="text-[#006B4D]">{fmtInr(displayTotal)}</span>
                </div>
              </div>
            </div>

            {(detail.specialInstruction || detail.permitNumber) && (
              <div className="bg-white rounded-2xl border border-[#E8E8E8] px-5 py-5 space-y-3">
                {detail.permitNumber && (
                  <div>
                    <p className="text-xs font-semibold text-[#1D1D1D60] uppercase">Permit number</p>
                    <p className="text-sm text-[#1D1D1D] mt-0.5">{detail.permitNumber}</p>
                  </div>
                )}
                {detail.specialInstruction && (
                  <div>
                    <p className="text-xs font-semibold text-[#1D1D1D60] uppercase">Delivery instructions</p>
                    <p className="text-sm text-[#1D1D1D] mt-0.5">{detail.specialInstruction}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
