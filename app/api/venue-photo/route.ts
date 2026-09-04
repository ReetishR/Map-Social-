import { NextRequest, NextResponse } from "next/server";

// Proxies Google Place Photos so the API key never reaches client-facing HTML —
// embedding it directly in an <img src> would let anyone view-source it and
// make billed calls against the rest of the API (Places, Distance Matrix, ...)
// under this key.
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!ref || !apiKey) {
    return NextResponse.json({ error: "Photo not available" }, { status: 404 });
  }

  const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${encodeURIComponent(ref)}&key=${apiKey}`;
  const upstream = await fetch(googleUrl);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Photo not available" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
