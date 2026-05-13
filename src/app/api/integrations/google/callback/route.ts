import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errParam = searchParams.get("error");

  // Build site URL from the request
  const reqUrl = new URL(request.url);
  const siteUrl = `${reqUrl.protocol}//${reqUrl.host}`;
  const redirectUri = `${siteUrl}/api/integrations/google/callback`;

  if (errParam) {
    return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=${errParam}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=missing_params`);
  }

  try {
    // Decode state to get userId
    let userId: string;
    try {
      const decoded = JSON.parse(atob(state));
      userId = decoded.userId;
    } catch {
      return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=invalid_state`);
    }

    // Exchange authorization code for tokens
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=oauth_not_configured`);
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Google token exchange failed:", tokens);
      return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=token_exchange_failed`);
    }

    // Store tokens in database
    const supabase = getAdminClient();
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

    const { error: upsertError } = await supabase.from("integration_tokens").upsert({
      user_id: userId,
      platform: "google",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      token_expires_at: expiresAt,
    }, { onConflict: "user_id,platform" });

    if (upsertError) {
      console.error("Failed to save tokens:", upsertError);
      return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=save_failed`);
    }

    await supabase.from("profiles").update({ google_connected: true }).eq("id", userId);

    return NextResponse.redirect(`${siteUrl}/dashboard/settings?success=google_connected`);
  } catch (err: any) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=internal_error`);
  }
}