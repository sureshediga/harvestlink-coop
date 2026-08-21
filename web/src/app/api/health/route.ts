import { NextResponse } from "next/server";
import { isPayPalConfigured } from "@/lib/paypal";
import { isStripeConfigured } from "@/lib/stripe";
import { emailStatus } from "@/lib/email";
import { isStorageUnreachable, readBlobJson } from "@/lib/blob-store";
import { getSupabase, isProductionHosting } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Lightweight production diagnostics for membership signup.
 * Does not expose secrets — only configuration/connectivity status.
 */
/**
 * Reports the role claim of the configured Supabase key WITHOUT revealing the
 * key itself. A correct server key should be "service_role" (bypasses RLS);
 * "anon" means an insert will fail once RLS is enabled.
 */
function supabaseKeyRole(key: string | undefined): string | null {
  const trimmed = key?.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    if (trimmed.startsWith("sb_secret_")) return "secret-key";
    if (trimmed.startsWith("sb_publishable_")) return "publishable-key";
    return "unrecognized";
  }
  try {
    const payload = JSON.parse(
      Buffer.from(
        parts[1].replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString("utf8")
    );
    return typeof payload.role === "string" ? payload.role : "unknown";
  } catch {
    return "unknown";
  }
}

export async function GET() {
  const hasUrl = Boolean(process.env.SUPABASE_URL?.trim());
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const keyRole = supabaseKeyRole(process.env.SUPABASE_SERVICE_ROLE_KEY);
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
    supabaseKeyRole: keyRole,
    // Base URL baked into certificate/ID QR codes. Should be the public site
    // URL; if this is localhost, set NEXT_PUBLIC_SITE_URL in the environment.
    siteUrl: getSiteUrl(),
    paypalConfigured: isPayPalConfigured(),
    stripeConfigured: isStripeConfigured(),
    ...emailStatus(),
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
