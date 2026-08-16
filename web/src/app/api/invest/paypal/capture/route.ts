import { NextResponse } from "next/server";
import { INVESTOR } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";
import { createMember, getMemberByPayPalOrderId } from "@/lib/members";
import { capturePayPalOrder } from "@/lib/paypal";
import {
  deletePendingCheckout,
  getPendingCheckout,
} from "@/lib/pending-checkout";

/**
 * Creates the investment member for a captured PayPal order. Runs only AFTER
 * funds have been captured, so failures here must never redirect the buyer to
 * the "cancelled" page (that would falsely claim no charge occurred).
 */
async function finalizeCapturedOrder(
  orderId: string,
  captureId: string,
  pendingId: string
): Promise<void> {
  const pending = await getPendingCheckout(pendingId);

  if (!pending || pending.kind !== "investment") {
    throw new Error(
      `Invalid investment checkout ${pendingId} for captured order ${orderId}`
    );
  }

  await createMember({
    fullName: pending.fullName,
    email: pending.email,
    phone: pending.phone,
    address: {
      street: pending.street,
      city: pending.city,
      state: pending.state,
      zip: pending.zip,
    },
    membershipAmount: 0,
    investmentUnits: pending.investmentUnits,
    investmentAmount: pending.investmentUnits * INVESTOR.unitAmount * 100,
    paymentProvider: "paypal",
    stripeSessionId: null,
    stripePaymentIntentId: captureId,
    paypalOrderId: orderId,
    isFoundingMember: true,
    membershipPaid: false,
  });

  await deletePendingCheckout(pendingId);
}

export async function GET(request: Request) {
  const siteUrl = getSiteUrl();
  const welcomeUrl = (order: string) =>
    `${siteUrl}/invest/welcome?paypal_order_id=${order}`;
  const cancelledUrl = `${siteUrl}/invest?cancelled=true`;

  const orderId = new URL(request.url).searchParams.get("token");

  if (!orderId) {
    return NextResponse.redirect(cancelledUrl);
  }

  try {
    const existing = await getMemberByPayPalOrderId(orderId);
    if (existing) {
      return NextResponse.redirect(welcomeUrl(orderId));
    }
  } catch (error) {
    console.error("PayPal invest capture: member lookup failed, continuing:", error);
  }

  let captured: { pendingId: string; captureId: string };
  try {
    captured = await capturePayPalOrder(orderId);
  } catch (error) {
    console.error("PayPal investment capture failed (no funds captured):", error);
    return NextResponse.redirect(cancelledUrl);
  }

  // Funds are captured beyond this point — never show the "cancelled" page.
  try {
    await finalizeCapturedOrder(orderId, captured.captureId, captured.pendingId);
  } catch (error) {
    console.error(
      "PayPal investment captured but member finalization failed (needs reconciliation):",
      { orderId, captureId: captured.captureId, pendingId: captured.pendingId, error }
    );
  }

  return NextResponse.redirect(welcomeUrl(orderId));
}
