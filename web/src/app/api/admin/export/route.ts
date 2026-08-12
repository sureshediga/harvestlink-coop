import { NextResponse } from "next/server";
import { listMembers, membersToCsv } from "@/lib/members";
import { isAdminAuthorized } from "@/lib/admin-session";

export async function GET(request: Request) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await listMembers();
  const csv = membersToCsv(members);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="harvestlinx-members.csv"`,
    },
  });
}
