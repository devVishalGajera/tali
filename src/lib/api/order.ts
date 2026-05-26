/**
 * Order API
 *  POST /order/create
 *  GET  /order/get
 *  GET  /order/detailNew
 *  GET  /order/track
 */

import { API_BASE_URL } from "./base-url";
import { parseMoney } from "./cart";

export interface ApiResult<T = unknown> {
  code: number;
  message: string;
  data?: T;
  page_no?: number;
  total_pages?: number;
  total_records?: number;
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
  payment_type?: string;
  payment_id?: string;
  voucher_id?: string;
  voucher_amount?: string;
  device_type?: string;
  placed_date?: string;
  time?: string;
  build_version?: string;
}

export async function createOrderApi(params: CreateOrderParams): Promise<ApiResult<Record<string, unknown>>> {
  const form = new FormData();
  form.append("address_id", String(params.address_id));
  form.append("payment_type", params.payment_type ?? "Cash");
  form.append("payment_id", params.payment_id ?? "");
  form.append("special_instruction", params.special_instruction ?? "");
  form.append("permit_number", params.permit_number ?? "");
  form.append("voucher_id", params.voucher_id ?? "");
  form.append("voucher_amount", params.voucher_amount ?? "0.0");
  form.append("device_type", "3");
  form.append("placed_date", params.placed_date ?? "");
  form.append("time", params.time ?? "");
  form.append("build_version", params.build_version ?? "4.2.3(1)");

  const res = await fetch(`${API_BASE_URL}/order/create`, {
    method: "POST",
    headers: authHeaders(params.token),
    body: form,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`createOrder ${res.status}`);
  return res.json() as Promise<ApiResult<Record<string, unknown>>>;
}

export interface OrderListItem {
  id: number;
  order_number?: string;
  status?: string;
  total?: string | number;
  order_total?: string | number;
  placed_date?: string;
  created_at?: string;
  payment_type?: string;
  store_name?: string;
}

export interface PlacedOrderInfo {
  id: number;
  orderNumber: string;
  total: number;
  placedAt: string;
  pointsEarned?: number;
}

export interface OrderLineItem {
  name: string;
  quantity: number;
  price: number;
  volume?: string;
  image?: string;
}

export interface OrderDetail {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  placedAt: string;
  paymentType?: string;
  address?: string;
  items: OrderLineItem[];
  permitNumber?: string;
  specialInstruction?: string;
}

export interface OrderTrackStep {
  key: string;
  label: string;
  subtitle: string;
  active: boolean;
  completed: boolean;
  timestamp?: string;
}

export interface OrderTracking {
  currentStep: number;
  steps: OrderTrackStep[];
  status?: string;
}

const TRACK_STEPS: Omit<OrderTrackStep, "active" | "completed" | "timestamp">[] = [
  { key: "placed", label: "Order Placed", subtitle: "We've received your order" },
  { key: "processing", label: "Processing", subtitle: "We're packing your items" },
  { key: "delivery", label: "Out for Delivery", subtitle: "On the way to you" },
  { key: "delivered", label: "Delivered", subtitle: "Get ready to enjoy!" },
];

function asRecord(v: unknown): Record<string, unknown> | null {
  return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;
}

function pickString(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

function pickNumber(obj: Record<string, unknown>, ...keys: string[]): number {
  for (const k of keys) {
    const n = parseMoney(obj[k] as string | number);
    if (n > 0) return n;
  }
  return 0;
}

export function extractOrderId(data: unknown): number | null {
  const d = asRecord(data);
  if (!d) {
    if (typeof data === "number") return data;
    return null;
  }
  const id = d.order_id ?? d.id ?? d.orderId;
  if (typeof id === "number") return id;
  if (typeof id === "string" && id) {
    const n = parseInt(id, 10);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

export function parsePlacedOrder(data: unknown, fallbackTotal?: number): PlacedOrderInfo | null {
  const d = asRecord(data);
  const id = extractOrderId(data);
  if (id == null) return null;

  const orderNumber = d
    ? pickString(d, "order_number", "order_no", "order_id_display") || `TL${id}`
    : `TL${id}`;
  const total = d ? pickNumber(d, "total", "order_total", "grand_total") : 0;
  const placedAt = d
    ? pickString(d, "placed_date", "created_at", "order_date", "date")
    : new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const points = d?.points ?? d?.talli_points ?? d?.reward_points;
  const pointsEarned = typeof points === "number" ? points : parseInt(String(points ?? ""), 10) || undefined;

  return {
    id,
    orderNumber,
    total: total || fallbackTotal || 0,
    placedAt,
    pointsEarned: pointsEarned && !Number.isNaN(pointsEarned) ? pointsEarned : undefined,
  };
}

export function parseOrderList(data: unknown): OrderListItem[] {
  if (data == null) return [];
  const list = Array.isArray(data)
    ? data
    : (() => {
        const d = asRecord(data);
        if (!d) return [];
        for (const key of ["orders", "order_list", "data", "items"]) {
          const nested = d[key];
          if (Array.isArray(nested)) return nested;
        }
        return [];
      })();

  const out: OrderListItem[] = [];
  for (const item of list) {
    const r = asRecord(item);
    if (!r) continue;
    const id = extractOrderId(r);
    if (id == null) continue;
    out.push({
      id,
      order_number: pickString(r, "order_number", "order_no") || undefined,
      status: pickString(r, "status", "order_status") || undefined,
      total: (r.total ?? r.order_total) as string | number | undefined,
      order_total: r.order_total as string | number | undefined,
      placed_date: pickString(r, "placed_date", "created_at") || undefined,
      created_at: pickString(r, "created_at", "placed_date") || undefined,
      payment_type: pickString(r, "payment_type") || undefined,
      store_name: pickString(r, "store_name") || undefined,
    });
  }
  return out;
}

function parseOrderItems(raw: unknown): OrderLineItem[] {
  if (!Array.isArray(raw)) return [];
  const out: OrderLineItem[] = [];
  for (const item of raw) {
    const r = asRecord(item);
    if (!r) continue;
    const name = pickString(r, "name", "product_name", "title");
    if (!name) continue;
    out.push({
      name,
      quantity: Number(r.quantity) || 1,
      price: parseMoney(r.price as string | number) || parseMoney(r.total as string | number),
      volume: pickString(r, "volume", "size") || undefined,
      image: pickString(r, "image_full_path", "image", "product_image") || undefined,
    });
  }
  return out;
}

export function parseOrderDetail(data: unknown, orderId: number | string): OrderDetail | null {
  const root = asRecord(data);
  const d = asRecord(root?.OrderDetail) ?? asRecord(root?.order) ?? root;
  if (!d) return null;

  const id = extractOrderId(d) ?? Number(orderId);
  const itemCandidates = [
    d.items,
    d.order_items,
    d.products,
    d.product_list,
    root?.items,
  ];
  let items: OrderLineItem[] = [];
  for (const raw of itemCandidates) {
    const parsed = parseOrderItems(raw);
    if (parsed.length > 0) {
      items = parsed;
      break;
    }
  }

  return {
    id,
    orderNumber: pickString(d, "order_number", "order_no") || `TL${id}`,
    status: pickString(d, "status", "order_status") || "Placed",
    total: pickNumber(d, "total", "order_total", "grand_total"),
    subtotal: pickNumber(d, "order_total", "subtotal", "items_total") || undefined,
    shipping: pickNumber(d, "shipping_charge", "shipping") || undefined,
    placedAt: pickString(d, "placed_date", "created_at", "order_date") || "—",
    paymentType: pickString(d, "payment_type") || "Cash",
    address: pickString(d, "address", "delivery_address", "full_address") || undefined,
    items,
    permitNumber: pickString(d, "permit_number") || undefined,
    specialInstruction: pickString(d, "special_instruction") || undefined,
  };
}

function statusToStepIndex(status: string): number {
  const s = status.toLowerCase();
  if (s.includes("deliver")) return 3;
  if (s.includes("out") || s.includes("delivery") || s.includes("dispatch")) return 2;
  if (s.includes("process") || s.includes("pack")) return 1;
  return 0;
}

export function parseOrderTracking(data: unknown): OrderTracking {
  const root = asRecord(data);
  const d = asRecord(root?.tracking) ?? asRecord(root?.OrderTrack) ?? root;

  let stepIndex = 0;
  let placedTime: string | undefined;

  if (d) {
    const status = pickString(d, "status", "order_status", "current_status");
    stepIndex = statusToStepIndex(status);
    placedTime = pickString(d, "placed_date", "created_at", "order_placed_at") || undefined;

    const stepRaw = d.current_step ?? d.step ?? d.status_id;
    if (typeof stepRaw === "number" && stepRaw >= 0 && stepRaw <= 3) {
      stepIndex = stepRaw;
    }
  }

  const steps: OrderTrackStep[] = TRACK_STEPS.map((step, i) => ({
    ...step,
    completed: i < stepIndex,
    active: i === stepIndex,
    timestamp: i === 0 ? placedTime : undefined,
  }));

  return {
    currentStep: stepIndex,
    steps,
    status: d ? pickString(d, "status", "order_status") : undefined,
  };
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
  const json = (await res.json()) as ApiResult<unknown>;
  return {
    ...json,
    data: parseOrderList(json.data),
  };
}

export async function getOrderDetailApi(params: {
  token: string;
  id: number | string;
}): Promise<ApiResult<OrderDetail>> {
  const qs = new URLSearchParams({ id: String(params.id) });

  const res = await fetch(`${API_BASE_URL}/order/detailNew?${qs.toString()}`, {
    headers: authHeaders(params.token),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`getOrderDetail ${res.status}`);
  const json = (await res.json()) as ApiResult<unknown>;
  const detail = parseOrderDetail(json.data, params.id);
  return { ...json, data: detail ?? undefined };
}

export async function trackOrderApi(params: {
  token: string;
  id: number | string;
}): Promise<ApiResult<OrderTracking>> {
  const qs = new URLSearchParams({ id: String(params.id) });

  const res = await fetch(`${API_BASE_URL}/order/track?${qs.toString()}`, {
    headers: authHeaders(params.token),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`trackOrder ${res.status}`);
  const json = (await res.json()) as ApiResult<unknown>;
  return { ...json, data: parseOrderTracking(json.data) };
}

export function formatOrderDate(value: string): string {
  if (!value || value === "—") return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
