import { API_BASE_URL } from "./base-url";
import { parseMoney } from "./cart";

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

const vouchersInFlight = new Map<string, Promise<{ code: number; message: string; data: VoucherItem[] }>>();

export interface VoucherItem {
  id: number;
  code: string;
  title: string;
  description?: string;
  amount: number;
}

export interface VoucherApplyResult {
  id: number;
  amount: number;
  message: string;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;
}

function pickString(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = obj[key];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

function pickNumber(obj: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const n = parseMoney(obj[key] as string | number | undefined);
    if (n > 0) return n;
  }
  return 0;
}

export async function getVouchersApi(params: {
  token: string;
}): Promise<{ code: number; message: string; data: VoucherItem[] }> {
  const tokenKey = params.token;
  const existing = vouchersInFlight.get(tokenKey);
  if (existing) return existing;

  const request = (async () => {
    const res = await fetch(`${API_BASE_URL}/vouchers/get`, {
      method: "GET",
      headers: authHeaders(params.token),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`getVouchers ${res.status}`);

    const json = (await res.json()) as { code: number; message: string; data?: unknown };
    const rawList = Array.isArray(json.data)
      ? json.data
      : (() => {
          const root = asRecord(json.data);
          if (!root) return [];
          for (const key of ["vouchers", "items", "list", "data"]) {
            const nested = root[key];
            if (Array.isArray(nested)) return nested;
          }
          return [];
        })();

    const parsed: VoucherItem[] = [];
    for (const item of rawList) {
      const r = asRecord(item);
      if (!r) continue;
      const idRaw = r.id ?? r.voucher_id;
      const id =
        typeof idRaw === "number"
          ? idRaw
          : typeof idRaw === "string"
            ? Number.parseInt(idRaw, 10)
            : NaN;
      if (!Number.isFinite(id) || id <= 0) continue;

      const code = pickString(r, "voucher_code", "code", "name") || `VOUCHER-${id}`;
      const title = pickString(r, "title", "name", "voucher_name") || code;
      const description = pickString(r, "description", "short_description") || undefined;
      const amount = pickNumber(r, "amount", "voucher_amount", "discount", "discount_amount");

      parsed.push({
        id,
        code,
        title,
        description,
        amount,
      });
    }

    return {
      code: json.code,
      message: json.message,
      data: parsed,
    };
  })();

  vouchersInFlight.set(tokenKey, request);
  try {
    return await request;
  } finally {
    vouchersInFlight.delete(tokenKey);
  }
}

export async function applyVoucherApi(params: {
  token: string;
  id: number;
}): Promise<{ code: number; message: string; data: VoucherApplyResult }> {
  const form = new FormData();
  form.append("id", String(params.id));

  const res = await fetch(`${API_BASE_URL}/voucher/apply`, {
    method: "POST",
    headers: authHeaders(params.token),
    body: form,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`applyVoucher ${res.status}`);

  const json = (await res.json()) as { code: number; message: string; data?: unknown };
  const root = asRecord(json.data) ?? {};
  const amount = pickNumber(root, "voucher_amount", "amount", "discount", "discount_amount");

  return {
    code: json.code,
    message: json.message,
    data: {
      id: params.id,
      amount,
      message: json.message,
    },
  };
}

