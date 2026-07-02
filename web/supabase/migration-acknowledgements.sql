-- Run after migration.sql on existing deployments
alter table applications add column if not exists acknowledgements jsonb;
alter table members add column if not exists acknowledgements jsonb;
