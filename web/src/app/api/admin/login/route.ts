import { NextResponse } from "next/server";
import { touchLastLogin, verifyAdminCredentials } from "@/lib/admins";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "");
    const password = String(body.password ?? "");

    const admin = await verifyAdminCredentials(email, password);
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    await touchLastLogin(admin.email);

    const res = NextResponse.json({ email: admin.email });
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken(admin.email),
      sessionCookieOptions()
    );
    return res;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
