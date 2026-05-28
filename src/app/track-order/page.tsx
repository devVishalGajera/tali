import type { Metadata } from "next";
import TrackOrderPage from "@/components/orders/TrackOrderPage";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your Talli Drinks order in real-time using order ID or mobile number.",
  alternates: { canonical: "/track-order" },
};

export default function Page() {
  return <TrackOrderPage />;
}

