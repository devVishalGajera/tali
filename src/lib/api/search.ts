import { API_BASE_URL } from "./base-url";

export interface SearchProduct {
  id: number;
  name: string;
  image_full_path: string;
  price: string;
  volume: string;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function fetchSearchResults(term: string): Promise<SearchProduct[]> {
  const form = new FormData();
  form.append("page_no", "1");
  form.append("term", term);

  const storeId = getCookie("talli_store_id");
  const city = getCookie("talli_city");
  if (storeId) form.append("store_id", storeId);
  if (city) form.append("city", city);

  const res = await fetch(`${API_BASE_URL}/product/viewAllNew`, {
    method: "POST",
    body: form,
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  if (json.code !== 1) return [];
  return (json.data ?? []).slice(0, 8);
}
