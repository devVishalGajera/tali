"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  formatOrderDate,
  type PlacedOrderInfo,
  type OrderTrackStep,
} from "@/lib/api/order";
import { fmtInr } from "@/lib/checkout/formatMoney";
import ConfettiBurst from "@/components/orders/ConfettiBurst";
import OrderTracker from "@/components/orders/OrderTracker";

const PLACED_STEPS: OrderTrackStep[] = [
  {
    key: "placed",
    label: "Order Placed",
    subtitle: "We've received your order",
    active: true,
    completed: false,
    timestamp: undefined,
  },
  {
    key: "processing",
    label: "Processing",
    subtitle: "We're packing your items",
    active: false,
    completed: false,
  },
  {
    key: "delivery",
    label: "Out for Delivery",
    subtitle: "On the way to you",
    active: false,
    completed: false,
  },
  {
    key: "delivered",
    label: "Delivered",
    subtitle: "Get ready to enjoy!",
    active: false,
    completed: false,
  },
];

interface Props {
  open: boolean;
  order: PlacedOrderInfo | null;
  onClose: () => void;
}

const OrderConfirmedModal = ({ open, order, onClose }: Props) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !order) return null;

  const placedLabel = formatOrderDate(order.placedAt);
  const steps = PLACED_STEPS.map((s, i) =>
    i === 0 ? { ...s, timestamp: placedLabel !== "—" ? placedLabel : undefined } : s,
  );
  const points = order.pointsEarned ?? 25;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmed-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fadeInUp">
        <ConfettiBurst />

        <div className="relative z-20 px-5 sm:px-8 pt-8 pb-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-[#006B4D] flex items-center justify-center shadow-lg animate-[pulse_1.2s_ease-in-out_1]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <h2 id="order-confirmed-title" className="text-xl sm:text-2xl font-bold text-[#006B4D]">
              🎉 Your Order is Confirmed!
            </h2>
            <p className="text-sm text-[#1D1D1D80] mt-2 max-w-md leading-relaxed">
              Thank you for shopping with Talli. We&apos;ve received your order and it&apos;s being processed.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F0F7F4] rounded-2xl px-4 py-4">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-semibold text-[#1D1D1D60] uppercase tracking-wide">Order ID</p>
              <p className="text-sm font-bold text-[#1D1D1D] mt-0.5">{order.orderNumber}</p>
            </div>
            <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-[#E8E8E8] pt-3 sm:pt-0 sm:pl-4">
              <p className="text-[10px] font-semibold text-[#1D1D1D60] uppercase tracking-wide">Order Date</p>
              <p className="text-sm font-bold text-[#1D1D1D] mt-0.5">{placedLabel}</p>
            </div>
            <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-[#E8E8E8] pt-3 sm:pt-0 sm:pl-4">
              <p className="text-[10px] font-semibold text-[#1D1D1D60] uppercase tracking-wide">Order Total</p>
              <p className="text-sm font-bold text-[#006B4D] mt-0.5">{fmtInr(order.total)}</p>
            </div>
          </div>

          <div className="mt-8">
            <OrderTracker steps={steps} />
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-[#E8F5EF] px-4 py-4 flex gap-3 items-start">
              <span className="text-2xl shrink-0" aria-hidden>🛍️</span>
              <div>
                <p className="text-sm font-bold text-[#1D1D1D]">What Happens Next?</p>
                <p className="text-xs text-[#1D1D1D80] mt-1 leading-relaxed">
                  Our team is preparing your order with care. You&apos;ll receive real-time updates at every step.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-[#FFF4E8] px-4 py-4 flex gap-3 items-start">
              <span className="text-2xl shrink-0" aria-hidden>🎧</span>
              <div>
                <p className="text-sm font-bold text-[#1D1D1D]">We&apos;ll Keep You Updated</p>
                <p className="text-xs text-[#1D1D1D80] mt-1 leading-relaxed">
                  You will receive notifications on SMS, WhatsApp and email about your order status.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-[#F3EEF9] px-4 py-4 flex gap-3 items-start">
              <span className="text-2xl shrink-0" aria-hidden>💚</span>
              <div>
                <p className="text-sm font-bold text-[#1D1D1D]">Need Help?</p>
                <p className="text-xs text-[#1D1D1D80] mt-1 leading-relaxed">
                  Our support team is here for you. Feel free to reach out anytime.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-dashed border-[#006B4D]/30 bg-[#F0F7F4] px-4 py-3">
            <p className="text-xs text-[#1D1D1D] text-center sm:text-left">
              Cheers to good times! 🥂 You earned <strong>{points} Talli Points</strong> with this order.
            </p>
            <Link
              href="/account"
              className="text-xs font-semibold text-[#006B4D] whitespace-nowrap hover:underline"
            >
              View My Points →
            </Link>
          </div>

          <p className="text-center text-xs text-[#1D1D1D80] mt-6">
            💚 Thanks for choosing Talli! Great drinks • Best prices • Delivered to you
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/orders"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold py-3.5 rounded-xl transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
              View My Orders
            </Link>
            <Link
              href="/"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-[#006B4D] text-[#006B4D] text-sm font-semibold py-3.5 rounded-xl hover:bg-[#F0F7F4] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l9-9 9 9M5 10v10h14V10" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmedModal;
