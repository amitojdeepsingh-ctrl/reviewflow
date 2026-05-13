import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(request: Request) {
  try {
    const supabase = getClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const [profileResult, tokensResult] = await Promise.all([
      supabase.from('profiles').select('google_connected, facebook_connected').eq('id', userId).single(),
      supabase.from('integration_tokens').select('platform, platform_business_name').eq('user_id', userId),
    ]);

    const profile = profileResult.data;
    const tokens = tokensResult.data || [];
    const googleToken = tokens.find(t => t.platform === 'google');
    const facebookToken = tokens.find(t => t.platform === 'facebook');

    return NextResponse.json({
      google: profile?.google_connected || false,
      facebook: profile?.facebook_connected || false,
      googleBusinessName: googleToken?.platform_business_name || null,
      facebookPageName: facebookToken?.platform_business_name || null,
      googleAuthUrl: `${SITE_URL}/api/oauth/google/auth?userId=${userId}`,
      facebookAuthUrl: `${SITE_URL}/api/integrations/facebook/auth?userId=${userId}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getClient();
    const { userId, platform, action } = await request.json();

    if (!userId || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (action === 'disconnect') {
      // Delete tokens and update profile
      await Promise.all([
        supabase.from('integration_tokens').delete().eq('user_id', userId).eq('platform', platform),
        supabase.from('profiles').update({ [platform === 'google' ? 'google_connected' : 'facebook_connected']: false }).eq('id', userId),
      ]);
      return NextResponse.json({ success: true, platform, connected: false });
    }

    // For connect, redirect to OAuth
    const authUrl = platform === 'google'
      ? `${SITE_URL}/api/integrations/google/auth`
      : `${SITE_URL}/api/integrations/facebook/auth?userId=${userId}`;

    return NextResponse.json({ success: true, authUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}