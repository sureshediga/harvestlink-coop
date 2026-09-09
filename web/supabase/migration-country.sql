-- Optional: allow storing country on applications (Join/Invest addresses
-- may be outside the US). Members already keep country on address jsonb.
-- Safe to re-run.
alter table applications add column if not exists country text not null default '';
