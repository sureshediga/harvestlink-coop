-- Admin accounts for the /admin dashboard (per-user login).
-- Run in the Supabase SQL editor. Passwords are stored as scrypt hashes by the app.
create table if not exists admins (
  id uuid primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- Enable Row Level Security. We add NO policies on purpose: this denies the
-- public anon/authenticated keys all access (important — this table holds
-- password hashes). The app connects with the Supabase service_role key, which
-- bypasses RLS, so admin login continues to work.
alter table admins enable row level security;
