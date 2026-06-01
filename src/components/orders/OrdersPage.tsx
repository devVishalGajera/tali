"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  classifyOrderStatus,
  formatOrderDate,
  getOrderStatusBadgeClass,
  getOrdersApi,
  type OrderListItem,
} from "@/lib/api/order";
import { parseMoney } from "@/lib/api/cart";
import { fmtInr } from "@/lib/checkout/formatMoney";

const orderTotal = (order: OrderListItem) => {
  const raw = order.total ?? order.order_total;
  const n = parseMoney(raw as string | number);
  return n > 0 ? fmtInr(n) : "—";
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/login?redirect=/orders");
      return;
    }

    setLoading(true);
    setError(null);
    getOrdersApi({ token, page_no: page })
      .then((res) => {
        if (res.code === 1 && Array.isArray(res.data)) {
          setOrders(res.data);
          if (res.total_pages != null) setTotalPages(res.total_pages);
        } else {
          setOrders([]);
          setError(res.message || "Could not load orders.");
        }
      })
      .catch(() => setError("Could not load orders."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, page, router]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1D1D1D]">My orders</h1>
            <p className="text-sm text-[#1D1D1D80] mt-1">Track and view your past orders</p>
          </div>
          <Link href="/" className="text-sm text-[#006B4D] font-medium hover:underline shrink-0">
            Continue shopping
          </Link>
        </div>

        {loading && (
          <p className="text-sm text-[#1D1D1D80] text-center py-12">Loading orders…</p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E8E8]">
            <p className="text-4xl mb-3" aria-hidden>🛒</p>
            <p className="text-sm font-semibold text-[#1D1D1D]">No orders yet</p>
            <p className="text-xs text-[#1D1D1D80] mt-2 mb-6">When you place an order, it will show up here.</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#006B4D] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#005a3f] transition-colors"
            >
              Start shopping
            </Link>
          </div>
        )}

        <ul className="space-y-3">
          {orders.map((order) => {
            const label = order.order_number ?? `TL${order.id}`;
            const date = formatOrderDate(order.placed_date ?? order.created_at ?? "");
            const statusKind = classifyOrderStatus(order.status, order.statusCode);
            const isFailed = statusKind === "rejected" || statusKind === "cancelled";
            return (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-2xl border border-[#E8E8E8] px-5 py-4 hover:border-[#006B4D]/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-[#1D1D1D]">{label}</p>
                        {order.status && (
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${getOrderStatusBadgeClass(order.status, order.statusCode)}`}
                          >
                            {order.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#1D1D1D80] mt-1">{date}</p>
                      {order.payment_type && (
                        <p className="text-[10px] text-[#1D1D1D60] mt-0.5">{order.payment_type}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-bold ${isFailed ? "text-[#1D1D1D]" : "text-[#006B4D]"}`}
                      >
                        {orderTotal(order)}
                      </p>
                      <p className={`text-[10px] mt-1 ${isFailed ? "text-[#1D1D1D80]" : "text-[#006B4D]"}`}>
                        View details →
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {orders.length > 0 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 text-sm border border-[#E8E8E8] rounded-lg disabled:opacity-40 hover:border-[#006B4D]/40 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-[#1D1D1D80]">
              Page {page}
              {totalPages != null ? ` of ${totalPages}` : ""}
            </span>
            <button
              type="button"
              disabled={totalPages != null && page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm border border-[#E8E8E8] rounded-lg disabled:opacity-40 hover:border-[#006B4D]/40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
