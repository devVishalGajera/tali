/**
 * Order API
 *  POST /order/create — place order (multipart, payment_type e.g. "C")
 *  GET  /order/get
 *  GET  /order/detailNew
 *  GET  /order/track
 */

import { API_BASE_URL } from "./base-url";

export interface ApiResult<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

export interface CreateOrderParams {
  token: string;
  address_id: number;
  special_instruction?: string;
  permit_number?: string;
  /** Backend uses short codes, e.g. "C" for cash */
  payment_type?: string;
  voucher_id?: string;
  voucher_amount?: string;
  payment_id?: string;
}

export async function createOrderApi(params: CreateOrderParams): Promise<ApiResult<{ id?: number; order_id?: number }>> {
  const form = new FormData();
  form.append("address_id", String(params.address_id));
  form.append("payment_type", params.payment_type ?? "C");
  form.append("special_instruction", params.special_instruction ?? "");
  form.append("voucher_id", params.voucher_id ?? "");
  form.append("voucher_amount", params.voucher_amount ?? "0.0");
  form.append("permit_number", params.permit_number ?? "");
  form.append("payment_id", params.payment_id ?? "");

  const res = await fetch(`${API_BASE_URL}/order/create`, {
    method: "POST",
    headers: authHeaders(params.token),
    body: form,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`createOrder ${res.status}`);
  return res.json() as Promise<ApiResult<{ id?: number; order_id?: number }>>;
}

export interface OrderListItem {
  id: number;
  order_number?: string;
  status?: string;
  total?: string;
  created_at?: string;
  placed_date?: string;
  [key: string]: unknown;
}

export async function getOrdersApi(params: {
  token: string;
  page_no?: number;
}): Promise<ApiResult<OrderListItem[]>> {
  const qs = new URLSearchParams({ page_no: String(params.page_no ?? 1) });

  const res = await fetch(`${API_BASE_URL}/order/get?${qs.toString()}`, {
    headers: authHeaders(params.token),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`getOrders ${res.status}`);
  return res.json() as Promise<ApiResult<OrderListItem[]>>;
}

export async function getOrderDetailApi(params: {
  token: string;
  id: number | string;
}): Promise<ApiResult<Record<string, unknown>>> {
  const qs = new URLSearchParams({ id: String(params.id) });

  const res = await fetch(`${API_BASE_URL}/order/detailNew?${qs.toString()}`, {
    headers: authHeaders(params.token),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`getOrderDetail ${res.status}`);
  return res.json() as Promise<ApiResult<Record<string, unknown>>>;
}

export async function trackOrderApi(params: {
  token: string;
  id: number | string;
}): Promise<ApiResult<Record<string, unknown>>> {
  const qs = new URLSearchParams({ id: String(params.id) });

  const res = await fetch(`${API_BASE_URL}/order/track?${qs.toString()}`, {
    headers: authHeaders(params.token),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`trackOrder ${res.status}`);
  return res.json() as Promise<ApiResult<Record<string, unknown>>>;
}

export function extractOrderId(data: { id?: number; order_id?: number } | undefined): number | null {
  if (!data) return null;
  if (typeof data.order_id === "number") return data.order_id;
  if (typeof data.id === "number") return data.id;
  return null;
}
