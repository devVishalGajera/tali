"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { Category } from "@/lib/api/categories";

interface Props {
  categories: Category[];
}

const CategoryTabs = ({ categories }: Props) => {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const select = (id: number | null) => {
    const next = new URLSearchParams(params.toString());
    if (id === null) {
      next.delete("categories");
    } else {
      next.set("categories", String(id));
    }
    /* Selecting a top-level category clears subcategory selection */
    next.delete("subcats");

    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    });
  };

  if (categories.length === 0) return null;

  /* Read from live URL params — NOT from the server prop (which is stale during transition) */
  const rawId  = params.get("categories");
  const activeId = rawId ? Number(rawId) : null;

  return (
    <div
      className={`flex flex-wrap gap-2.5 mb-6 md:mb-8 transition-opacity ${isPending ? "opacity-60 pointer-events-none" : ""}`}
      role="tablist"
      aria-label="Product categories"
    >
      {/* "All" tab */}
      <button
        role="tab"
        aria-selected={activeId === null}
        onClick={() => select(null)}
        className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
          activeId === null
            ? "bg-[#F02A0B] text-white"
            : "bg-white text-[#646057] border border-gray-200 hover:border-gray-300"
        }`}
      >
        All
      </button>

      {categories.map((c) => (
        <button
          key={c.id}
          role="tab"
          aria-selected={activeId === c.id}
          onClick={() => select(c.id)}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
            activeId === c.id
              ? "bg-[#F02A0B] text-white"
              : "bg-white text-[#646057] border border-gray-200 hover:border-gray-300"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
