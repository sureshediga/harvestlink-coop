import { NextResponse } from "next/server";
import { listMembers, membersToCsv } from "@/lib/members";

export async function GET(request: Request) {
  const adminKey = process.env.ADMIN_EXPORT_KEY;
  const authHeader = request.headers.get("authorization");

  if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await listMembers();
  const csv = membersToCsv(members);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="harvestlink-members.csv"`,
    },
  });
}
