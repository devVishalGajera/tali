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
  payment_type?: string;
  special_instruction?: string;
  permit_number?: string;
  build_version?: string;
  device_type?: string;
  time?: string;
  placed_date?: string;
  voucher_id?: string;
  voucher_amount?: string;
}

export async function createOrderApi(params: CreateOrderParams): Promise<ApiResult<Record<string, unknown>>> {
  const form = new FormData();
  form.append("address_id", String(params.address_id));
  form.append("payment_type", params.payment_type ?? "Cash");
  form.append("special_instruction", params.special_instruction ?? "");
  form.append("voucher_id", params.voucher_id ?? "");
  form.append("voucher_amount", params.voucher_amount ?? "0.0");
  form.append("permit_number", params.permit_number ?? "");
  form.append("payment_id", "");
  form.append("build_version", params.build_version ?? "");
  form.append("device_type", params.device_type ?? "3");
  form.append("time", params.time ?? "");
  form.append("placed_date", params.placed_date ?? "");

  const res = await fetch(`${API_BASE_URL}/order/create`, {
    method: "POST",
    headers: authHeaders(params.token),
    body: form,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`createOrder ${res.status}`);
  return res.json() as Promise<ApiResult<Record<string, unknown>>>;
}

export type OrderStatusKind =
  | "rejected"
  | "cancelled"
  | "delivered"
  | "in_transit"
  | "processing"
  | "placed"
  | "unknown";

export interface OrderListItem {
  id: number;
  order_number?: string;
  status?: string;
  statusCode?: string;
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
  statusCode?: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  permitCharge?: number;
  voucherAmount?: number;
  placedAt: string;
  paymentType?: string;
  address?: string;
  storeName?: string;
  storeAddress?: string;
  rejectReason?: string;
  isRejected: boolean;
  isCancelled: boolean;
  isDelivered: boolean;
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
  orderId?: number;
  orderNumber?: string;
  orderStatus: string;
  statusCode?: string;
  deliveryTime?: string;
  placedDate?: string;
  scheduledTime?: string;
  scheduledAt?: string;
  driverName?: string;
  driverMobile?: string;
  driverImage?: string;
  isRejected: boolean;
  isCancelled: boolean;
  isDelivered: boolean;
  currentStep: number;
  steps: OrderTrackStep[];
  /** @deprecated use orderStatus */
  status?: string;
}

const TRACK_STEPS: Omit<OrderTrackStep, "active" | "completed" | "timestamp">[] = [
  { key: "placed", label: "Order Placed", subtitle: "" },
  { key: "confirmed", label: "Confirmed", subtitle: "" },
  { key: "packed", label: "Packed", subtitle: "" },
  { key: "delivery", label: "In Transit", subtitle: "" },
  { key: "delivered", label: "Delivered", subtitle: "" },
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
    const statusCodeRaw = pickString(r, "status");
    const statusCode = /^\d+$/.test(statusCodeRaw) ? statusCodeRaw : undefined;
    out.push({
      id,
      order_number: pickString(r, "order_number", "order_no") || undefined,
      status: pickString(r, "order_status") || statusCodeRaw || undefined,
      statusCode,
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

function formatDeliveryAddress(addr: Record<string, unknown>): string {
  const house = pickString(addr, "house_no");
  const line = pickString(addr, "address");
  const landmark = pickString(addr, "landmark");
  const saveAs = pickString(addr, "save_as");
  const parts: string[] = [];
  if (house) parts.push(house);
  if (line) parts.push(line);
  if (landmark) parts.push(landmark);
  let formatted = parts.join(", ");
  if (saveAs) formatted = formatted ? `${formatted} (${saveAs})` : saveAs;
  return formatted;
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
  if (!root) return null;

  const d = asRecord(root.order) ?? asRecord(root.OrderDetail) ?? root;
  if (!d) return null;

  const id = extractOrderId(d) ?? Number(orderId);
  const itemCandidates = [
    root.items,
    d.items,
    d.order_items,
    d.products,
    d.product_list,
  ];
  let items: OrderLineItem[] = [];
  for (const raw of itemCandidates) {
    const parsed = parseOrderItems(raw);
    if (parsed.length > 0) {
      items = parsed;
      break;
    }
  }

  const addrRecord = asRecord(root.address);
  let addressStr = addrRecord ? formatDeliveryAddress(addrRecord) : "";
  if (!addressStr) {
    addressStr = pickString(d, "address", "delivery_address", "full_address", "store_address");
  }

  const orderStatus = pickString(d, "order_status");
  const statusCode = pickString(d, "status");
  const status = orderStatus || statusCode || "Placed";
  const textFlags = terminalFlagsFromText(status);
  const codeMeta = /^\d+$/.test(statusCode) ? statusCodeToMeta(statusCode) : null;
  const isRejected = textFlags.isRejected || (codeMeta?.isRejected ?? false);
  const isCancelled = textFlags.isCancelled || (codeMeta?.isCancelled ?? false);
  const isDelivered = textFlags.isDelivered || (codeMeta?.isDelivered ?? false);

  const subtotal = parseMoney(d.order_subtotal as string | number);
  const shipping = parseMoney(d.shipping_charge as string | number);
  const permitCharge = parseMoney(d.permit_charge as string | number);
  const voucherAmount = parseMoney(d.voucher_amount as string | number);
  const total = parseMoney(d.order_total as string | number) || pickNumber(d, "order_total", "total", "grand_total");

  return {
    id,
    orderNumber: pickString(d, "order_number", "order_no") || `TL${id}`,
    status,
    statusCode: statusCode || undefined,
    total,
    subtotal: subtotal > 0 ? subtotal : undefined,
    shipping: shipping > 0 ? shipping : undefined,
    permitCharge: permitCharge > 0 ? permitCharge : undefined,
    voucherAmount: voucherAmount > 0 ? voucherAmount : undefined,
    placedAt: pickString(d, "placed_date", "created_at", "order_date") || "—",
    paymentType: pickString(d, "payment_type") || "Cash",
    address: addressStr || undefined,
    storeName: pickString(d, "store_name") || undefined,
    storeAddress: pickString(d, "store_address") || undefined,
    rejectReason: pickString(d, "reject_reason") || undefined,
    isRejected,
    isCancelled,
    isDelivered,
    items,
    permitNumber: pickString(d, "permit_number") || undefined,
    specialInstruction: pickString(d, "special_instruction") || undefined,
  };
}

function statusTextToStepIndex(status: string): number {
  const s = status.toLowerCase();
  if (/\bdelivered\b/.test(s)) return 4;
  if (s.includes("out for") || s.includes("in transit") || s.includes("dispatch") || s.includes("on the way")) {
    return 3;
  }
  if (s.includes("pack")) return 2;
  if (s.includes("confirm")) return 1;
  if (s.includes("process")) return 2;
  return 0;
}

function statusCodeToMeta(code: string): {
  step: number;
  isRejected: boolean;
  isCancelled: boolean;
  isDelivered: boolean;
} {
  const n = parseInt(code, 10);
  if (Number.isNaN(n)) {
    return { step: 0, isRejected: false, isCancelled: false, isDelivered: false };
  }
  switch (n) {
    case 1:
      return { step: 0, isRejected: false, isCancelled: false, isDelivered: false };
    case 2:
      return { step: 1, isRejected: false, isCancelled: false, isDelivered: false };
    case 3:
      return { step: 2, isRejected: false, isCancelled: false, isDelivered: false };
    case 4:
      return { step: 3, isRejected: false, isCancelled: false, isDelivered: false };
    case 5:
      return { step: 4, isRejected: false, isCancelled: false, isDelivered: true };
    case 6:
      return { step: 0, isRejected: true, isCancelled: false, isDelivered: false };
    default:
      return { step: 0, isRejected: false, isCancelled: false, isDelivered: false };
  }
}

function terminalFlagsFromText(status: string): {
  isRejected: boolean;
  isCancelled: boolean;
  isDelivered: boolean;
} {
  const s = status.toLowerCase();
  return {
    isRejected: s.includes("reject"),
    isCancelled: s.includes("cancel"),
    isDelivered: /\bdelivered\b/.test(s),
  };
}

export function classifyOrderStatus(status?: string, statusCode?: string): OrderStatusKind {
  const label = (status ?? "").trim();
  const code = (statusCode ?? "").trim();
  const textFlags = terminalFlagsFromText(label);
  const codeMeta = /^\d+$/.test(code) ? statusCodeToMeta(code) : null;

  if (textFlags.isRejected || codeMeta?.isRejected) return "rejected";
  if (textFlags.isCancelled || codeMeta?.isCancelled) return "cancelled";
  if (textFlags.isDelivered || codeMeta?.isDelivered) return "delivered";

  const s = label.toLowerCase();
  if (s.includes("out for") || s.includes("dispatch") || s.includes("on the way")) return "in_transit";
  if (codeMeta?.step === 3) return "in_transit";

  if (s.includes("process") || s.includes("pack") || s.includes("confirm")) return "processing";
  if (codeMeta?.step === 1) return "processing";

  if (s.includes("placed") || s.includes("pending") || s.includes("received")) return "placed";
  if (codeMeta?.step === 0) return "placed";

  if (!label && !code) return "unknown";
  return "placed";
}

export function getOrderStatusBadgeClass(status?: string, statusCode?: string): string {
  switch (classifyOrderStatus(status, statusCode)) {
    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-700 border border-red-100";
    case "delivered":
      return "bg-[#E8F5EF] text-[#006B4D] border border-[#CFEBDD]";
    case "in_transit":
      return "bg-[#FFF4E8] text-[#B45309] border border-[#FDE8C8]";
    case "processing":
      return "bg-[#FFF4E8] text-[#B45309] border border-[#FDE8C8]";
    case "placed":
      return "bg-[#F5F5F5] text-[#1D1D1D] border border-[#E8E8E8]";
    default:
      return "bg-[#F5F5F5] text-[#1D1D1D80] border border-[#E8E8E8]";
  }
}

export function resolveOrderIdFromInput(input: string): string {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(\d+)$/);
  return match ? match[1] : trimmed;
}

export function formatScheduledDelivery(placedDate: string, time: string): string {
  if (!placedDate) return "";
  const timeShort = time ? time.slice(0, 5) : "";
  if (placedDate.includes("-") && timeShort) {
    const formatted = formatOrderDate(`${placedDate}T${timeShort}`);
    if (formatted && formatted !== `${placedDate}T${timeShort}`) return formatted;
  }
  if (timeShort) return `${placedDate} at ${timeShort}`;
  return formatOrderDate(placedDate) || placedDate;
}

export function parseOrderTracking(data: unknown): OrderTracking {
  const root = asRecord(data);
  const d = asRecord(root?.tracking) ?? asRecord(root?.OrderTrack) ?? root;

  const orderStatus = d
    ? pickString(d, "order_status", "status_label", "current_status") ||
      pickString(d, "status", "order_status_code")
    : "";
  const statusCode = d ? pickString(d, "status") : "";
  const orderNumber = d ? pickString(d, "order_number", "order_no") : "";
  const deliveryTime = d ? pickString(d, "delivery_time") : "";
  const placedDate = d ? pickString(d, "placed_date", "created_at") : "";
  const scheduledTime = d ? pickString(d, "time") : "";
  const scheduledAt = d ? formatScheduledDelivery(placedDate, scheduledTime) : "";

  const textFlags = terminalFlagsFromText(orderStatus);
  const codeMeta = /^\d+$/.test(statusCode) ? statusCodeToMeta(statusCode) : null;

  let isRejected = textFlags.isRejected || (codeMeta?.isRejected ?? false);
  let isCancelled = textFlags.isCancelled || (codeMeta?.isCancelled ?? false);
  let isDelivered = textFlags.isDelivered || (codeMeta?.isDelivered ?? false);

  let stepIndex = 0;
  if (!isRejected && !isCancelled) {
    if (codeMeta) {
      stepIndex = codeMeta.step;
    } else if (orderStatus) {
      stepIndex = statusTextToStepIndex(orderStatus);
    }

    const stepRaw = d?.current_step ?? d?.step ?? d?.status_id;
    if (typeof stepRaw === "number" && stepRaw >= 0 && stepRaw <= 4 && !isRejected && !isCancelled) {
      stepIndex = stepRaw;
    }
  }

  const firstName = d ? pickString(d, "first_name") : "";
  const lastName = d ? pickString(d, "last_name") : "";
  const driverName = [firstName, lastName].filter(Boolean).join(" ") || undefined;
  const driverMobile = d ? pickString(d, "mobile_number") : undefined;
  const driverImage = d
    ? pickString(d, "profile_image_full_path", "profile_image_path")
    : undefined;

  const placedTime = scheduledAt || placedDate || undefined;

  const expectedDelivery =
    deliveryTime && !isDelivered ? `Expected by ${deliveryTime}` : "";

  const steps: OrderTrackStep[] = TRACK_STEPS.map((step, i) => ({
    ...step,
    completed: !isRejected && !isCancelled && i < stepIndex,
    active: !isRejected && !isCancelled && i === stepIndex,
    timestamp:
      i === 0 && placedTime
        ? placedTime
        : i === TRACK_STEPS.length - 1 && !isDelivered && expectedDelivery
          ? expectedDelivery
          : undefined,
  }));

  const orderId = d ? extractOrderId(d) : null;

  return {
    orderId: orderId ?? undefined,
    orderNumber: orderNumber || undefined,
    orderStatus: orderStatus || statusCode || "Unknown",
    statusCode: statusCode || undefined,
    deliveryTime: deliveryTime || undefined,
    placedDate: placedDate || undefined,
    scheduledTime: scheduledTime || undefined,
    scheduledAt: scheduledAt || undefined,
    driverName,
    driverMobile: driverMobile || undefined,
    driverImage: driverImage || undefined,
    isRejected,
    isCancelled,
    isDelivered,
    currentStep: stepIndex,
    steps,
    status: orderStatus || statusCode || undefined,
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

export async function getOrderIdApi(params: {
  token: string;
  voucher_id?: string;
  permit_number?: string;
}): Promise<ApiResult<{ id: number | null }>> {
  const form = new FormData();
  form.append("voucher_id", params.voucher_id ?? "");
  form.append("permit_number", params.permit_number ?? "");

  const res = await fetch(`${API_BASE_URL}/order/get-order-id`, {
    method: "POST",
    headers: authHeaders(params.token),
    body: form,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`getOrderId ${res.status}`);
  const json = (await res.json()) as ApiResult<unknown>;
  const id = extractOrderId(json.data);
  return {
    ...json,
    data: { id },
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
  const detail = parseOrderDetail(json.data ?? json, params.id);
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

export async function giveOrderRatingApi(params: {
  token: string;
  id: number | string;
  shop_review: string;
  shop_rating: number;
  delivery_boy_review: string;
  delivery_boy_rating: number;
}): Promise<ApiResult<unknown>> {
  const form = new FormData();
  form.append("id", String(params.id));
  form.append("shop_review", params.shop_review);
  form.append("shop_rating", String(params.shop_rating));
  form.append("delivery_boy_review", params.delivery_boy_review);
  form.append("delivery_boy_rating", String(params.delivery_boy_rating));

  const res = await fetch(`${API_BASE_URL}/order/give-rating`, {
    method: "POST",
    headers: authHeaders(params.token),
    body: form,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`giveRating ${res.status}`);
  return res.json() as Promise<ApiResult<unknown>>;
}

export function formatOrderDate(value: string): string {
  if (!value || value === "—") return value;

  const dmy = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = Number(dmy[3]);
    const d = new Date(year, month - 1, day);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

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
