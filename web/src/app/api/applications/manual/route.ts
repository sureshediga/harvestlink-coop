import { NextResponse } from "next/server";
import { createApplication, DuplicateSignupError } from "@/lib/applications";
import { publicApiErrorMessage } from "@/lib/api-errors";
import { membershipCheckoutSchema, memberInfoFromMembershipCheckout } from "@/lib/schemas";
import { sendCredentialEmail } from "@/lib/credential-email";
import { credentialSourceFromApplication } from "@/lib/credential";
import { instructionsViewUrl } from "@/lib/credential-links";
import { signAccessToken } from "@/lib/verify";

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
    const member = memberInfoFromMembershipCheckout(data);
    const application = await createApplication({
      ...member,
      kind: "membership",
      acknowledgements: data.acknowledgements,
    });

    const accessToken = signAccessToken(application.referenceNumber);
    const emailSent = await sendCredentialEmail(
      credentialSourceFromApplication(application),
      instructionsViewUrl("membership", application.referenceNumber)
    );

    return NextResponse.json({
      referenceNumber: application.referenceNumber,
      totalAmount: application.totalAmount,
      accessToken,
      emailSent,
    });
  } catch (error) {
    if (error instanceof DuplicateSignupError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Manual membership application error:", error);
    return NextResponse.json(
      { error: publicApiErrorMessage(error) },
      { status: 500 }
    );
  }
}
