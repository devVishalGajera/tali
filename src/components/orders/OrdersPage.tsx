"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getOrdersApi, type OrderListItem } from "@/lib/api/order";

const fmt = (n: string | number | undefined) => {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (v == null || Number.isNaN(v)) return "—";
  return `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/login?redirect=/orders");
      return;
    }

    setLoading(true);
    getOrdersApi({ token, page_no: page })
      .then((res) => {
        if (res.code === 1 && Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
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
          <h1 className="text-2xl font-bold text-[#1D1D1D]">My orders</h1>
          <Link href="/" className="text-sm text-[#006B4D] hover:underline">
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
          <p className="text-sm text-[#1D1D1D80] text-center py-12">No orders yet.</p>
        )}

        <ul className="space-y-3">
          {orders.map((order) => {
            const id = order.id;
            return (
              <li key={id}>
                <Link
                  href={`/orders/${id}`}
                  className="block bg-white rounded-2xl border border-[#E8E8E8] px-5 py-4 hover:border-[#006B4D]/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#1D1D1D]">
                        Order #{order.order_number ?? id}
                      </p>
                      <p className="text-xs text-[#1D1D1D80] mt-1">
                        {order.placed_date ?? order.created_at ?? "—"}
                        {order.status ? ` · ${order.status}` : ""}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#006B4D]">{fmt(order.total as string)}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {orders.length > 0 && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 text-sm border border-[#E8E8E8] rounded-lg disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-[#1D1D1D80] flex items-center">Page {page}</span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm border border-[#E8E8E8] rounded-lg"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
