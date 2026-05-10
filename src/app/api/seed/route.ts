import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST() {
  try {
    // Get first user (for demo purposes)
    const { data: users } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .limit(1);

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "No users found. Please sign up first." },
        { status: 400 }
      );
    }

    const userId = users[0].id;

    // Create test customers
    const customers = [
      { user_id: userId, name: "John Smith", phone: "+1234567890", email: "john@example.com", notes: "Visa application" },
      { user_id: userId, name: "Sarah Johnson", phone: "+1234567891", email: "sarah@example.com", notes: "PR application" },
      { user_id: userId, name: "Mike Williams", phone: "+1234567892", email: "mike@example.com", notes: "Citizenship" },
      { user_id: userId, name: "Emily Brown", phone: "+1234567893", email: "emily@example.com", notes: "Work permit" },
      { user_id: userId, name: "David Lee", phone: "+1234567894", email: "david@example.com", notes: "Student visa" },
    ];

    const { data: insertedCustomers, error: customerError } = await supabaseAdmin
      .from("customers")
      .insert(customers)
      .select();

    if (customerError) {
      return NextResponse.json({ error: customerError.message }, { status: 500 });
    }

    // Create test reviews
    const reviews = [
      { user_id: userId, platform: "google", rating: 5, content: "Excellent service! Very professional.", review_date: new Date().toISOString() },
      { user_id: userId, platform: "google", rating: 4, content: "Good experience overall.", review_date: new Date().toISOString() },
      { user_id: userId, platform: "google", rating: 5, content: "Highly recommended!", review_date: new Date().toISOString() },
      { user_id: userId, platform: "facebook", rating: 5, content: "Amazing team!", review_date: new Date().toISOString() },
      { user_id: userId, platform: "yelp", rating: 3, content: "Decent service, could be faster.", review_date: new Date().toISOString() },
    ];

    await supabaseAdmin.from("reviews").insert(reviews);

    // Create test review requests
    const requests = [
      { user_id: userId, status: "sent", request_method: "sms", sent_at: new Date().toISOString() },
      { user_id: userId, status: "pending", request_method: "email" },
      { user_id: userId, status: "responded", request_method: "sms", responded_at: new Date().toISOString() },
      { user_id: userId, status: "failed", request_method: "sms" },
    ];

    await supabaseAdmin.from("review_requests").insert(requests);

    return NextResponse.json({
      message: "Seed data created successfully!",
      customersCreated: insertedCustomers?.length || 0,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}