import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/base-url";

export interface NearestStoreResult {
  flag: 1 | 2 | 3;
  storeId: number | null;
  purchaseAllow: boolean;
  cityName: string | null;
  cityId: number | null;
}

const FLAG3: NearestStoreResult = { flag: 3, storeId: null, purchaseAllow: false, cityName: null, cityId: null };

export async function POST(request: NextRequest) {
  const body = await request.json() as { lat?: string; long?: string; city?: string };

  const form = new URLSearchParams();
  if (body.lat)  form.append("lat",  body.lat);
  if (body.long) form.append("long", body.long);
  if (body.city) form.append("city", body.city);

  try {
    console.log(`${API_BASE_URL}/get-nearest-storeNew`);
    const res = await fetch(`${API_BASE_URL}/get-nearest-storeNew`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
    });

    if (!res.ok) return NextResponse.json(FLAG3);

    const json = await res.json();
    if (json.code !== 1) return NextResponse.json(FLAG3);

    const data = json.data ?? {};
    const flag = data.flag as 1 | 2 | 3;

    if (flag === 1) {
      return NextResponse.json<NearestStoreResult>({
        flag: 1,
        storeId: data.store_id ?? null,
        purchaseAllow: data.purchase_allow === "yes",
        cityName: null,
        cityId: null,
      });
    }

    if (flag === 2) {
      return NextResponse.json<NearestStoreResult>({
        flag: 2,
        storeId: null,
        purchaseAllow: false,
        cityName: data.city_name ?? null,
        cityId: data.city_id ?? null,
      });
    }

    return NextResponse.json(FLAG3);
  } catch {
    return NextResponse.json(FLAG3);
  }
}
