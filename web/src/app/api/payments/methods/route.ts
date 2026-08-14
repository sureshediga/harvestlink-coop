import { NextResponse } from "next/server";
import { isPayPalConfigured } from "@/lib/paypal";
import { isStripeConfigured } from "@/lib/stripe";

/**
 * Public flags for which online payment providers are configured.
 * Does not expose credentials — only whether Join/Invest can offer them.
 */
export async function GET() {
  return NextResponse.json({
    zelle: true,
    paypal: isPayPalConfigured(),
    stripe: isStripeConfigured(),
  });
}
