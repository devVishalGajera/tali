import type { Metadata } from "next";
import LegalDocumentPage from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = {
  title:       "Terms & Conditions",
  description:
    "Terms and conditions, privacy and safety policies governing the use of Talli Drinks.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      eyebrow="Legal"
      title="Terms & Conditions"
      description="Please read these terms carefully. They cover your use of Talli Drinks, ordering and delivery, payments, refunds, and how we handle your personal information."
    />
  );
}
