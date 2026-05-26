"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  forgotPasswordApi,
  resetPasswordApi,
  extractUserIdFromForgotResponse,
} from "@/lib/api/auth";

type Step = "email" | "reset";

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const backToLoginHref = `/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`;

  const [step, setStep] = useState<Step>("email");

  /* ── Step 1: Email ─────────────────────────────────────────── */
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [emailApiError, setEmailApiError] = useState("");

  /* ── Step 2: OTP + new password ────────────────────────────── */
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [resetTouched, setResetTouched] = useState<{
    otp?: boolean;
    newPassword?: boolean;
    confirmPassword?: boolean;
  }>({});
  const [resetting, setResetting] = useState(false);
  const [resetApiError, setResetApiError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const emailError = !email
    ? "Email is required."
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? "Enter a valid email address."
    : "";

  const otpError = !otp
    ? "Code is required."
    : !/^\d{4,8}$/.test(otp.trim())
    ? "Enter the 4–8 digit code we sent."
    : "";

  const newPasswordError = !newPassword
    ? "New password is required."
    : newPassword.length < 6
    ? "Password must be at least 6 characters."
    : "";

  const confirmPasswordError = !confirmPassword
    ? "Please confirm your password."
    : confirmPassword !== newPassword
    ? "Passwords do not match."
    : "";

  /* ── Submit handlers ───────────────────────────────────────── */

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    if (emailError) return;

    setSendingOtp(true);
    setEmailApiError("");
    try {
      const res = await forgotPasswordApi({ email: email.trim() });
      if (res.code !== 1) {
        setEmailApiError(res.message || "We couldn't send the reset code. Please try again.");
        return;
      }
      const id = extractUserIdFromForgotResponse(res);
      if (id == null) {
        setEmailApiError("Unexpected response from server. Please try again later.");
        return;
      }
      setUserId(id);
      setStep("reset");
      startResendCooldown(30);
    } catch {
      setEmailApiError("Something went wrong. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || sendingOtp) return;
    setSendingOtp(true);
    setResetApiError("");
    try {
      const res = await forgotPasswordApi({ email: email.trim() });
      if (res.code !== 1) {
        setResetApiError(res.message || "We couldn't resend the code. Please try again.");
        return;
      }
      const id = extractUserIdFromForgotResponse(res);
      if (id != null) setUserId(id);
      startResendCooldown(30);
    } catch {
      setResetApiError("Something went wrong. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const startResendCooldown = (seconds: number) => {
    setResendCooldown(seconds);
    const tick = () => {
      setResendCooldown((s) => {
        if (s <= 1) return 0;
        setTimeout(tick, 1000);
        return s - 1;
      });
    };
    setTimeout(tick, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetTouched({ otp: true, newPassword: true, confirmPassword: true });
    if (otpError || newPasswordError || confirmPasswordError || userId == null) return;

    setResetting(true);
    setResetApiError("");
    try {
      const res = await resetPasswordApi({
        id:       userId,
        otp:      otp.trim(),
        password: newPassword,
      });
      if (res.code !== 1) {
        setResetApiError(res.message || "Incorrect code or expired. Please try again.");
        return;
      }
      setResetSuccess(res.message || "Your password has been reset successfully.");
      setTimeout(() => router.replace(backToLoginHref), 1500);
    } catch {
      setResetApiError("Something went wrong. Please try again.");
    } finally {
      setResetting(false);
    }
  };

  /* ── Helpers ───────────────────────────────────────────────── */

  const inputBase = (hasError: boolean) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[#1D1D1D] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition bg-white ${
      hasError
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-gray-200 focus:border-[#006B4D] focus:ring-[#006B4D]/10"
    }`;

  /* ── Step 1 UI ─────────────────────────────────────────────── */
  if (step === "email") {
    return (
      <>
        <div className="mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#006B4D]/10 mb-5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#006B4D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold text-[#1D1D1D] leading-tight mb-2">Forgot password?</h1>
          <p className="text-sm text-[#1D1D1D60] leading-relaxed">
            Enter the email associated with your Talli account and we&apos;ll send you a verification code.
          </p>
        </div>

        <form onSubmit={handleSendOtp} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">Email address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailApiError(""); }}
                onBlur={() => setEmailTouched(true)}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputBase(emailTouched && !!emailError)}
              />
            </div>
            {emailTouched && emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
          </div>

          {emailApiError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
              <p className="text-xs text-red-600">{emailApiError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={sendingOtp}
            className="w-full py-3.5 bg-[#006B4D] hover:bg-[#005a3f] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {sendingOtp ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
            {sendingOtp ? "Sending code…" : "Send Verification Code"}
          </button>
        </form>

        <p className="text-center text-sm text-[#1D1D1D60] mt-8">
          Remember your password?{" "}
          <Link href={backToLoginHref} className="text-[#006B4D] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </>
    );
  }

  /* ── Step 2 UI ─────────────────────────────────────────────── */
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#006B4D]/10 mb-5">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#006B4D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.39 0 4.56.93 6.18 2.45" />
          </svg>
        </div>
        <h1 className="text-[28px] font-bold text-[#1D1D1D] leading-tight mb-2">Reset password</h1>
        <p className="text-sm text-[#1D1D1D60] leading-relaxed">
          We sent a verification code to{" "}
          <span className="font-semibold text-[#1D1D1D]">{email}</span>.
          Enter it below along with your new password.
        </p>
        <button
          type="button"
          onClick={() => {
            setStep("email");
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");
            setResetTouched({});
            setResetApiError("");
            setResetSuccess("");
          }}
          className="text-xs text-[#006B4D] font-medium hover:underline mt-2 inline-flex items-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Use a different email
        </button>
      </div>

      <form onSubmit={handleResetPassword} noValidate className="space-y-4">
        {/* OTP */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-[#1D1D1D]">Verification code</label>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || sendingOtp}
              className="text-xs text-[#006B4D] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              {sendingOtp
                ? "Sending…"
                : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend code"}
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16v-3a2 2 0 00-2-2H5a2 2 0 00-2 2v3" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
                setOtp(digits);
                setResetApiError("");
              }}
              onBlur={() => setResetTouched((t) => ({ ...t, otp: true }))}
              placeholder="Enter the code"
              autoComplete="one-time-code"
              className={`${inputBase(!!resetTouched.otp && !!otpError)} tracking-[0.4em] font-semibold`}
            />
          </div>
          {resetTouched.otp && otpError && <p className="mt-1 text-xs text-red-500">{otpError}</p>}
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">New password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </span>
            <input
              type={showPass ? "text" : "password"}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setResetApiError(""); }}
              onBlur={() => setResetTouched((t) => ({ ...t, newPassword: true }))}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              className={`${inputBase(!!resetTouched.newPassword && !!newPasswordError)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {resetTouched.newPassword && newPasswordError && (
            <p className="mt-1 text-xs text-red-500">{newPasswordError}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">Confirm password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </span>
            <input
              type={showPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setResetApiError(""); }}
              onBlur={() => setResetTouched((t) => ({ ...t, confirmPassword: true }))}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              className={inputBase(!!resetTouched.confirmPassword && !!confirmPasswordError)}
            />
          </div>
          {resetTouched.confirmPassword && confirmPasswordError && (
            <p className="mt-1 text-xs text-red-500">{confirmPasswordError}</p>
          )}
        </div>

        {resetApiError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>
            <p className="text-xs text-red-600">{resetApiError}</p>
          </div>
        )}

        {resetSuccess && (
          <div className="flex items-center gap-2 bg-[#006B4D]/10 border border-[#006B4D]/30 rounded-xl px-4 py-3">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#006B4D" strokeWidth="2.2" className="flex-shrink-0" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-xs text-[#006B4D] font-medium">
              {resetSuccess} Redirecting to sign in…
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={resetting || !!resetSuccess}
          className="w-full py-3.5 bg-[#006B4D] hover:bg-[#005a3f] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {resetting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {resetting ? "Resetting…" : "Reset Password"}
        </button>
      </form>

      <p className="text-center text-sm text-[#1D1D1D60] mt-8">
        Remember your password?{" "}
        <Link href={backToLoginHref} className="text-[#006B4D] font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
