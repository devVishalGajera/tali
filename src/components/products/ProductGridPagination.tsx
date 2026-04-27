"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface Props {
  currentPage:  number;
  totalPages:   number;
  totalRecords: number;
}

export default function ProductGridPagination({ currentPage, totalPages, totalRecords }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(page));
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, { scroll: true });
    });
  };

  /* Build visible page numbers: 1 … prev current next … last */
  const pages: (number | "…")[] = [];
  const add = (n: number) => { if (!pages.includes(n)) pages.push(n); };

  add(1);
  if (currentPage > 3) pages.push("…");
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) add(i);
  if (currentPage < totalPages - 2) pages.push("…");
  if (totalPages > 1) add(totalPages);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <p className="text-sm text-[#646057]">
        Showing page <span className="font-semibold text-[#1D1D1D]">{currentPage}</span> of{" "}
        <span className="font-semibold text-[#1D1D1D]">{totalPages}</span> —{" "}
        <span className="font-semibold text-[#1D1D1D]">{totalRecords}</span> products
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm rounded-lg border border-[#E8E8E8] text-[#646057] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ‹ Prev
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-[#646057]">…</span>
          ) : (
            <button
              key={p}
              onClick={() => goTo(p as number)}
              className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                p === currentPage
                  ? "bg-[#F02A0B] text-white font-semibold"
                  : "border border-[#E8E8E8] text-[#646057] hover:bg-[#F5F5F5]"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm rounded-lg border border-[#E8E8E8] text-[#646057] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next ›
        </button>
      </div>
    </div>
  );
}
