import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Customer = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  user_id: string;
  customer_id: string | null;
  platform: 'google' | 'facebook' | 'yelp' | 'other';
  rating: number;
  content: string | null;
  review_url: string | null;
  review_date: string | null;
  response: string | null;
  responded_at: string | null;
  created_at: string;
};

export type ReviewRequest = {
  id: string;
  user_id: string;
  customer_id: string | null;
  status: 'pending' | 'sent' | 'responded' | 'failed';
  request_method: 'sms' | 'email' | null;
  message: string | null;
  sent_at: string | null;
  responded_at: string | null;
  created_at: string;
};