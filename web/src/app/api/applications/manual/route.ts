import { NextResponse } from "next/server";
import { createApplication } from "@/lib/applications";
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
      ...data,
      kind: "membership",
    });

    return NextResponse.json({
      referenceNumber: application.referenceNumber,
      totalAmount: application.totalAmount,
    });
  } catch (error) {
    console.error("Manual membership application error:", error);
    return NextResponse.json(
      { error: "Unable to submit application" },
      { status: 500 }
    );
  }
}
