import { NextResponse } from "next/server";
import { isStorageUnreachable, readBlobJson } from "@/lib/blob-store";
import { getSupabase, isProductionHosting } from "@/lib/supabase";

/**
 * Lightweight production diagnostics for membership signup.
 * Does not expose secrets — only configuration/connectivity status.
 */
export async function GET() {
  const hasUrl = Boolean(process.env.SUPABASE_URL?.trim());
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const production = isProductionHosting();
  const supabase = getSupabase();

  let supabaseReachable = false;
  let supabaseError: string | null = null;

  if (supabase) {
    try {
      const select = await supabase
        .from("applications")
        .select("id")
        .limit(1);

      if (select.error) {
        supabaseError = select.error.message;
        // Reachable means DNS/network worked; schema/auth errors still count as reachable.
        supabaseReachable = !isStorageUnreachable(select.error);
      } else {
        supabaseReachable = true;
      }
    } catch (error) {
      supabaseError = error instanceof Error ? error.message : String(error);
      supabaseReachable = false;
    }
  }

  let blobsAvailable = false;
  let blobsError: string | null = null;

  if (production) {
    try {
      await readBlobJson("applications", []);
      blobsAvailable = true;
    } catch (error) {
      blobsError = error instanceof Error ? error.message : String(error);
    }
  }

  const ok = supabaseReachable || blobsAvailable;

  return NextResponse.json({
    ok,
    production,
    supabaseConfigured: Boolean(supabase),
    hasUrl,
    hasServiceKey,
    supabaseReachable,
    supabaseError,
    blobsAvailable,
    blobsError,
    storage: supabaseReachable
      ? "supabase"
      : blobsAvailable
        ? "netlify-blobs"
        : "unavailable",
  });
}
