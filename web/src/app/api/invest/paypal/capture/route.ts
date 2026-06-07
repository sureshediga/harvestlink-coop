import { NextResponse } from "next/server";
import { INVESTOR, MEMBERSHIP } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";
import { createMember, getMemberByPayPalOrderId } from "@/lib/members";
import { capturePayPalOrder } from "@/lib/paypal";
import {
  deletePendingCheckout,
  getPendingCheckout,
} from "@/lib/pending-checkout";

export async function GET(request: Request) {
  const siteUrl = getSiteUrl();
  const orderId = new URL(request.url).searchParams.get("token");

  if (!orderId) {
    return NextResponse.redirect(`${siteUrl}/invest?cancelled=true`);
  }

  try {
    const existing = await getMemberByPayPalOrderId(orderId);
    if (existing) {
      return NextResponse.redirect(
        `${siteUrl}/invest/welcome?paypal_order_id=${orderId}`
      );
    }

    const { pendingId, captureId } = await capturePayPalOrder(orderId);
    const pending = await getPendingCheckout(pendingId);

    if (!pending || pending.kind !== "investment") {
      throw new Error("Invalid investment checkout");
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

    return NextResponse.redirect(
      `${siteUrl}/invest/welcome?paypal_order_id=${orderId}`
    );
  } catch (error) {
    console.error("PayPal investment capture error:", error);
    return NextResponse.redirect(`${siteUrl}/invest?cancelled=true`);
  }
}
