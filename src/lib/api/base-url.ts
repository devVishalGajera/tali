/**
 * Single API root for dev and prod.
 * Dev: http://3.7.224.122/dev/talli/api
 * Prod: https://admin.tallidrinks.com/api
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://3.7.224.122/dev/talli/api";
