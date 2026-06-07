import { NextResponse } from "next/server";
import { getMemberBySessionId } from "@/lib/members";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const member = await getMemberBySessionId(sessionId);

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({
    memberNumber: member.memberNumber,
    fullName: member.fullName,
    email: member.email,
    membershipAmount: member.membershipAmount,
    investmentUnits: member.investmentUnits,
    investmentAmount: member.investmentAmount,
    isFoundingMember: member.isFoundingMember,
    createdAt: member.createdAt,
  });
}
