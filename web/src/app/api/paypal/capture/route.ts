import { NextResponse } from "next/server";
import { INVESTOR, MEMBERSHIP } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";
import { createMember, getMemberByPayPalOrderId } from "@/lib/members";
import { capturePayPalOrder } from "@/lib/paypal";
import {
  deletePendingCheckout,
  getPendingCheckout,
} from "@/lib/pending-checkout";

/**
 * Creates the member for a captured PayPal order. Runs only AFTER funds have
 * been captured, so failures here must never redirect the buyer to the
 * "cancelled" page (that would falsely claim no charge occurred).
 */
async function finalizeCapturedOrder(
  orderId: string,
  captureId: string,
  pendingId: string
): Promise<void> {
  const pending = await getPendingCheckout(pendingId);

  if (!pending) {
    throw new Error(
      `Pending checkout ${pendingId} not found for captured order ${orderId}`
    );
  }

  const isMembership = pending.kind === "membership";

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
    membershipAmount: isMembership ? MEMBERSHIP.joiningFee * 100 : 0,
    investmentUnits: isMembership ? 0 : pending.investmentUnits,
    investmentAmount: isMembership
      ? 0
      : pending.investmentUnits * INVESTOR.unitAmount * 100,
    paymentProvider: "paypal",
    stripeSessionId: null,
    stripePaymentIntentId: captureId,
    paypalOrderId: orderId,
    isFoundingMember: true,
    membershipPaid: isMembership,
  });

  await deletePendingCheckout(pendingId);
}

export async function GET(request: Request) {
  const siteUrl = getSiteUrl();
  const welcomeUrl = (order: string) =>
    `${siteUrl}/join/welcome?paypal_order_id=${order}`;
  const cancelledUrl = `${siteUrl}/join?cancelled=true`;

  const orderId = new URL(request.url).searchParams.get("token");

  if (!orderId) {
    return NextResponse.redirect(cancelledUrl);
  }

  // Idempotency: if we already created the member for this order, just show it.
  try {
    const existing = await getMemberByPayPalOrderId(orderId);
    if (existing) {
      return NextResponse.redirect(welcomeUrl(orderId));
    }
  } catch (error) {
    console.error("PayPal capture: member lookup failed, continuing:", error);
  }

  // Capture the funds. capturePayPalOrder also recovers ORDER_ALREADY_CAPTURED
  // (timeout/refresh). Only treat as unpaid when PayPal confirms no capture.
  let captured: { pendingId: string; captureId: string };
  try {
    captured = await capturePayPalOrder(orderId);
  } catch (error) {
    console.error("PayPal capture failed (no funds captured):", error);
    return NextResponse.redirect(cancelledUrl);
  }

  // Funds are captured beyond this point. Never send the buyer to the
  // "cancelled" page — the welcome page shows a "processing" state until the
  // member record is available, and the pending checkout is retained for
  // reconciliation if member creation fails.
  try {
    await finalizeCapturedOrder(orderId, captured.captureId, captured.pendingId);
  } catch (error) {
    console.error(
      "PayPal payment captured but member finalization failed (needs reconciliation):",
      { orderId, captureId: captured.captureId, pendingId: captured.pendingId, error }
    );
  }

  return NextResponse.redirect(welcomeUrl(orderId));
}
