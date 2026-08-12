import { NextResponse } from "next/server";
import { getApplicationByReference } from "@/lib/applications";
import { decodeVerificationCode } from "@/lib/verify";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("c");
  const payload = decodeVerificationCode(code);

  if (!payload) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  let status: string | null = null;
  let onRecord = false;
  try {
    const app = await getApplicationByReference(payload.r);
    if (app) {
      onRecord = true;
      status = app.status === "confirmed" ? "active" : "pending_payment";
    } else {
      status = "not_on_record";
    }
  } catch {
    status = null;
  }

  return NextResponse.json({
    valid: true,
    name: payload.n,
    memberId: payload.m,
    type: payload.t,
    issued: payload.d,
    status,
    onRecord,
  });
}
