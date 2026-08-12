import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function GET() {
  const email = await getAdminEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ email });
}
