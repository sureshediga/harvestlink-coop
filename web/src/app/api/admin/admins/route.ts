import { NextResponse } from "next/server";
import { createAdmin, listPublicAdmins } from "@/lib/admins";
import { getAdminEmail } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ admins: await listPublicAdmins() });
}

export async function POST(request: Request) {
  if (!(await getAdminEmail())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const admin = await createAdmin({
      email: body.email ?? "",
      password: body.password ?? "",
    });
    return NextResponse.json({ admin });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add admin" },
      { status: 400 }
    );
  }
}
