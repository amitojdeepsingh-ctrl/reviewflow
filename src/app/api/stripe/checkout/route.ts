import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const PRICE_ID = process.env.STRIPE_PRICE_ID || "";
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      customer_email: email,
      client_reference_id: userId,
      success_url: `${SITE_URL}/dashboard/settings?billing=success`,
      cancel_url: `${SITE_URL}/dashboard/settings?billing=cancelled`,
      metadata: { userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}