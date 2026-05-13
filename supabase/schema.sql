-- Create profiles table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  company_name text,
  phone text,
  address text,
  google_connected boolean default false,
  facebook_connected boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create customers table
create table public.customers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create reviews table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  customer_id uuid references public.customers on delete set null,
  platform text not null check (platform in ('google', 'facebook', 'yelp', 'other')),
  rating integer check (rating >= 1 and rating <= 5),
  content text,
  review_url text,
  review_date timestamptz,
  response text,
  responded_at timestamptz,
  created_at timestamptz default now()
);

-- Create review_requests table
create table public.review_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  customer_id uuid references public.customers on delete set null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'responded', 'failed')),
  request_method text check (request_method in ('sms', 'email')),
  message text,
  sent_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.reviews enable row level security;
alter table public.review_requests enable row level security;

-- RLS Policies for profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- RLS Policies for customers
create policy "Users can CRUD own customers" on public.customers
  for all using (auth.uid() = user_id);

-- RLS Policies for reviews
create policy "Users can CRUD own reviews" on public.reviews
  for all using (auth.uid() = user_id);

-- RLS Policies for review_requests
create policy "Users can CRUD own review_requests" on public.review_requests
  for all using (auth.uid() = user_id);

-- Indexes
create index idx_customers_user_id on public.customers(user_id);
create index idx_reviews_user_id on public.reviews(user_id);
create index idx_reviews_platform on public.reviews(platform);
create index idx_review_requests_user_id on public.review_requests(user_id);
create index idx_review_requests_status on public.review_requests(status);
create index idx_integration_tokens_user on public.integration_tokens(user_id);

-- Table for storing OAuth integration tokens
create table public.integration_tokens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  platform text not null check (platform in ('google', 'facebook')),
  access_token text not null,
  refresh_token text,
  token_expires_at timestamptz,
  platform_user_id text,
  platform_page_id text,
  platform_business_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, platform)
);

alter table public.integration_tokens enable row level security;
create policy "Users can access own tokens" on public.integration_tokens
  for all using (auth.uid() = user_id);

-- Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Drop all possible versions of functions
DROP FUNCTION IF EXISTS get_customer(uuid);
DROP FUNCTION IF EXISTS create_review_request();
DROP FUNCTION IF EXISTS create_review_request(uuid);
DROP FUNCTION IF EXISTS create_review_request(uuid, uuid);
DROP FUNCTION IF EXISTS create_review_request(uuid, uuid, text);
DROP FUNCTION IF EXISTS create_review_request(uuid, uuid, text, text);
DROP FUNCTION IF EXISTS create_review_request(uuid, uuid, text, text, text);

-- Recreate functions
CREATE OR REPLACE FUNCTION get_customer(p_customer_id uuid)
RETURNS TABLE (id uuid, user_id uuid, name text, phone text, email text)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT c.id, c.user_id, c.name, c.phone, c.email FROM customers c WHERE c.id = p_customer_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_review_request(
  p_user_id uuid, p_customer_id uuid, p_status text, p_method text, p_message text
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_id uuid;
BEGIN
  INSERT INTO review_requests (user_id, customer_id, status, request_method, message, sent_at)
  VALUES (p_user_id, p_customer_id, p_status, p_method, p_message, now())
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;