import type { Metadata } from "next";
import LegalDocumentPage from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = {
  title:       "Privacy Policy",
  description:
    "How Talli Drinks collects, uses, shares, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="This document covers our terms of service together with our privacy and safety practices. It explains what we collect, how we use it, and the choices you have when using Talli Drinks."
    />
  );
}
