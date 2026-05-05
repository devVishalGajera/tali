"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Redirects to /login?redirect=<current-path> if the user is not authenticated.
 * Drop this hook at the top of any page that requires login.
 *
 * @example
 *   export default function CheckoutPage() {
 *     useRequireAuth();
 *     ...
 *   }
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  return isAuthenticated;
}
