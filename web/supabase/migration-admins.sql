-- Admin accounts for the /admin dashboard (per-user login).
-- Run in the Supabase SQL editor. Passwords are stored as scrypt hashes by the app.
create table if not exists admins (
  id uuid primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);
