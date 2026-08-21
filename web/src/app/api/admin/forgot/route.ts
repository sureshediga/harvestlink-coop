import { NextResponse } from "next/server";
import { getAdminByEmail, normalizeEmail } from "@/lib/admins";
import { createPasswordResetToken } from "@/lib/admin-reset";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(String(body.email ?? ""));

    // Always succeed so this endpoint cannot be used to probe admin emails.
    if (!email.includes("@") || !isEmailConfigured()) {
      return NextResponse.json({ ok: true });
    }

    const admin = await getAdminByEmail(email);
    if (admin) {
      const token = createPasswordResetToken(admin.email);
      const resetUrl = `${getSiteUrl()}/admin/reset?t=${encodeURIComponent(token)}`;
      await sendEmail({
        to: admin.email,
        subject: "Reset your HarvestLinx admin password",
        text: `Reset your admin password using this link (valid for 1 hour):\n\n${resetUrl}\n`,
        html: `<p>Reset your HarvestLinx admin password using this link (valid for 1 hour):</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>If you did not request this, you can ignore this email.</p>
<p>${SITE.legalName}</p>`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin forgot-password error:", error);
    return NextResponse.json({ ok: true });
  }
}
