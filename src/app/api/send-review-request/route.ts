import { NextResponse } from "next/server";
import { sendSMS, formatPhoneNumber, defaultReviewRequestMessage } from "@/lib/twilio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { customerId, method = "sms" } = await request.json();

    // Get customer from database
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Build message
    let message = defaultReviewRequestMessage
      .replace("{name}", customer.name.split(" ")[0])
      .replace("{link}", "https://g.page/r/your-business-id");

    // Send based on method
    if (method === "sms" && customer.phone) {
      const formattedPhone = formatPhoneNumber(customer.phone);
      const result = await sendSMS(formattedPhone, message);

      if (!result.success) {
        return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
      }

      // Log the request
      await supabase.from("review_requests").insert({
        user_id: customer.user_id,
        customer_id: customer.id,
        status: "sent",
        request_method: "sms",
        message,
        sent_at: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, method: "sms" });
    }

    if (method === "email" && customer.email) {
      // For email, we'd need to set up Resend or similar
      // For now, return a placeholder
      await supabase.from("review_requests").insert({
        user_id: customer.user_id,
        customer_id: customer.id,
        status: "sent",
        request_method: "email",
        message,
        sent_at: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, method: "email" });
    }

    return NextResponse.json({ error: "No contact method available" }, { status: 400 });
  } catch (error) {
    console.error("Error sending review request:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}