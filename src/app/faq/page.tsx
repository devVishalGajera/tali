import type { Metadata } from "next";
import FaqPageClient from "@/components/faq/FaqPageClient";
import { getFaqApi } from "@/lib/api/guest";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about orders, delivery, returns, and account support.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getFaqApi();

  return <FaqPageClient faqs={faqs} />;
}

