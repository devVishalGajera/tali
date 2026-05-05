"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { signupApi } from "@/lib/api/auth";

type Fields = {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  password: string;
  confirm: string;
  terms: boolean;
};
type TextFields = Omit<Fields, "terms">;
type FieldErrors = Partial<Record<keyof TextFields, string>>;

function validate(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.first_name.trim()) errors.first_name = "First name is required.";
  if (!fields.last_name.trim()) errors.last_name = "Last name is required.";
  if (!fields.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!fields.mobile_number) {
    errors.mobile_number = "Mobile number is required.";
  } else if (!/^\d{10}$/.test(fields.mobile_number.replace(/\s/g, ""))) {
    errors.mobile_number = "Enter a valid 10-digit mobile number.";
  }
  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (fields.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!fields.confirm) {
    errors.confirm = "Please confirm your password.";
  } else if (fields.confirm !== fields.password) {
    errors.confirm = "Passwords do not match.";
  }
  return errors;
}

const EyeIcon = ({ visible }: { visible: boolean }) =>
  visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { setAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) router.replace(redirect);
  }, [isAuthenticated, redirect, router]);

  const [form, setForm] = useState<Fields>({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [touched, setTouched] = useState<Partial<Record<keyof TextFields, boolean>>>({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [termsError, setTermsError] = useState("");

  const fieldErrors = validate(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setApiError("");
    if (name === "terms") setTermsError("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name !== "terms") {
      setTouched((t) => ({ ...t, [e.target.name]: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Partial<Record<keyof TextFields, boolean>> = {
      first_name: true, last_name: true, email: true,
      mobile_number: true, password: true, confirm: true,
    };
    setTouched(allTouched);
    if (!form.terms) { setTermsError("Please accept the terms & conditions."); return; }
    if (Object.keys(fieldErrors).length > 0) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await signupApi({
        first_name: form.first_name,
        last_name: form.last_name,
        mobile_number: form.mobile_number,
        email: form.email,
        password: form.password,
      });
      if (res.code === 1 && res.token && res.data) {
        setAuth(res.token, res.data);
        router.replace(redirect);
      } else {
        setApiError(res.message || "Registration failed. Please try again.");
      }
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fc = (name: keyof TextFields) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-[#1D1D1D] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
      touched[name] && fieldErrors[name]
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-gray-300 focus:border-[#006B4D] focus:ring-[#006B4D]/10"
    }`;

  const FieldErr = ({ name }: { name: keyof TextFields }) =>
    touched[name] && fieldErrors[name]
      ? <p className="mt-1 text-xs text-red-500">{fieldErrors[name]}</p>
      : null;

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[28px] font-bold text-[#1D1D1D] leading-tight mb-2">Create your account</h1>
        <p className="text-sm text-[#1D1D1D80]">Join Talli and get drinks delivered to your door.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">First name</label>
            <input type="text" name="first_name" value={form.first_name} onChange={handleChange} onBlur={handleBlur} placeholder="First name" autoComplete="given-name" className={fc("first_name")} />
            <FieldErr name="first_name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">Last name</label>
            <input type="text" name="last_name" value={form.last_name} onChange={handleChange} onBlur={handleBlur} placeholder="Last name" autoComplete="family-name" className={fc("last_name")} />
            <FieldErr name="last_name" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">Email address</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" autoComplete="email" className={fc("email")} />
          <FieldErr name="email" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">Mobile number</label>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm text-[#1D1D1D] select-none">
              <span>🇮🇳</span>
              <span className="text-gray-500">+91</span>
            </div>
            <input type="tel" name="mobile_number" value={form.mobile_number} onChange={handleChange} onBlur={handleBlur} placeholder="98765 43210" autoComplete="tel" className={`flex-1 ${fc("mobile_number")}`} />
          </div>
          <FieldErr name="mobile_number" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">Password</label>
          <div className="relative">
            <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} placeholder="Min. 8 characters" autoComplete="new-password" className={`${fc("password")} pr-12`} />
            <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeIcon visible={showPass} />
            </button>
          </div>
          <FieldErr name="password" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">Confirm password</label>
          <div className="relative">
            <input type={showConfirm ? "text" : "password"} name="confirm" value={form.confirm} onChange={handleChange} onBlur={handleBlur} placeholder="Re-enter your password" autoComplete="new-password" className={`${fc("confirm")} pr-12`} />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeIcon visible={showConfirm} />
            </button>
          </div>
          <FieldErr name="confirm" />
        </div>

        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-0.5 flex-shrink-0">
              <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} className="sr-only peer" />
              <div className="w-[18px] h-[18px] rounded border-2 border-gray-300 peer-checked:bg-[#006B4D] peer-checked:border-[#006B4D] transition-colors flex items-center justify-center">
                {form.terms && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-[#1D1D1D80] leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-[#006B4D] hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#006B4D] hover:underline">Privacy Policy</Link>
            </span>
          </label>
          {termsError && <p className="mt-1 text-xs text-red-500">{termsError}</p>}
        </div>

        {apiError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" strokeLinecap="round"/>
            </svg>
            <p className="text-xs text-red-600">{apiError}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#006B4D] hover:bg-[#005a3f] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-[#1D1D1D80] mt-8">
        Already have an account?{" "}
        <Link href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-[#006B4D] font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
