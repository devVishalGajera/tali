/**
 * User delivery address API
 *  POST /address/createNew
 *  POST /address/updateNew
 *  GET  /addresses/get
 *  POST /address/delete
 *  POST /address/default-address
 */

import { API_BASE_URL } from "./base-url";

export interface AddressApiResponse {
  code: number;
  message: string;
  data?: unknown;
}

export interface SaveAddressParams {
  token: string;
  address: string;
  city: string;
  /** When set, calls updateNew instead of createNew */
  existingId?: number | null;
  house_no?: string;
  landmark?: string;
  save_as?: string;
  latitude?: string;
  longitude?: string;
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

function appendAddressFormFields(
  form: FormData,
  params: {
    address: string;
    city: string;
    house_no?: string;
    landmark?: string;
    save_as?: string;
    latitude?: string;
    longitude?: string;
  },
) {
  form.append("address", params.address);
  form.append("house_no", params.house_no ?? "");
  form.append("landmark", params.landmark ?? "");
  form.append("save_as", params.save_as ?? "");
  form.append("longitude", params.longitude ?? "");
  form.append("latitude", params.latitude ?? "");
  form.append("city", params.city);
}

export async function createAddressApi(params: {
  token: string;
  address: string;
  city: string;
  house_no?: string;
  landmark?: string;
  save_as?: string;
  latitude?: string;
  longitude?: string;
}): Promise<AddressApiResponse> {
  const form = new FormData();
  appendAddressFormFields(form, params);

  const res = await fetch(`${API_BASE_URL}/address/createNew`, {
    method: "POST",
    headers: authHeaders(params.token),
    body: form,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`createAddress ${res.status}`);
  return res.json() as Promise<AddressApiResponse>;
}

export async function updateAddressApi(params: {
  token: string;
  id: number;
  address: string;
  city: string;
  house_no?: string;
  landmark?: string;
  save_as?: string;
  latitude?: string;
  longitude?: string;
}): Promise<AddressApiResponse> {
  const form = new FormData();
  form.append("id", String(params.id));
  appendAddressFormFields(form, params);

  const res = await fetch(`${API_BASE_URL}/address/updateNew`, {
    method: "POST",
    headers: authHeaders(params.token),
    body: form,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`updateAddress ${res.status}`);
  return res.json() as Promise<AddressApiResponse>;
}

/** GET saved addresses for the authenticated user. */
export async function getAddressesApi(params: {
  token: string;
  id?: number;
}): Promise<AddressApiResponse> {
  const qs = params.id != null ? `?id=${params.id}` : "";

  const res = await fetch(`${API_BASE_URL}/addresses/get${qs}`, {
    method: "GET",
    headers: authHeaders(params.token),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`getAddresses ${res.status}`);
  return res.json() as Promise<AddressApiResponse>;
}

export async function deleteAddressApi(params: { token: string; id: number }): Promise<AddressApiResponse> {
  const form = new FormData();
  form.append("id", String(params.id));

  const res = await fetch(`${API_BASE_URL}/address/delete`, {
    method: "POST",
    headers: authHeaders(params.token),
    body: form,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`deleteAddress ${res.status}`);
  return res.json() as Promise<AddressApiResponse>;
}

export async function setDefaultAddressApi(params: { token: string; id: number }): Promise<AddressApiResponse> {
  const form = new FormData();
  form.append("id", String(params.id));

  const res = await fetch(`${API_BASE_URL}/address/default-address`, {
    method: "POST",
    headers: authHeaders(params.token),
    body: form,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`defaultAddress ${res.status}`);
  return res.json() as Promise<AddressApiResponse>;
}

/** Create or update delivery address (used by checkout). */
export async function saveUserAddressApi(params: SaveAddressParams): Promise<AddressApiResponse> {
  const common = {
    token: params.token,
    address: params.address,
    city: params.city,
    house_no: params.house_no,
    landmark: params.landmark,
    save_as: params.save_as ?? "Home",
    latitude: params.latitude,
    longitude: params.longitude,
  };

  if (params.existingId) {
    return updateAddressApi({ ...common, id: params.existingId });
  }
  return createAddressApi(common);
}

export function extractAddressId(data: unknown): number | null {
  if (data == null) return null;
  if (typeof data === "number") return data;
  if (typeof data === "string" && data) {
    const n = parseInt(data, 10);
    return Number.isNaN(n) ? null : n;
  }
  if (typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const fromId = extractAddressId(d.id);
  if (fromId != null) return fromId;
  const fromAid = extractAddressId(d.address_id);
  if (fromAid != null) return fromAid;
  return null;
}
