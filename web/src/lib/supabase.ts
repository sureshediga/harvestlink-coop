import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function isProductionHosting(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

export function requireSupabase(): SupabaseClient {
  const client = getSupabase();

  if (client) {
    return client;
  }

  if (isProductionHosting()) {
    throw new Error(
      "Database is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Netlify environment variables, then redeploy."
    );
  }

  throw new Error(
    "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local for local testing."
  );
}
