"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getDisplayName } from "@/lib/api/auth";

function profileImageSrc(path: string | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `/api/img?url=${encodeURIComponent(path)}`;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-[#1D1D1D]">{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, profileLoading, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/profile");
      return;
    }
    setError(null);
    refreshProfile().catch(() => setError("Could not load profile. Showing saved details."));
  }, [isAuthenticated, router, refreshProfile]);

  if (!isAuthenticated) return null;

  const avatarSrc = profileImageSrc(user?.profile_image_full_path);
  const phone = user
    ? [user.country_code, user.mobile_number].filter(Boolean).join(" ").trim()
    : "";

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#1D1D1D]">My profile</h1>
          <Link href="/orders" className="text-sm text-[#006B4D] hover:underline">
            My orders
          </Link>
        </div>

        {profileLoading && !user && (
          <p className="text-sm text-[#1D1D1D80] text-center py-12">Loading profile…</p>
        )}

        {error && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {user && (
          <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
            <div className="px-6 py-6 border-b border-[#F0F0F0] flex items-center gap-4">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover border border-[#E8E8E8]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#006B4D] text-white text-xl font-bold flex items-center justify-center">
                  {user.first_name?.charAt(0).toUpperCase() ?? "U"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-lg font-bold text-[#1D1D1D] truncate">{getDisplayName(user)}</p>
                <p className="text-sm text-[#1D1D1D80] truncate">{user.email}</p>
                {user.total_orders != null && (
                  <p className="text-xs text-[#006B4D] font-semibold mt-1">
                    {user.total_orders} order{user.total_orders === 1 ? "" : "s"}
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-6 space-y-5">
              <Field label="Email" value={user.email || "—"} />
              {phone && <Field label="Phone" value={phone} />}
              {user.dob && <Field label="Date of birth" value={user.dob} />}
              {user.gender && <Field label="Gender" value={user.gender} />}

              {user.user_address?.address && (
                <div>
                  <p className="text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                    Delivery address
                  </p>
                  <p className="text-sm text-[#1D1D1D]">{user.user_address.address}</p>
                  {user.user_address.city && (
                    <p className="text-sm text-[#1D1D1D80] mt-0.5">{user.user_address.city}</p>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#F0F0F0] flex flex-wrap gap-3">
              <Link
                href="/checkout"
                className="text-sm font-semibold text-[#006B4D] hover:underline"
              >
                Go to checkout
              </Link>
              <Link
                href="/"
                className="text-sm text-[#1D1D1D80] hover:text-[#1D1D1D] hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
