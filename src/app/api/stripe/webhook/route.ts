import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  // Lazy import stripe to avoid build-time crash
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const session = event.data.object as any;
  const userId = session.metadata?.userId || session.client_reference_id;

  if (!userId) return NextResponse.json({ received: true });

  switch (event.type) {
    case "checkout.session.completed":
      await supabase.from("profiles").update({
        stripe_customer_id: session.customer,
        subscription_status: "active",
        subscription_plan: "pro",
      }).eq("id", userId);
      break;

    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await supabase.from("profiles").update({
        subscription_status: session.status === "active" ? "active" : "inactive",
      }).eq("id", userId);
      break;
  }

  return NextResponse.json({ received: true });
}