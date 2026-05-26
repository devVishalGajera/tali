/**
 * Guest endpoints — public content fetched without auth.
 *
 *   /guest/terms  → combined Terms & Conditions / Privacy Policy HTML
 *   /guest/faq    → list of frequently-asked questions
 *
 * Both endpoints rarely change, so we cache the response for one hour
 * via Next.js ISR.
 */

import { apiFetch } from "./client";

export interface TermsData {
  id:         number;
  term:       string;
  created_at: string;
  updated_at: string;
}

export interface FaqItem {
  id:         number;
  question:   string;
  answer:     string;
  created_at: string;
  updated_at: string;
}

export async function getTermsApi(): Promise<TermsData | null> {
  try {
    return await apiFetch<TermsData>("/guest/terms", { revalidate: 3600 });
  } catch (e) {
    console.error("[getTermsApi] failed", e);
    return null;
  }
}

export async function getFaqApi(): Promise<FaqItem[]> {
  try {
    const data = await apiFetch<FaqItem[]>("/guest/faq", { revalidate: 3600 });
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("[getFaqApi] failed", e);
    return [];
  }
}
