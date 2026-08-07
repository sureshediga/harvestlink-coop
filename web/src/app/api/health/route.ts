import { NextResponse } from "next/server";
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

  if (!supabase) {
    return NextResponse.json({
      ok: false,
      production,
      supabaseConfigured: false,
      hasUrl,
      hasServiceKey,
      error: production
        ? "SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY missing in Netlify env"
        : "Supabase not configured (local JSON storage available)",
    });
  }

  const select = await supabase
    .from("applications")
    .select("id, acknowledgements")
    .limit(1);

  if (select.error) {
    return NextResponse.json({
      ok: false,
      production,
      supabaseConfigured: true,
      hasUrl,
      hasServiceKey,
      applicationsReadable: false,
      error: select.error.message,
      code: select.error.code,
      details: select.error.details,
      hint: select.error.hint,
    });
  }

  return NextResponse.json({
    ok: true,
    production,
    supabaseConfigured: true,
    hasUrl,
    hasServiceKey,
    applicationsReadable: true,
    acknowledgementsColumnPresent: true,
  });
}
