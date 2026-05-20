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
