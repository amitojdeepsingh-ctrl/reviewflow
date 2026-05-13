import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil" as any,
});

export const PRICE_ID = process.env.STRIPE_PRICE_ID || "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";