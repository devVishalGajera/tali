import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOST = "3.7.224.122";

/**
 * Image proxy — GET /api/img?url=<encoded-source-url>
 *
 * Fetches images from the API server server-side (avoiding mixed-content
 * blocks) and returns them over HTTPS with long-lived cache headers.
 *
 * Only images from the trusted API host are allowed (security guard).
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");

  if (!raw) {
    return new NextResponse("Missing url param", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return new NextResponse("Forbidden host", { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Talli-ImageProxy/1.0)" },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new NextResponse("Upstream error", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const buffer      = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":  contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
