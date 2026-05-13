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
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?error=${error}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?error=missing_params`);
  }

  try {
    let userId: string;
    try {
      const decoded = JSON.parse(atob(state));
      userId = decoded.userId;
    } catch {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?error=invalid_state`);
    }

    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/api/integrations/facebook/callback";

    if (!appId || !appSecret) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?error=oauth_not_configured`);
    }

    // Exchange code for short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`
    );
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Facebook token exchange failed:", tokenData);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?error=token_exchange_failed`);
    }

    // Exchange for long-lived token
    const longLivedRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenData.access_token}`
    );
    const longLived = await longLivedRes.json();
    const accessToken = longLived.access_token || tokenData.access_token;

    // Fetch user's pages
    let pageId = "";
    let pageName = "Facebook Page";
    try {
      const pagesRes = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`
      );
      const pages = await pagesRes.json();
      if (pages.data?.length > 0) {
        pageId = pages.data[0].id;
        pageName = pages.data[0].name;
      }
    } catch (e) {
      console.error("Failed to fetch Facebook pages:", e);
    }

    // Store tokens
    const supabase = getAdminClient();
    const { error: upsertError } = await supabase.from("integration_tokens").upsert({
      user_id: userId,
      platform: "facebook",
      access_token: accessToken,
      token_expires_at: null,
      platform_page_id: pageId,
      platform_business_name: pageName,
    }, { onConflict: "user_id,platform" });

    if (upsertError) {
      console.error("Failed to save Facebook tokens:", upsertError);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?error=save_failed`);
    }

    await supabase.from("profiles").update({ facebook_connected: true }).eq("id", userId);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?success=facebook_connected`);
  } catch (err: any) {
    console.error("Facebook callback error:", err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings?error=internal_error`);
  }
}