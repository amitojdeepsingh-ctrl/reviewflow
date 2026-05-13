import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSMS, formatPhoneNumber } from "@/lib/twilio";
import { sendReviewEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export async function POST(request: Request) {
  try {
    const supabase = getClient();
    const { customerId, method = "sms" } = await request.json();

    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, user_id, name, phone, email')
      .eq('id', customerId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    let sent = false;
    let sendError = null;

    // Get user's place ID, business name, and SMS template
    const { data: profile } = await supabase
      .from('profiles')
      .select('google_place_id, company_name, sms_template')
      .eq('id', customer.user_id)
      .single();

    const placeId = profile?.google_place_id || "YOUR_PLACE_ID";
    const businessName = profile?.company_name || "our business";
    const reviewLink = `https://search.google.com/local/writereview?placeid=${placeId}`;

    // Build message from template or use default
    const defaultTemplate = `Hi {name}! Thanks for choosing {business_name}. We'd love a quick review: {link}. It only takes 10 seconds!`;
    const template = profile?.sms_template || defaultTemplate;
    const message = template
      .replace(/\{name\}/g, customer.name)
      .replace(/\{business_name\}/g, businessName)
      .replace(/\{link\}/g, reviewLink);

    if (method === "sms" && customer.phone) {
      const result = await sendSMS(formatPhoneNumber(customer.phone), message);
      sent = result.success;
      if (!result.success) { sendError = result.error; console.error("SMS failed:", result.error); }
    }

    if (method === "email" && customer.email) {
      const result = await sendReviewEmail(customer.email, customer.name, businessName, reviewLink);
      sent = result.success;
      if (!result.success) { sendError = result.error; console.error("Email failed:", result.error); }
    }

    const status = sent ? 'sent' : (sendError ? 'failed' : 'sent');

    const { error: insertError } = await supabase
      .from('review_requests')
      .insert({
        user_id: customer.user_id,
        customer_id: customer.id,
        status,
        request_method: method,
        message: `Review request sent to ${customer.name}`,
        sent_at: new Date().toISOString()
      });

    if (insertError) {
      return NextResponse.json({ error: "Failed: " + insertError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: sent || (!customer.phone && !customer.email),
      message: sent ? "Sent!" : (!customer.phone && !customer.email ? "No contact info" : "Request recorded"),
      customerName: customer.name 
    });
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}