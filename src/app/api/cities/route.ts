import { NextResponse } from "next/server";

const CITIES_URL = "https://admin.tallidrinks.com/api/guest/popularcity";

export interface CitiesApiData {
  popularCities: string[];
  states: { title: string; cities: string[] }[];
}

export async function GET() {
  try {
    const res = await fetch(CITIES_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Cities API ${res.status}`);
    const json = await res.json();
    if (json.code !== 1) throw new Error(json.message);
    return NextResponse.json(json.data as CitiesApiData);
  } catch {
    return NextResponse.json({ popularCities: [], states: [] });
  }
}
