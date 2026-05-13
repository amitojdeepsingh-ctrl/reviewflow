import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSMS, formatPhoneNumber } from "@/lib/twilio";

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const now = new Date().toISOString();

  // Find customers whose scheduled send time has arrived
  const { data: customers } = await supabase
    .from("customers")
    .select("id, user_id, name, phone, send_after_days, created_at, profiles!inner(company_name, google_place_id, sms_template)")
    .not("send_after_days", "is", null)
    .is("review_request_sent", false);

  if (!customers?.length) {
    return NextResponse.json({ sent: 0, totalCustomers: customers?.length || 0 });
  }

  let sent = 0;

  for (const customer of customers) {
    const profile = Array.isArray(customer.profiles) ? customer.profiles[0] : customer.profiles;
    if (!profile || !customer.phone) continue;

    // Check if enough days have passed
    const createdAt = new Date(customer.created_at);
    const targetDate = new Date(createdAt);
    targetDate.setDate(targetDate.getDate() + (customer.send_after_days || 0));

    if (new Date(now) < targetDate) continue;

    const businessName = profile.company_name || "our business";
    const placeId = profile.google_place_id || "YOUR_PLACE_ID";
    const reviewLink = `https://search.google.com/local/writereview?placeid=${placeId}`;
    const defaultTemplate = `Hi {name}! Thanks for choosing {business_name}. We'd love a quick review: {link}. It only takes 10 seconds!`;
    const template = profile.sms_template || defaultTemplate;
    const message = template
      .replace(/\{name\}/g, customer.name)
      .replace(/\{business_name\}/g, businessName)
      .replace(/\{link\}/g, reviewLink);

    const result = await sendSMS(formatPhoneNumber(customer.phone), message);

    await supabase.from("review_requests").insert({
      user_id: customer.user_id,
      customer_id: customer.id,
      status: result.success ? "sent" : "failed",
      request_method: "sms",
      message: result.success ? `Scheduled review request sent to ${customer.name}` : "Scheduled request failed",
      sent_at: new Date().toISOString(),
    });

    await supabase.from("customers").update({ review_request_sent: true }).eq("id", customer.id);
    if (result.success) sent++;
  }

  return NextResponse.json({ sent });
}