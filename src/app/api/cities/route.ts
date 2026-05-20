import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/base-url";

export interface CitiesApiData {
  popularCities: string[];
  states: { title: string; cities: string[] }[];
}

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/guest/popularcity`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Cities API ${res.status}`);
    const json = await res.json();
    if (json.code !== 1) throw new Error(json.message);
    return NextResponse.json(json.data as CitiesApiData);
  } catch {
    return NextResponse.json({ popularCities: [], states: [] });
  }
}
