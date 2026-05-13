import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Search query required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_BUSINESS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address,rating&key=${apiKey}`
  );
  const data = await res.json();

  if (data.status !== "OK") {
    return NextResponse.json({ results: [] });
  }

  const results = (data.candidates || []).map((c: any) => ({
    placeId: c.place_id,
    name: c.name,
    address: c.formatted_address,
    rating: c.rating,
  }));

  return NextResponse.json({ results });
}