import { NextResponse } from "next/server";
import { getCommunityCountsSafe } from "@/lib/community-counts";

// Count reflects current member and investor records; never statically cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const counts = await getCommunityCountsSafe();
    if (!counts) {
      return NextResponse.json(
        { error: "Unable to load member count" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      count: counts.members,
      members: counts.members,
      investors: counts.investors,
    });
  } catch (error) {
    console.error("Member count error:", error);
    return NextResponse.json(
      { error: "Unable to load member count" },
      { status: 500 }
    );
  }
}
