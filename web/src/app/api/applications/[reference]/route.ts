import { NextResponse } from "next/server";
import { getApplicationByReference } from "@/lib/applications";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference } = await params;
  const application = await getApplicationByReference(reference);

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json({
    referenceNumber: application.referenceNumber,
    fullName: application.fullName,
    email: application.email,
    totalAmount: application.totalAmount,
    investmentUnits: application.investmentUnits,
    status: application.status,
    createdAt: application.createdAt,
  });
}
