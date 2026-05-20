"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getOrderDetailApi, trackOrderApi } from "@/lib/api/order";

interface Props {
  orderId: string;
}

export default function OrderDetailPage({ orderId }: Props) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [tracking, setTracking] = useState<Record<string, unknown> | null>(null);
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
          setDetail(
            typeof detailRes.data === "object" && detailRes.data !== null
              ? (detailRes.data as Record<string, unknown>)
              : { raw: detailRes.data },
          );
        } else {
          setError(detailRes.message || "Order not found.");
        }
        if (trackRes?.code === 1 && trackRes.data) {
          setTracking(
            typeof trackRes.data === "object" && trackRes.data !== null
              ? (trackRes.data as Record<string, unknown>)
              : { raw: trackRes.data },
          );
        }
      })
      .catch(() => setError("Could not load order."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, orderId, router]);

  const renderBlock = (label: string, data: Record<string, unknown> | null) => {
    if (!data) return null;
    return (
      <div className="bg-white rounded-2xl border border-[#E8E8E8] px-5 py-5">
        <h2 className="text-sm font-bold text-[#1D1D1D] mb-3">{label}</h2>
        <pre className="text-xs text-[#1D1D1D80] whitespace-pre-wrap break-words overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-3xl mx-auto space-y-4">
        <Link href="/orders" className="text-sm text-[#006B4D] hover:underline">
          ← Back to orders
        </Link>

        <h1 className="text-2xl font-bold text-[#1D1D1D]">Order #{orderId}</h1>

        {loading && <p className="text-sm text-[#1D1D1D80]">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {renderBlock("Order details", detail)}
        {renderBlock("Tracking", tracking)}
      </div>
    </main>
  );
}
