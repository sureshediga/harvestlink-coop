import { NextResponse } from "next/server";
import { investmentCheckoutSchema } from "@/lib/schemas";
import { createPendingCheckout } from "@/lib/pending-checkout";
import { createPayPalOrder, isPayPalConfigured } from "@/lib/paypal";

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { error: "PayPal is not configured yet." },
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
    const pending = await createPendingCheckout({
      kind: "investment",
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      investmentUnits: data.investmentUnits,
      memberNumber: data.memberNumber,
    });

    const { approvalUrl } = await createPayPalOrder({
      pendingId: pending.id,
      kind: "investment",
      investmentUnits: data.investmentUnits,
    });

    return NextResponse.json({ url: approvalUrl });
  } catch (error) {
    console.error("PayPal investment checkout error:", error);
    return NextResponse.json(
      { error: "Unable to start PayPal checkout" },
      { status: 500 }
    );
  }
}
