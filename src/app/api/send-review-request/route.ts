import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    // Use RPC function to get customer (bypasses RLS)
    const { data: customer, error: customerError } = await supabase.rpc('get_customer', { 
      p_customer_id: customerId 
    });

    if (customerError || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const message = "Thanks for being our customer! Would you mind leaving a quick review?";
    
    // Use RPC function to create review request (bypasses RLS)
    const { data: requestId, error: insertError } = await supabase.rpc('create_review_request', {
      p_user_id: customer.user_id,
      p_customer_id: customer.id,
      p_status: 'sent',
      p_method: method,
      p_message: message
    });

    if (insertError) {
      return NextResponse.json({ error: "Failed: " + insertError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Review request sent!",
      customerName: customer.name 
    });
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}