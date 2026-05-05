import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.7.224.122/dev/talli/api";

export async function POST(request: NextRequest) {
  const body = await request.json() as { lat?: string; long?: string; city?: string };

  const form = new URLSearchParams();
  if (body.lat)  form.append("lat",  body.lat);
  if (body.long) form.append("long", body.long);
  if (body.city) form.append("city", body.city);

  try {
    const res = await fetch(`${BASE_URL}/get-nearest-storeNew`, {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    form.toString(),
      cache:   "no-store",
    });

    if (!res.ok) return NextResponse.json({ storeId: null });

    const json = await res.json();
    const storeId = json.code === 1 ? (json.data?.store_id ?? null) : null;
    return NextResponse.json({ storeId });
  } catch {
    return NextResponse.json({ storeId: null });
  }
}
