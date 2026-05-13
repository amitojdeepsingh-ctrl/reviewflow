import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const reqUrl = new URL(request.url);
  const siteUrl = `${reqUrl.protocol}//${reqUrl.host}`;
  const redirectUri = `${siteUrl}/api/oauth/google/callback`;
  const state = btoa(JSON.stringify({ userId }));

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent("https://www.googleapis.com/auth/business.manage")}&access_type=offline&prompt=consent&state=${state}`;

  return NextResponse.redirect(url);
}