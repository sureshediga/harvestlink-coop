import { NextResponse } from "next/server";
import { INVESTOR, MEMBERSHIP } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";
import { createMember, getMemberByPayPalOrderId } from "@/lib/members";
import { capturePayPalOrder } from "@/lib/paypal";
import {
  deletePendingCheckout,
  getPendingCheckout,
} from "@/lib/pending-checkout";

async function processCapture(
  orderId: string,
  welcomePath: "join" | "invest"
) {
  const siteUrl = getSiteUrl();

  const existing = await getMemberByPayPalOrderId(orderId);
  if (existing) {
    return NextResponse.redirect(
      `${siteUrl}/${welcomePath}/welcome?paypal_order_id=${orderId}`
    );
  }

  const { pendingId, captureId } = await capturePayPalOrder(orderId);
  const pending = await getPendingCheckout(pendingId);

  if (!pending) {
    throw new Error("Pending checkout not found");
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

  return NextResponse.redirect(
    `${siteUrl}/${welcomePath}/welcome?paypal_order_id=${orderId}`
  );
}

export async function GET(request: Request) {
  const siteUrl = getSiteUrl();
  const orderId = new URL(request.url).searchParams.get("token");

  if (!orderId) {
    return NextResponse.redirect(`${siteUrl}/join?cancelled=true`);
  }

  try {
    return await processCapture(orderId, "join");
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.redirect(`${siteUrl}/join?cancelled=true`);
  }
}
