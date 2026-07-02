import { NextResponse } from "next/server";
import { membershipCheckoutSchema, memberInfoFromMembershipCheckout } from "@/lib/schemas";
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
    const parsed = membershipCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid form data" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const member = memberInfoFromMembershipCheckout(data);
    const pending = await createPendingCheckout({
      kind: "membership",
      investmentUnits: 0,
      ...member,
    });

    const { approvalUrl } = await createPayPalOrder({
      pendingId: pending.id,
      kind: "membership",
      investmentUnits: 0,
    });

    return NextResponse.json({ url: approvalUrl });
  } catch (error) {
    console.error("PayPal checkout error:", error);
    return NextResponse.json(
      { error: "Unable to start PayPal checkout" },
      { status: 500 }
    );
  }
}
