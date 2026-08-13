-- Harden existing tables with Row Level Security.
-- These tables contain member PII (names, emails, phones, addresses). Enabling
-- RLS with NO policies denies the public anon/authenticated keys all access.
-- The app connects with the Supabase service_role key, which bypasses RLS, so
-- membership/investment signups and admin reads continue to work unchanged.
--
-- Safe to run multiple times; enabling RLS on an already-enabled table is a no-op.
alter table members enable row level security;
alter table applications enable row level security;
