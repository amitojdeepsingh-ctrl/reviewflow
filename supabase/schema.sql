-- Create profiles table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  company_name text,
  phone text,
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

-- Create indexes for performance
create index idx_customers_user_id on public.customers(user_id);
create index idx_reviews_user_id on public.reviews(user_id);
create index idx_reviews_platform on public.reviews(platform);
create index idx_review_requests_user_id on public.review_requests(user_id);
create index idx_review_requests_status on public.review_requests(status);

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