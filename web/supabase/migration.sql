create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  member_number text not null unique,
  full_name text not null,
  email text not null unique,
  phone text not null,
  address jsonb not null,
  membership_paid boolean not null default true,
  membership_amount integer not null default 10000,
  investment_units integer not null default 0,
  investment_amount integer not null default 0,
  payment_provider text not null default 'stripe',
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  paypal_order_id text unique,
  is_founding_member boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists members_created_at_idx on members (created_at desc);

create table if not exists applications (
  id uuid primary key,
  reference_number text not null unique,
  kind text not null check (kind in ('membership', 'investment')),
  full_name text not null,
  email text not null,
  phone text not null,
  street text not null,
  city text not null,
  state text not null,
  zip text not null,
  investment_units integer not null default 0,
  membership_amount integer not null default 0,
  investment_amount integer not null default 0,
  total_amount integer not null,
  member_number text,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'confirmed')),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists applications_created_at_idx on applications (created_at desc);
create index if not exists applications_status_idx on applications (status);

-- Optional: lock down direct public API access (service role still works)
alter table members enable row level security;
alter table applications enable row level security;

-- Migration for existing tables:
-- alter table members add column if not exists payment_provider text not null default 'stripe';
-- alter table members add column if not exists paypal_order_id text unique;
-- alter table members alter column stripe_session_id drop not null;
