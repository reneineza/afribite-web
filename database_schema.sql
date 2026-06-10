-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Allow public read of profiles" on public.profiles
  for select using (true);

create policy "Allow users to update own profile" on public.profiles
  for update using (auth.uid() = id);

-- CATEGORIES
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Allow public read of categories" on public.categories
  for select using (true);

create policy "Allow admins to manage categories" on public.categories
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- PRODUCTS
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10,2) not null check (price >= 0),
  comparison_price numeric(10,2) check (comparison_price >= price),
  cost_price numeric(10,2) check (cost_price >= 0),
  sku text unique not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  images text[] not null default '{}',
  ingredients text,
  origin_country text,
  nutrition_info jsonb default '{}'::jsonb,
  rating numeric(3,2) default 0.0,
  reviews_count integer default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Allow public read of active products" on public.products
  for select using (is_active = true or exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

create policy "Allow admins to manage products" on public.products
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- CART ITEMS
create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null default 1 check (quantity > 0),
  saved_for_later boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(profile_id, product_id)
);

alter table public.cart_items enable row level security;

create policy "Allow users to manage their own cart" on public.cart_items
  for all using (auth.uid() = profile_id);

-- ORDERS
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  stripe_payment_intent_id text unique,
  shipping_address jsonb not null,
  billing_address jsonb,
  shipping_rate numeric(10,2) not null default 0.00,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null default 0.00,
  tax numeric(10,2) not null default 0.00,
  total numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Allow users to view their own orders" on public.orders
  for select using (auth.uid() = profile_id or exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

create policy "Allow admins to update orders" on public.orders
  for update using (
    exists (
      select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ORDER ITEMS
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price_at_purchase numeric(10,2) not null check (price_at_purchase >= 0)
);

alter table public.order_items enable row level security;

create policy "Allow users to view their own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and (orders.profile_id = auth.uid() or exists (
        select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
      ))
    )
  );

-- REVIEWS
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, profile_id)
);

alter table public.reviews enable row level security;

create policy "Allow anyone to read reviews" on public.reviews
  for select using (true);

create policy "Allow authenticated users to write reviews" on public.reviews
  for insert with check (auth.uid() = profile_id);

create policy "Allow users to update/delete own reviews" on public.reviews
  for update using (auth.uid() = profile_id);

-- COUPONS
create table public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  active boolean not null default true,
  expires_at timestamp with time zone,
  max_uses integer,
  uses_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.coupons enable row level security;

create policy "Allow public validation of coupons" on public.coupons
  for select using (active = true);

create policy "Allow admins to manage coupons" on public.coupons
  for all using (
    exists (
      select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- SHIPPING ZONES
-- Canada (CA) is always free. International zones (e.g., US) have a configurable flat rate.
create table public.shipping_zones (
  id uuid default gen_random_uuid() primary key,
  zone_name text not null,             -- e.g. 'Canada', 'United States', 'Rest of World'
  country_code char(2) not null,        -- ISO 3166-1 alpha-2, e.g. 'CA', 'US'
  is_free boolean not null default false,
  flat_rate numeric(10,2) not null default 0.00 check (flat_rate >= 0),
  estimated_delivery_days text,         -- e.g. '5-7 business days'
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.shipping_zones enable row level security;

create policy "Allow public read of active shipping zones" on public.shipping_zones
  for select using (active = true);

create policy "Allow admins to manage shipping zones" on public.shipping_zones
  for all using (
    exists (
      select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Seed default shipping zones
insert into public.shipping_zones (zone_name, country_code, is_free, flat_rate, estimated_delivery_days) values
  ('Canada', 'CA', true, 0.00, '3-7 business days'),
  ('United States', 'US', false, 19.99, '7-14 business days'),
  ('Rest of World', 'INT', false, 39.99, '14-21 business days');

-- WISHLISTS
create table public.wishlists (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(profile_id, product_id)
);

alter table public.wishlists enable row level security;

create policy "Allow users to manage their own wishlist" on public.wishlists
  for all using (auth.uid() = profile_id);

-- ADDRESSES
create table public.addresses (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  label text default 'Home',             -- e.g. 'Home', 'Office'
  full_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  province text not null,
  postal_code text not null,
  country char(2) not null default 'CA', -- ISO 3166-1 alpha-2
  is_default boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.addresses enable row level security;

create policy "Allow users to manage their own addresses" on public.addresses
  for all using (auth.uid() = profile_id);

-- Profile Trigger (Creates a profile row when a user signs up)
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

-- Supabase Storage: Product Images
-- Run this in the Supabase Dashboard > Storage > Create Bucket
-- Bucket name: product-images
-- Public: true (anyone can read)
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/avif

-- Storage RLS Policy (add via Dashboard or CLI):
-- Allow public reads:
--   (bucket_id = 'product-images')
-- Allow admin uploads only:
--   (bucket_id = 'product-images' and exists (
--     select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
--   ))
