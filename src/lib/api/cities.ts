/**
 * Cities API — GET https://admin.tallidrinks.com/api/guest/popularcity
 * Cached for 1 hour (data rarely changes).
 * Called from the server-side layout so the data is fetched once per request
 * and passed down as a prop — no client-side fetch needed.
 */

export interface CitiesApiData {
  popularCities: string[];
  states: { title: string; cities: string[] }[];
}

const CITIES_URL = "https://admin.tallidrinks.com/api/guest/popularcity";

export async function getCities(): Promise<CitiesApiData> {
  const res = await fetch(CITIES_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Cities API ${res.status}`);
  const json = await res.json();
  if (json.code !== 1) throw new Error(json.message ?? "Cities API error");
  return json.data as CitiesApiData;
}
