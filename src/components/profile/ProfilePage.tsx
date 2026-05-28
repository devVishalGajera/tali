"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { changePasswordApi, getDisplayName, updateProfileApi } from "@/lib/api/auth";

function profileImageSrc(path: string | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `/api/img?url=${encodeURIComponent(path)}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, token, user, profileLoading, refreshProfile, updateUser } = useAuth();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setIsEditing(searchParams.get("edit") === "1");
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.first_name ?? "");
    setLastName(user.last_name ?? "");
    setEmail(user.email ?? "");
    setCountryCode(user.country_code ?? "+91");
    setMobileNumber(user.mobile_number ?? "");
    setDob(user.dob ?? "");
    setGender(user.gender ?? "");
    setProfileFile(null);
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/profile");
      return;
    }
    setProfileError(null);
    refreshProfile().catch(() => setProfileError("Could not load profile. Showing saved details."));
  }, [isAuthenticated, router, refreshProfile]);

  if (!isAuthenticated) return null;

  const avatarSrc = profileImageSrc(user?.profile_image_full_path);
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const cancelEdit = () => {
    if (user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
      setEmail(user.email ?? "");
      setCountryCode(user.country_code ?? "+91");
      setMobileNumber(user.mobile_number ?? "");
      setDob(user.dob ?? "");
      setGender(user.gender ?? "");
      setProfileFile(null);
    }
    setProfileMsg(null);
    setIsEditing(false);
  };

  const saveProfile = async () => {
    if (!user || !token) return;
    if (!firstName.trim()) {
      setProfileError("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setProfileError("Last name is required.");
      return;
    }
    if (!email.trim()) {
      setProfileError("Email is required.");
      return;
    }
    if (!countryCode.trim()) {
      setProfileError("Country code is required.");
      return;
    }
    if (!mobileNumber.trim()) {
      setProfileError("Mobile number is required.");
      return;
    }
    setSavingProfile(true);
    const nextUser = {
      ...user,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      country_code: countryCode.trim(),
      mobile_number: mobileNumber.trim(),
      dob: dob.trim() || undefined,
      gender: gender.trim() || undefined,
    };
    try {
      const res = await updateProfileApi({
        token,
        first_name: nextUser.first_name,
        last_name: nextUser.last_name,
        email: nextUser.email,
        country_code: nextUser.country_code,
        mobile_number: nextUser.mobile_number,
        dob: nextUser.dob,
        gender: nextUser.gender,
        profile: profileFile ?? undefined,
      });
      if (res.code !== 1) {
        throw new Error(res.message || "Could not update profile.");
      }
      const updated = res.data ?? nextUser;
      updateUser(updated);
      setProfileError(null);
      setProfileMsg("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Could not update profile.");
      setProfileMsg(null);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!token) return;
    if (!oldPassword.trim()) {
      setPasswordError("Current password is required.");
      return;
    }
    if (!newPassword.trim()) {
      setPasswordError("New password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Confirm password does not match.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await changePasswordApi({
        token,
        old_password: oldPassword.trim(),
        password: newPassword,
      });
      if (res.code !== 1) {
        throw new Error(res.message || "Could not change password.");
      }
      setPasswordError(null);
      setPasswordMsg(res.message || "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Could not change password.");
      setPasswordMsg(null);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-8 px-4 sm:px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1D1D1D]">My Profile</h1>
            <p className="text-sm text-[#1D1D1D80] mt-1">
              Manage your personal information and account details
            </p>
          </div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 border border-[#E8E8E8] bg-white hover:bg-[#F8F8F8] text-[#1D1D1D] text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            View My Orders
          </Link>
        </div>

        {profileLoading && !user && (
          <p className="text-sm text-[#1D1D1D80] text-center py-12">Loading profile…</p>
        )}

        {user && (
          <div className="space-y-5">
            <section className="bg-white border border-[#E8E8E8] rounded-xl p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-base font-bold text-[#1D1D1D]">Profile Information</h2>
                  <p className="text-xs text-[#1D1D1D80] mt-1">
                    Update your profile details
                  </p>
                </div>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileError(null);
                      setProfileMsg(null);
                      setIsEditing(true);
                    }}
                    className="text-sm font-semibold text-[#006B4D] hover:underline"
                  >
                    Edit profile
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-sm text-[#1D1D1D80] hover:text-[#1D1D1D] hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {profileError && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4">
                  {profileError}
                </p>
              )}
              {profileMsg && (
                <p className="text-sm text-green-800 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
                  {profileMsg}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-[190px_1fr] gap-5">
                <div>
                  <p className="text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-2">
                    Profile Photo
                  </p>
                  <div className="w-[120px] h-[120px] rounded-full overflow-hidden border border-[#E8E8E8] bg-[#F6F6F6] flex items-center justify-center">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={getDisplayName(user)} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-[#006B4D]">
                        {user.first_name?.charAt(0).toUpperCase() ?? "U"}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <div className="mt-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileFile(e.target.files?.[0] ?? null)}
                        className="w-full max-w-[190px] border border-[#E8E8E8] rounded-lg px-2 py-2 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-[#006B4D] file:px-2.5 file:py-1.5 file:text-[11px] file:font-semibold file:text-white hover:file:bg-[#005a3f]"
                      />
                      {profileFile && (
                        <p className="text-[11px] text-[#1D1D1D60] mt-1 break-all">
                          {profileFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                      First Name *
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 disabled:bg-[#F9F9F9] disabled:text-[#1D1D1D80]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                      Last Name *
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 disabled:bg-[#F9F9F9] disabled:text-[#1D1D1D80]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 disabled:bg-[#F9F9F9] disabled:text-[#1D1D1D80]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                      Mobile Number *
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={!isEditing}
                        className="w-20 border border-[#E8E8E8] rounded-lg px-2 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 disabled:bg-[#F9F9F9] disabled:text-[#1D1D1D80]"
                      />
                      <input
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 disabled:bg-[#F9F9F9] disabled:text-[#1D1D1D80]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      disabled={!isEditing}
                      className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 disabled:bg-[#F9F9F9] disabled:text-[#1D1D1D80]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      disabled={!isEditing}
                      className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 disabled:bg-[#F9F9F9] disabled:text-[#1D1D1D80]"
                    >
                      <option value="">Select gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={savingProfile}
                    className="inline-flex items-center justify-center bg-[#006B4D] hover:bg-[#005a3f] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </section>

            <section className="bg-white border border-[#E8E8E8] rounded-xl p-5 sm:p-6">
              <div className="mb-4">
                <h2 className="text-base font-bold text-[#1D1D1D]">Security Information</h2>
                <p className="text-xs text-[#1D1D1D80] mt-1">
                  Keep your account secure by updating your password regularly
                </p>
              </div>

              {passwordError && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4">
                  {passwordError}
                </p>
              )}
              {passwordMsg && (
                <p className="text-sm text-green-800 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
                  {passwordMsg}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    name="current-password-disabled"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    readOnly
                    onFocus={(e) => {
                      e.currentTarget.readOnly = false;
                    }}
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      setPasswordError(null);
                      setPasswordMsg(null);
                    }}
                    className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    name="new-password-disabled"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    readOnly
                    onFocus={(e) => {
                      e.currentTarget.readOnly = false;
                    }}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError(null);
                      setPasswordMsg(null);
                    }}
                    className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1D80] uppercase tracking-wide mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    name="confirm-password-disabled"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    readOnly
                    onFocus={(e) => {
                      e.currentTarget.readOnly = false;
                    }}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError(null);
                      setPasswordMsg(null);
                    }}
                    className="w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10"
                  />
                  {passwordsMismatch && (
                    <p className="text-xs text-red-600 mt-1">
                      New password and confirm password do not match.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={changingPassword || passwordsMismatch}
                  className="inline-flex items-center justify-center bg-[#006B4D] hover:bg-[#005a3f] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  {changingPassword ? "Updating..." : "Change Password"}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
