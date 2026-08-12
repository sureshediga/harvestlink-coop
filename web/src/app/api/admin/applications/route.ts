import { NextResponse } from "next/server";
import {
  applicationsToCsv,
  confirmApplication,
  getApplicationByReference,
  listApplications,
} from "@/lib/applications";
import { createMember } from "@/lib/members";
import { getAdminEmail, isAdminAuthorized } from "@/lib/admin-session";

export async function GET(request: Request) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") as "membership" | "investment" | null;
  const status = searchParams.get("status") as
    | "pending_payment"
    | "confirmed"
    | null;
  const applications = await listApplications({
    kind: kind ?? undefined,
    status: status ?? undefined,
  });

  if (searchParams.get("format") === "json") {
    return NextResponse.json({ applications });
  }

  const csv = applicationsToCsv(applications);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="harvestlinx-applications.csv"`,
    },
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const referenceNumber = body.referenceNumber as string | undefined;

    if (!referenceNumber) {
      return NextResponse.json(
        { error: "referenceNumber is required" },
        { status: 400 }
      );
    }

    const application = await getApplicationByReference(referenceNumber);

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status === "confirmed") {
      return NextResponse.json({
        message: "Application already confirmed",
        referenceNumber: application.referenceNumber,
      });
    }

    const member = await createMember({
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      address: {
        street: application.street,
        city: application.city,
        state: application.state,
        zip: application.zip,
      },
      membershipAmount: application.membershipAmount,
      investmentUnits: application.investmentUnits,
      investmentAmount: application.investmentAmount,
      paymentProvider: "manual",
      stripeSessionId: null,
      stripePaymentIntentId: null,
      paypalOrderId: null,
      isFoundingMember: true,
      membershipPaid: application.kind === "membership",
      acknowledgements: application.acknowledgements ?? null,
    });

    await confirmApplication(referenceNumber);

    const actor = (await getAdminEmail()) ?? "legacy-key";
    console.log(
      `[admin-audit] ${actor} confirmed ${application.referenceNumber} (member ${member.memberNumber})`
    );

    return NextResponse.json({
      message: "Application confirmed and member created",
      referenceNumber: application.referenceNumber,
      memberNumber: member.memberNumber,
    });
  } catch (error) {
    console.error("Confirm application error:", error);
    return NextResponse.json(
      { error: "Unable to confirm application" },
      { status: 500 }
    );
  }
}
