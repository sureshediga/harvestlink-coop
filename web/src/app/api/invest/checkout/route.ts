import { NextResponse } from "next/server";
import { INVESTOR } from "@/lib/constants";
import { investmentCheckoutSchema } from "@/lib/schemas";
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
    const parsed = investmentCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid form data" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const siteUrl = getSiteUrl();
    const stripe = getStripe();
    const total = data.investmentUnits * INVESTOR.unitAmount * 100;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: data.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `HarvestLink Cooperative Investment (${data.investmentUnits} units)`,
              description:
                "Patron capital — dividends proportional, voting rights equal",
            },
            unit_amount: INVESTOR.unitAmount * 100,
          },
          quantity: data.investmentUnits,
        },
      ],
      success_url: `${siteUrl}/invest/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/invest?cancelled=true`,
      metadata: {
        kind: "investment",
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        investmentUnits: String(data.investmentUnits),
        memberNumber: data.memberNumber ?? "",
      },
    });

    return NextResponse.json({ url: session.url, totalCents: total });
  } catch (error) {
    console.error("Investment checkout error:", error);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
