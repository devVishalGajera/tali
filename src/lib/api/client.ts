/**
 * Base fetch wrapper.
 *
 * - Reads NEXT_PUBLIC_API_URL for the base URL.
 * - Pass `token` to attach an Authorization header (for logged-in users).
 * - Pass `tags` + `revalidate` to control Next.js server-side caching.
 *   revalidate = 0  → no-store (always fresh, used for personalised data)
 *   revalidate = N  → ISR — revalidate after N seconds
 *   revalidate omitted → force-cache (cached indefinitely until tag is invalidated)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.7.224.122/dev/talli/api";

/** Standard API envelope returned by every endpoint */
export interface ApiEnvelope<T> {
  code:    number;   // 1 = success
  message: string;
  data:    T;
}

export interface FetchOptions extends Omit<RequestInit, "next"> {
  /** Bearer token for authenticated requests — omit for guest calls */
  token?:      string;
  /** Next.js cache tags for on-demand revalidation */
  tags?:       string[];
  /** Revalidation interval in seconds. 0 = no-store */
  revalidate?: number | false;
}

export async function apiFetch<T>(
  path: string,
  { token, tags, revalidate, headers: extraHeaders, ...init }: FetchOptions = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string> ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const nextOptions: { tags?: string[]; revalidate?: number | false } = {};
  if (tags)                    nextOptions.tags       = tags;
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;

  const res = await fetch(url, {
    ...init,
    headers,
    next: Object.keys(nextOptions).length ? nextOptions : undefined,
  });

  if (!res.ok) {
    throw new Error(`API ${res.status} — ${url}: ${await res.text()}`);
  }

  const json = (await res.json()) as ApiEnvelope<T>;

  if (json.code !== 1) {
    throw new Error(`API error — ${json.message}`);
  }

  return json.data;
}
