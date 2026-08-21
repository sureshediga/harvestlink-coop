-- Harden HarvestLinx tables against public API access.
--
-- Cause of the Supabase email: tables in the public schema are reachable with
-- the project's URL + anon key unless Row Level Security is enabled.
--
-- This script:
--   1. Enables RLS on members, applications, and admins (if the table exists)
--   2. Adds NO policies, so anon/authenticated roles are denied all rows
--   3. Revokes table grants from anon/authenticated as defense in depth
--
-- The Next.js app connects with SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS,
-- so Join, Invest, and /admin continue to work unchanged.
--
-- Safe to run multiple times. Paste into the Supabase SQL editor and click Run.

alter table if exists public.members enable row level security;
alter table if exists public.applications enable row level security;
alter table if exists public.admins enable row level security;

do $$
begin
  if to_regclass('public.members') is not null then
    revoke all on table public.members from anon, authenticated;
  end if;
  if to_regclass('public.applications') is not null then
    revoke all on table public.applications from anon, authenticated;
  end if;
  if to_regclass('public.admins') is not null then
    revoke all on table public.admins from anon, authenticated;
  end if;
end $$;
