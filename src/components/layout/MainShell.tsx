"use client";

import React from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useLocation } from "@/components/modals/LocationProvider";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

interface Props {
  header: ReactNode;
  footer: ReactNode;
  cartModal: ReactNode;
  cartDrawer: ReactNode;
  wishlistDrawer: ReactNode;
  children: ReactNode;
}

function ComingSoonScreen({ onSetLocation }: { onSetLocation: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6 text-center">
      {/* Illustration */}
      <div className="mb-8">
        <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Map background */}
          <rect x="20" y="30" width="120" height="90" rx="10" fill="#F0F4FF" stroke="#C7D2FE" strokeWidth="2"/>
          {/* Roads */}
          <line x1="20" y1="75" x2="140" y2="75" stroke="#C7D2FE" strokeWidth="3"/>
          <line x1="80" y1="30" x2="80" y2="120" stroke="#C7D2FE" strokeWidth="3"/>
          <line x1="20" y1="52" x2="60" y2="52" stroke="#E0E7FF" strokeWidth="2"/>
          <line x1="100" y1="98" x2="140" y2="98" stroke="#E0E7FF" strokeWidth="2"/>
          {/* Trees */}
          <circle cx="38" cy="48" r="6" fill="#A7F3D0"/>
          <circle cx="130" cy="48" r="6" fill="#A7F3D0"/>
          <circle cx="38" cy="102" r="6" fill="#A7F3D0"/>
          <circle cx="130" cy="102" r="6" fill="#A7F3D0"/>
          {/* Pin */}
          <circle cx="80" cy="62" r="18" fill="#EF4444" opacity="0.15"/>
          <path d="M80 44C72.268 44 66 50.268 66 58C66 66.5 80 84 80 84C80 84 94 66.5 94 58C94 50.268 87.732 44 80 44Z" fill="#EF4444"/>
          <circle cx="80" cy="58" r="6" fill="white"/>
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-[#1D1D1D] mb-3">Coming Soon…</h2>
      <p className="text-sm text-[#1D1D1D80] leading-relaxed max-w-xs mb-8">
        Unfortunately, it looks like Talli isn&apos;t available in your area yet.
        We&apos;ll make sure you&apos;re the first to know when we launch near you.
      </p>

      <button
        onClick={onSetLocation}
        className="w-full max-w-xs py-4 bg-[#EF4444] hover:bg-[#DC2626] active:scale-[0.98] text-white font-semibold text-sm rounded-full transition-all"
      >
        SET DELIVERY LOCATION
      </button>
    </div>
  );
}

export default function MainShell({ header, footer, cartModal, cartDrawer, wishlistDrawer, children }: Props) {
  const pathname = usePathname();
  const { flag, showModal, isModalOpen } = useLocation();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <React.Fragment key="header">{header}</React.Fragment>
      <React.Fragment key="content">{children}</React.Fragment>
      <React.Fragment key="footer">{footer}</React.Fragment>
      <React.Fragment key="cartModal">{cartModal}</React.Fragment>
      <React.Fragment key="cartDrawer">{cartDrawer}</React.Fragment>
      <React.Fragment key="wishlistDrawer">{wishlistDrawer}</React.Fragment>
      {flag === 3 && !isModalOpen && (
        <React.Fragment key="comingSoon">
          <ComingSoonScreen onSetLocation={showModal} />
        </React.Fragment>
      )}
    </>
  );
}
