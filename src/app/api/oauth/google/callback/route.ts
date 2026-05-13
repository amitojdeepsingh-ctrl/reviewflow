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

  const reqUrl = new URL(request.url);
  const siteUrl = `${reqUrl.protocol}//${reqUrl.host}`;

  if (!code || !state) {
    return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=missing_params`);
  }

  try {
    let userId: string;
    try {
      const decoded = JSON.parse(atob(state));
      userId = decoded.userId;
    } catch {
      return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=invalid_state`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${siteUrl}/api/oauth/google/callback`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokens);
      return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=token_failed`);
    }

    const supabase = getAdminClient();
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

    // Save token
    const { error: tokenError } = await supabase.from("integration_tokens").upsert({
      user_id: userId,
      platform: "google",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      token_expires_at: expiresAt,
    }, { onConflict: "user_id,platform" });

    if (tokenError) {
      console.error("Token save error:", tokenError);
      return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=save_token:${tokenError.message}`);
    }

    // Update profile
    const { error: profileError } = await supabase.from("profiles").update({ google_connected: true }).eq("id", userId);

    if (profileError) {
      console.error("Profile update error:", profileError);
      return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=profile:${profileError.message}`);
    }

    return NextResponse.redirect(`${siteUrl}/dashboard/settings?success=google_connected`);
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(`${siteUrl}/dashboard/settings?error=internal`);
  }
}