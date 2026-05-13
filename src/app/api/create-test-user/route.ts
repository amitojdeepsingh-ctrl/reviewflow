import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export async function POST() {
  const supabase = getAdminClient();
  
  try {
    // Create test user with email confirmation disabled for testing
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: "test@example.com",
      password: "testpassword123",
      email_confirm: true,
      user_metadata: { full_name: "Test Business Owner" }
    });

    if (userError) {
      // If user already exists, just return success
      if (userError.message.includes("already been registered")) {
        return NextResponse.json({ message: "Test user already exists" });
      }
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Create profile
    if (user?.user) {
      await supabase.from("profiles").insert({
        id: user.user.id,
        email: "test@example.com",
        full_name: "Test Business Owner",
        company_name: "Test Immigration Services",
        phone: "+1234567890",
        address: "123 Main St, New York, NY 10001"
      });

      // Create test customers
      const customers = [
        { user_id: user.user.id, name: "John Smith", phone: "+15551234567", email: "john@example.com", notes: "PR application" },
        { user_id: user.user.id, name: "Sarah Johnson", phone: "+15551234568", email: "sarah@example.com", notes: "Visa renewal" },
        { user_id: user.user.id, name: "Mike Williams", phone: "+15551234569", email: "mike@example.com", notes: "Citizenship" },
      ];

      await supabase.from("customers").insert(customers);

      // Create test reviews
      const reviews = [
        { user_id: user.user.id, platform: "google", rating: 5, content: "Excellent service! Very professional and helpful.", review_date: new Date().toISOString() },
        { user_id: user.user.id, platform: "google", rating: 4, content: "Good experience overall. Would recommend.", review_date: new Date().toISOString() },
        { user_id: user.user.id, platform: "facebook", rating: 5, content: "Amazing team! They helped me with my visa process.", review_date: new Date().toISOString() },
      ];

      await supabase.from("reviews").insert(reviews);

      // Create test review requests
      const requests = [
        { user_id: user.user.id, status: "sent", request_method: "sms", sent_at: new Date().toISOString() },
        { user_id: user.user.id, status: "pending", request_method: "email" },
        { user_id: user.user.id, status: "responded", request_method: "sms", responded_at: new Date().toISOString() },
      ];

      await supabase.from("review_requests").insert(requests);
    }

    return NextResponse.json({
      message: "Test user created!",
      email: "test@example.com",
      password: "testpassword123"
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}