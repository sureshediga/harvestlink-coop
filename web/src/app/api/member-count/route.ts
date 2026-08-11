import { NextResponse } from "next/server";
import { listMembers } from "@/lib/members";

// Count reflects confirmed member records; never statically cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const members = await listMembers();
    return NextResponse.json({ count: members.length });
  } catch (error) {
    console.error("Member count error:", error);
    return NextResponse.json(
      { error: "Unable to load member count" },
      { status: 500 }
    );
  }
}
