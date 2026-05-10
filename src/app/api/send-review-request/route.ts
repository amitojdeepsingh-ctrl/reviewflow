import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function POST(request: Request) {
  let supabase;
  try {
    supabase = getAdminClient();
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  
  try {
    const { customerId, method = "sms" } = await request.json();

    // Get customer - direct select with admin client should bypass RLS
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (customerError) {
      return NextResponse.json({ error: "DB Error: " + customerError.message }, { status: 500 });
    }

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Create review request record
    const message = "Thanks for being our customer! Would you mind leaving a quick review?";
    
    const { error: insertError } = await supabase.from("review_requests").insert({
      user_id: customer.user_id,
      customer_id: customer.id,
      status: "sent",
      request_method: method,
      message,
      sent_at: new Date().toISOString(),
    });

    if (insertError) {
      return NextResponse.json({ error: "Failed to create request: " + insertError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Review request sent!",
      customerName: customer.name 
    });
  } catch (err: any) {
    console.error("Route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}