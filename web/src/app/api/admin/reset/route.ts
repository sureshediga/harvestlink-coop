import { NextResponse } from "next/server";
import {
  getAdminByEmail,
  normalizeEmail,
  updateAdminPassword,
} from "@/lib/admins";
import {
  setupKeyMatches,
  verifyPasswordResetToken,
} from "@/lib/admin-reset";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body.password ?? "");
    const setupKey = String(body.setupKey ?? "");
    const token = String(body.token ?? "");

    let email: string | null = null;

    if (token) {
      email = verifyPasswordResetToken(token);
      if (!email) {
        return NextResponse.json(
          { error: "This reset link is invalid or has expired." },
          { status: 400 }
        );
      }
    } else if (setupKeyMatches(setupKey)) {
      email = normalizeEmail(String(body.email ?? ""));
      const admin = email.includes("@") ? await getAdminByEmail(email) : null;
      if (!admin) {
        return NextResponse.json(
          { error: "No admin account found for that email." },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Provide a valid reset link or setup key." },
        { status: 401 }
      );
    }

    const updated = await updateAdminPassword(email, password);
    if (!updated) {
      return NextResponse.json(
        { error: "No admin account found for that email." },
        { status: 404 }
      );
    }

    const res = NextResponse.json({ email });
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken(email),
      sessionCookieOptions()
    );
    return res;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to reset password",
      },
      { status: 400 }
    );
  }
}
