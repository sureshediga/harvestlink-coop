import { NextResponse } from "next/server";
import {
  assertMembershipEmailAvailable,
  DuplicateSignupError,
} from "@/lib/applications";
import { MEMBERSHIP } from "@/lib/constants";
import { membershipCheckoutSchema, memberInfoFromMembershipCheckout } from "@/lib/schemas";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Online payment is not configured yet. Please add Stripe keys to .env.local.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = membershipCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid form data" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const member = memberInfoFromMembershipCheckout(data);
    await assertMembershipEmailAvailable(member.email);
    const siteUrl = getSiteUrl();
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: member.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "HarvestLinx Cooperative Membership",
              description: `USD ${MEMBERSHIP.joiningFee} joining fee. Voting rights from USD 1,000+ investment.`,
            },
            unit_amount: MEMBERSHIP.joiningFee * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/join/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/join?cancelled=true`,
      metadata: {
        kind: "membership",
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        street: member.street,
        city: member.city,
        state: member.state,
        zip: member.zip,
        investmentUnits: "0",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof DuplicateSignupError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
