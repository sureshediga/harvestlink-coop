import {
  CERTIFICATE,
  INVESTOR_CERTIFICATE,
  SITE,
} from "./constants";
import {
  buildCredentialViewFromSource,
  type CredentialSource,
} from "./credential";
import { sendEmail } from "./email";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dataUrlToBase64(dataUrl: string): string {
  const comma = dataUrl.indexOf(",");
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

function credentialEmailHtml(
  source: CredentialSource,
  view: Awaited<ReturnType<typeof buildCredentialViewFromSource>>,
  viewUrl?: string
): string {
  const copy =
    source.kind === "investment" ? INVESTOR_CERTIFICATE : CERTIFICATE;
  const noun = source.kind === "investment" ? "investor" : "member";
  const name = escapeHtml(view.name);
  const standing = view.standingLabel ? escapeHtml(view.standingLabel) : "";
  const download = viewUrl
    ? `<p style="text-align:center;margin:24px 0 8px;">
        <a href="${escapeHtml(viewUrl)}" style="display:inline-block;background:#c47c26;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;">
          View, print, or download
        </a>
      </p>`
    : "";

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Georgia,serif;color:#3d2b1f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf7f2;padding:24px 12px;">
    <tr>
      <td align="center">
        <p style="margin:0 0 16px;font-size:14px;color:#3d2b1f;">
          Thank you for becoming a HarvestLinx ${noun}. Your certificate and ID card are below.
        </p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;border:4px solid #d4a853;background:#faf7f2;">
          <tr>
            <td style="padding:20px 24px;text-align:center;border-bottom:2px solid #e8d7a8;">
              <p style="margin:0;font-size:12px;letter-spacing:0.16em;color:#2d6a4f;font-weight:700;text-transform:uppercase;">${escapeHtml(SITE.legalName)}</p>
              <p style="margin:6px 0 0;font-size:11px;letter-spacing:0.14em;color:#d4a853;font-weight:700;text-transform:uppercase;">${escapeHtml(copy.eyebrow)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;text-align:center;">
              <h1 style="margin:0;font-size:26px;color:#3d2b1f;">${escapeHtml(copy.title)}</h1>
              <p style="margin:16px 0 0;font-size:13px;font-style:italic;color:#6b5a4a;">This certifies that</p>
              <p style="margin:8px 0 0;font-size:28px;color:#2d6a4f;font-weight:700;">${name}</p>
              ${standing ? `<p style="margin:8px 0 0;font-size:16px;color:#c4704a;font-weight:700;">${standing}</p>` : ""}
              <p style="margin:18px 0 0;font-size:14px;color:#3d2b1f;">${escapeHtml(copy.body)}</p>
              <p style="margin:12px 0 0;font-size:14px;font-style:italic;color:#2d6a4f;">${escapeHtml(copy.tagline)}</p>
              <p style="margin:20px 0 0;font-size:13px;"><strong>Reference:</strong> ${escapeHtml(source.referenceNumber)}</p>
              <p style="margin:4px 0 0;font-size:13px;">Issued: ${escapeHtml(view.issueDate)}</p>
              <p style="margin:12px 0 0;font-size:12px;font-weight:700;color:${view.isActive ? "#2d6a4f" : "#7a5a1f"};">${escapeHtml(view.statusLabel)}</p>
              <img src="cid:hl-qr" alt="Verification QR code" width="120" height="120" style="margin-top:16px;display:block;margin-left:auto;margin-right:auto;" />
              <p style="margin:8px 0 0;font-size:11px;color:#8a7a68;">Scan to verify authenticity</p>
              <p style="margin:16px 0 0;font-size:11px;color:#8a7a68;">${escapeHtml(copy.note)}</p>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin-top:24px;border:3px solid #d4a853;background:#faf7f2;">
          <tr>
            <td style="background:#2d6a4f;padding:16px 24px;color:#faf7f2;">
              <p style="margin:0;font-size:16px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(SITE.legalName)}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#d4a853;font-weight:700;letter-spacing:0.12em;">MEMBER ID CARD</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0;font-size:11px;color:#8a7a68;font-weight:700;">NAME</p>
              <p style="margin:4px 0 14px;font-size:20px;font-weight:700;color:#3d2b1f;">${name}</p>
              <p style="margin:0;font-size:11px;color:#8a7a68;font-weight:700;">MEMBER ID</p>
              <p style="margin:4px 0 14px;font-size:16px;font-weight:700;color:#2d6a4f;">${escapeHtml(view.memberId)}</p>
              <p style="margin:0;font-size:11px;color:#8a7a68;font-weight:700;">TYPE</p>
              <p style="margin:4px 0 14px;font-size:16px;font-weight:700;">${escapeHtml(view.type)}</p>
              <p style="margin:0;font-size:11px;color:#8a7a68;font-weight:700;">MEMBER SINCE</p>
              <p style="margin:4px 0 0;font-size:15px;font-weight:700;">${escapeHtml(view.memberSince)}</p>
            </td>
          </tr>
        </table>

        ${download}
        <p style="max-width:520px;margin:16px auto 0;font-size:12px;color:#6b5a4a;text-align:center;">
          Verify this credential at <a href="${escapeHtml(view.verifyUrl)}" style="color:#2d6a4f;">${escapeHtml(SITE.name)}/verify</a>.
          Questions? ${escapeHtml(SITE.contactEmail)}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendCredentialEmail(
  source: CredentialSource,
  viewUrl?: string
): Promise<boolean> {
  try {
    const view = await buildCredentialViewFromSource(source);
    const noun = source.kind === "investment" ? "investor" : "membership";
    const text = [
      `Thank you for becoming a HarvestLinx ${noun === "investor" ? "investor" : "member"}.`,
      "",
      `Name: ${view.name}`,
      `ID: ${view.memberId}`,
      `Type: ${view.type}`,
      `Reference: ${source.referenceNumber}`,
      `Issued: ${view.issueDate}`,
      `Status: ${view.statusLabel}`,
      `Verify: ${view.verifyUrl}`,
      viewUrl ? `View / print / download: ${viewUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return sendEmail({
      to: source.email,
      subject:
        source.kind === "investment"
          ? "Your HarvestLinx investor certificate and ID"
          : "Your HarvestLinx membership certificate and ID",
      html: credentialEmailHtml(source, view, viewUrl),
      text,
      attachments: [
        {
          filename: "harvestlinx-verify-qr.png",
          contentBase64: dataUrlToBase64(view.qrDataUrl),
          contentId: "hl-qr",
          contentType: "image/png",
        },
      ],
    });
  } catch (error) {
    console.error("Credential email failed:", error);
    return false;
  }
}
