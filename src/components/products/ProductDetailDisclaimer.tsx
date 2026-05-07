"use client";

import { useLocation } from "@/components/modals/LocationProvider";

export default function ProductDetailDisclaimer() {
  const { purchaseAllow } = useLocation();

  return (
    <div className="w-full">
      {/* Always-visible disclaimer banner */}
      <div className="w-full bg-[#F7F7F7] py-3 px-4 text-center">
        <p className="text-xs font-semibold text-[#1D1D1D]">
          Alcohol consumption is subject to legal drinking age. Please drink responsibly.
        </p>
        <p className="text-xs text-[#1D1D1D80] mt-0.5">
          Prices displayed are estimated and may vary from your local retailer due to state regulations and store policies.
        </p>
      </div>

      {/* Shown only when purchase is not allowed */}
      {!purchaseAllow && (
        <div className="w-full text-center py-3">
          <p className="text-sm font-medium text-red-500">
            We&apos;re not delivering to your area right now
          </p>
        </div>
      )}
    </div>
  );
}
