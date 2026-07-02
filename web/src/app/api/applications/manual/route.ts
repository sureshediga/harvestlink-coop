import { NextResponse } from "next/server";
import { createApplication } from "@/lib/applications";
import { publicApiErrorMessage } from "@/lib/api-errors";
import { membershipCheckoutSchema } from "@/lib/schemas";

export async function POST(request: Request) {
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
    const application = await createApplication({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      kind: "membership",
      acknowledgements: data.acknowledgements,
    });

    return NextResponse.json({
      referenceNumber: application.referenceNumber,
      totalAmount: application.totalAmount,
    });
  } catch (error) {
    console.error("Manual membership application error:", error);
    return NextResponse.json(
      { error: publicApiErrorMessage(error) },
      { status: 500 }
    );
  }
}
