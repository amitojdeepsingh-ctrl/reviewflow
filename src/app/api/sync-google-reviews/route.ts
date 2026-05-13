import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export async function POST(request: Request) {
  try {
    const supabase = getAdminClient();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get the user's profile for their place ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("google_place_id")
      .eq("id", userId)
      .single();

    const placeId = profile?.google_place_id;
    if (!placeId) {
      return NextResponse.json({
        error: "No Place ID set. Add your Google Place ID in Settings > Business Profile first.",
      }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_BUSINESS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Google API key not configured" }, { status: 500 });
    }

    // Fetch place details including reviews from Google Places API
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`
    );
    const data = await res.json();

    if (data.status !== "OK" || !data.result) {
      return NextResponse.json({
        error: `Places API error: ${data.status}. Check your Place ID and API key.`,
      }, { status: 400 });
    }

    const businessName = data.result.name || "";
    const reviews = data.result.reviews || [];
    let imported = 0;

    for (const review of reviews) {
      const reviewId = `places_${review.time}`;
      const existing = await supabase
        .from("reviews")
        .select("id")
        .eq("user_id", userId)
        .eq("platform", "google")
        .eq("review_url", reviewId)
        .maybeSingle();

      if (existing.data) continue;

      await supabase.from("reviews").insert({
        user_id: userId,
        platform: "google",
        rating: review.rating || 5,
        content: review.text || "",
        review_url: reviewId,
        review_date: new Date(review.time * 1000).toISOString(),
        responded: false,
      });
      imported++;
    }

    // Save business name
    if (businessName) {
      await supabase.from("profiles").update({ company_name: businessName }).eq("id", userId);
    }

    return NextResponse.json({
      success: true,
      imported,
      business: businessName,
      total: reviews.length,
      message: `Imported ${imported} new reviews from ${businessName || "Google Maps"}`,
    });
  } catch (err: any) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}