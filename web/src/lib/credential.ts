import QRCode from "qrcode";
import type { PendingApplication } from "./applications";
import {
  applicationMemberId,
  applicationStandingLabel,
  applicationTypeLabel,
} from "./applications";
import { getSiteUrl } from "./site-url";
import { createVerificationCode } from "./verify";

export type CredentialView = {
  name: string;
  memberId: string;
  issueDate: string;
  memberSince: string;
  type: string;
  standingLabel: string | null;
  statusLabel: string;
  isActive: boolean;
  verifyUrl: string;
  qrDataUrl: string;
};

/**
 * Builds the shared view-model for the certificate + member ID card, including
 * a signed verification code encoded as a QR that points at /verify.
 */
export async function buildCredentialView(
  app: PendingApplication
): Promise<CredentialView> {
  const name =
    app.acknowledgements?.enrollmentDisclosure.signedName ?? app.fullName;
  const issueDate = new Date(app.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const memberSince = new Date(app.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  const memberId = applicationMemberId(app.referenceNumber, app.kind);
  const type = applicationTypeLabel(app.kind);
  const standingLabel = applicationStandingLabel(app.referenceNumber, app.kind);
  const isActive = app.status === "confirmed";
  const statusLabel = isActive ? "Active member" : "Pending payment";

  const code = createVerificationCode({
    r: app.referenceNumber,
    n: name,
    m: memberId,
    t: type,
    d: issueDate,
  });
  const verifyUrl = `${getSiteUrl()}/verify?c=${encodeURIComponent(code)}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 240,
    color: { dark: "#3d2b1f", light: "#ffffff" },
  });

  return {
    name,
    memberId,
    issueDate,
    memberSince,
    type,
    standingLabel,
    statusLabel,
    isActive,
    verifyUrl,
    qrDataUrl,
  };
}
