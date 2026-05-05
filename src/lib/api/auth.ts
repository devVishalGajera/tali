/**
 * Auth API
 *  POST https://admin.tallidrinks.com/api/user/login    — login
 *  POST /user/register                                  — register
 *  POST /auth/logout                                    — invalidate token
 *
 * Both login and register use multipart/form-data.
 */

const BASE_URL   = process.env.NEXT_PUBLIC_API_URL ?? "http://3.7.224.122/dev/talli/api";
const ADMIN_URL  = "https://admin.tallidrinks.com/api";

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

/* ── Fetchers ────────────────────────────────────────────────── */

export async function loginApi(params: {
  email:    string;
  password: string;
}): Promise<AuthResponse> {
  const form = new FormData();
  form.append("email", params.email);
  form.append("password", params.password);
  form.append("device_type", "3");

  const res = await fetch(`${ADMIN_URL}/user/login`, {
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

  const res = await fetch(`${BASE_URL}/user/register`, {
    method: "POST",
    body:   form,
    cache:  "no-store",
  });
  if (!res.ok) throw new Error(`Signup failed: ${res.status}`);
  return res.json() as Promise<AuthResponse>;
}

export async function logoutApi(token: string): Promise<void> {
  const form = new FormData();
  await fetch(`${BASE_URL}/auth/logout`, {
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
