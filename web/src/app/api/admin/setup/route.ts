import { NextResponse } from "next/server";
import { countAdmins, createAdmin } from "@/lib/admins";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";

// Whether a first admin still needs to be created.
export async function GET() {
  try {
    return NextResponse.json({ needsSetup: (await countAdmins()) === 0 });
  } catch {
    return NextResponse.json({ needsSetup: false });
  }
}

export async function POST(request: Request) {
  try {
    if ((await countAdmins()) > 0) {
      return NextResponse.json(
        { error: "Setup already completed. Please sign in." },
        { status: 403 }
      );
    }

    const setupKey = process.env.ADMIN_EXPORT_KEY;
    if (!setupKey) {
      return NextResponse.json(
        { error: "Server is missing ADMIN_EXPORT_KEY; cannot run setup." },
        { status: 500 }
      );
    }

    const body = await request.json();
    if (body.setupKey !== setupKey) {
      return NextResponse.json({ error: "Invalid setup key." }, { status: 401 });
    }

    const admin = await createAdmin({
      email: body.email ?? "",
      password: body.password ?? "",
    });

    const res = NextResponse.json({ email: admin.email });
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken(admin.email),
      sessionCookieOptions()
    );
    return res;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Setup failed" },
      { status: 400 }
    );
  }
}
