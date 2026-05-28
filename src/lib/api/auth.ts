/**
 * Auth API
 *  POST /user/login
 *  GET  /user/get/profile
 *  POST /user/register
 *  POST /auth/logout
 *
 * Login and register use multipart/form-data.
 */

import { API_BASE_URL } from "./base-url";

/* ── Types ──────────────────────────────────────────────────── */

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  country_code: string;
  mobile_number: string;
  email: string;
  dob?: string;
  gender?: string;
  profile_image_full_path?: string;
  type?: string;
  status?: string;
  total_orders?: number;
  user_address?: {
    id: number;
    address: string;
    city: string | null;
    latitude: string;
    longitude: string;
    store_id: number;
    is_default: string;
  };
}

export interface AuthResponse {
  code:    number;
  message: string;
  token?:  string;
  data?:   AuthUser;
}

export interface ProfileResponse {
  code:    number;
  message: string;
  data?:   AuthUser;
}

export interface UpdateProfileParams {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  dob?: string;
  gender?: string;
  profile?: File;
}

export interface ChangePasswordResponse {
  code: number;
  message: string;
}

/* ── Fetchers ────────────────────────────────────────────────── */

export async function loginApi(params: {
  email:    string;
  password: string;
}): Promise<AuthResponse> {
  const form = new FormData();
  form.append("email", params.email);
  form.append("password", params.password);
  form.append("device_type", "3");

  const res = await fetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    body:   form,
    cache:  "no-store",
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  return res.json() as Promise<AuthResponse>;
}

export async function signupApi(params: {
  first_name:    string;
  last_name:     string;
  mobile_number: string;
  country_code?: string;
  email:         string;
  password:      string;
}): Promise<AuthResponse> {
  const form = new FormData();
  form.append("first_name", params.first_name);
  form.append("last_name", params.last_name);
  form.append("country code", params.country_code ?? "+91");
  form.append("mobile_number", params.mobile_number);
  form.append("email", params.email);
  form.append("password", params.password);
  form.append("device_type", "3");

  const res = await fetch(`${API_BASE_URL}/user/register`, {
    method: "POST",
    body:   form,
    cache:  "no-store",
  });
  if (!res.ok) throw new Error(`Signup failed: ${res.status}`);
  return res.json() as Promise<AuthResponse>;
}

export async function getProfileApi(token: string): Promise<ProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/user/get/profile`, {
    method:  "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
  return res.json() as Promise<ProfileResponse>;
}

export async function updateProfileApi(params: UpdateProfileParams): Promise<ProfileResponse> {
  const form = new FormData();
  form.append("first_name", params.first_name);
  form.append("last_name", params.last_name);
  form.append("email", params.email);
  form.append("country_code", params.country_code);
  form.append("mobile_number", params.mobile_number);
  form.append("dob", params.dob ?? "");
  form.append("gender", params.gender ?? "");
  if (params.profile) form.append("profile", params.profile);

  const res = await fetch(`${API_BASE_URL}/user/profile/setup`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.token}`,
      Accept: "application/json",
    },
    body: form,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Profile update failed: ${res.status}`);
  return res.json() as Promise<ProfileResponse>;
}

export async function changePasswordApi(params: {
  token: string;
  old_password: string;
  password: string;
}): Promise<ChangePasswordResponse> {
  const form = new FormData();
  form.append("old_password", params.old_password);
  form.append("password", params.password);

  const res = await fetch(`${API_BASE_URL}/user/change/password`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.token}`,
      Accept: "application/json",
    },
    body: form,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Change password failed: ${res.status}`);
  return res.json() as Promise<ChangePasswordResponse>;
}

export interface ForgotPasswordResponse {
  code:    number;
  message: string;
  data?:   unknown;
}

export interface ResetPasswordResponse {
  code:    number;
  message: string;
  data?:   unknown;
}

/**
 * Pulls the user id out of a forgot-password response. The backend has been
 * observed to return it under different keys, so try the common ones.
 */
export function extractUserIdFromForgotResponse(res: ForgotPasswordResponse): number | null {
  const candidates: unknown[] = [];
  const root = res as unknown as Record<string, unknown>;
  candidates.push(root.id, root.user_id);
  if (root.data && typeof root.data === "object") {
    const data = root.data as Record<string, unknown>;
    candidates.push(data.id, data.user_id);
    if (data.user && typeof data.user === "object") {
      candidates.push((data.user as Record<string, unknown>).id);
    }
  }
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c) && c > 0) return c;
    if (typeof c === "string") {
      const n = Number.parseInt(c, 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  return null;
}

export async function forgotPasswordApi(params: {
  email: string;
}): Promise<ForgotPasswordResponse> {
  const form = new FormData();
  form.append("email", params.email);

  const res = await fetch(`${API_BASE_URL}/user/forgotpassword`, {
    method: "POST",
    body:   form,
    cache:  "no-store",
  });
  if (!res.ok) throw new Error(`Forgot password failed: ${res.status}`);
  return res.json() as Promise<ForgotPasswordResponse>;
}

export async function resetPasswordApi(params: {
  id:       number;
  otp:      string;
  password: string;
}): Promise<ResetPasswordResponse> {
  const form = new FormData();
  form.append("id", String(params.id));
  form.append("otp", params.otp);
  form.append("password", params.password);

  const res = await fetch(`${API_BASE_URL}/user/resetpassword`, {
    method: "POST",
    body:   form,
    cache:  "no-store",
  });
  if (!res.ok) throw new Error(`Reset password failed: ${res.status}`);
  return res.json() as Promise<ResetPasswordResponse>;
}

export async function logoutApi(token: string): Promise<void> {
  const form = new FormData();
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method:  "POST",
    headers: { Authorization: `Bearer ${token}` },
    body:    form,
    cache:   "no-store",
  }).catch(() => { /* ignore network errors on logout */ });
}

/** Derive a display name from the user object */
export function getDisplayName(user: AuthUser): string {
  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.email;
}
