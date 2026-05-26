"use client";

import { useState } from "react";

interface Fields {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  message:   string;
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#1D1D1D] placeholder:text-gray-400 bg-white focus:outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 transition-colors";

const SUPPORT_EMAIL = "support@tallidrinks.com";

const SupportForm = () => {
  const [form, setForm] = useState<Fields>({
    firstName: "",
    lastName:  "",
    email:     "",
    phone:     "",
    message:   "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): Partial<Record<keyof Fields, string>> => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required.";
    if (!form.lastName.trim()) next.lastName = "Last name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (form.phone && !/^[0-9+\-\s()]{6,20}$/.test(form.phone.trim())) {
      next.phone = "Enter a valid phone number.";
    }
    if (!form.message.trim()) next.message = "Please tell us how we can help.";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setSubmitting(true);
    try {
      /* No backend endpoint exists yet — open the user's mail client with
         a prefilled message addressed to the support inbox. */
      const subject = encodeURIComponent(
        `Support request from ${form.firstName} ${form.lastName}`.trim(),
      );
      const body = encodeURIComponent(
        [
          `Name: ${form.firstName} ${form.lastName}`,
          `Email: ${form.email}`,
          form.phone ? `Phone: ${form.phone}` : "",
          "",
          form.message,
        ].filter(Boolean).join("\n"),
      );
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#006B4D]/10 mx-auto mb-4">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#006B4D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#1D1D1D] mb-2">Thanks for reaching out!</h3>
        <p className="text-sm text-[#1D1D1D60] leading-relaxed mb-5">
          We&apos;ve opened your email client so you can send the message to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#006B4D] font-medium hover:underline">
            {SUPPORT_EMAIL}
          </a>
          . Our team usually replies within one business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
          }}
          className="text-sm text-[#006B4D] font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">First name</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
            autoComplete="given-name"
            className={inputClass}
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Last name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
            autoComplete="family-name"
            className={inputClass}
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">
            Phone <span className="text-[#1D1D1D60] font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            autoComplete="tel"
            className={inputClass}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Message</label>
        <textarea
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us how we can help…"
          className={`${inputClass} resize-none`}
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto sm:min-w-[180px] py-3.5 px-6 bg-[#006B4D] hover:bg-[#005a3f] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
      >
        {submitting ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
        {submitting ? "Sending…" : "Submit"}
      </button>
    </form>
  );
};

export default SupportForm;
