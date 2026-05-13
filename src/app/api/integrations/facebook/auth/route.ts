import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const appId = process.env.FACEBOOK_APP_ID;
  if (!appId) {
    return NextResponse.json({ error: "Facebook OAuth not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const reqUrl = new URL(request.url);
  const siteUrl = `${reqUrl.protocol}//${reqUrl.host}`;
  const redirectUri = `${siteUrl}/api/integrations/facebook/callback`;

  const state = btoa(JSON.stringify({ userId }));

  const redirectUriEncoded = encodeURIComponent(redirectUri);
  const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUriEncoded}&state=${state}&response_type=code&scope=pages_show_list,pages_read_engagement,pages_manage_metadata`;

  return NextResponse.redirect(url);
}