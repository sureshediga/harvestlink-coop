import { NextResponse } from "next/server";
import Stripe from "stripe";
import { INVESTOR, MEMBERSHIP } from "@/lib/constants";
import { createMember, getMemberBySessionId } from "@/lib/members";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const existing = await getMemberBySessionId(session.id);
    if (existing) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const metadata = session.metadata ?? {};
    const kind = metadata.kind === "investment" ? "investment" : "membership";
    const investmentUnits =
      kind === "investment"
        ? parseInt(metadata.investmentUnits ?? "1", 10) || 1
        : 0;
    const membershipAmount =
      kind === "membership" ? MEMBERSHIP.joiningFee * 100 : 0;

    await createMember({
      fullName: metadata.fullName ?? "Unknown",
      email: metadata.email ?? session.customer_email ?? "unknown@example.com",
      phone: metadata.phone ?? "",
      address: {
        street: metadata.street ?? "",
        city: metadata.city ?? "",
        state: metadata.state ?? "",
        zip: metadata.zip ?? "",
      },
      membershipAmount,
      investmentUnits,
      investmentAmount: investmentUnits * INVESTOR.unitAmount * 100,
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      paypalOrderId: null,
      paymentProvider: "stripe",
      isFoundingMember: true,
      membershipPaid: kind === "membership",
    });
  }

  return NextResponse.json({ received: true });
}
