"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

interface Props {
  header:          ReactNode;
  footer:          ReactNode;
  cartModal:       ReactNode;
  cartDrawer:      ReactNode;
  wishlistDrawer:  ReactNode;
  children:        ReactNode;
}

export default function MainShell({ header, footer, cartModal, cartDrawer, wishlistDrawer, children }: Props) {
  const pathname  = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  return (
    <>
      {!isAuthPage && header}
      {children}
      {!isAuthPage && footer}
      {!isAuthPage && cartModal}
      {!isAuthPage && cartDrawer}
      {!isAuthPage && wishlistDrawer}
    </>
  );
}
