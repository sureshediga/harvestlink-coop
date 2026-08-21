import QRCode from "qrcode";
import type { ApplicationKind, PendingApplication } from "./applications";
import {
  applicationMemberId,
  applicationStandingLabel,
  applicationTypeLabel,
} from "./applications";
import type { MemberRecord } from "./members-types";
import { getSiteUrl } from "./site-url";
import { createVerificationCode } from "./verify";

export type CredentialSource = {
  email: string;
  name: string;
  kind: ApplicationKind;
  referenceNumber: string;
  createdAt: string;
  isActive: boolean;
};

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

export function credentialSourceFromApplication(
  app: PendingApplication
): CredentialSource {
  return {
    email: app.email,
    name: app.acknowledgements?.enrollmentDisclosure.signedName ?? app.fullName,
    kind: app.kind,
    referenceNumber: app.referenceNumber,
    createdAt: app.createdAt,
    isActive: app.status === "confirmed",
  };
}

export function credentialSourceFromMember(
  member: MemberRecord,
  kind: ApplicationKind
): CredentialSource {
  return {
    email: member.email,
    name:
      member.acknowledgements?.enrollmentDisclosure.signedName ??
      member.fullName,
    kind,
    referenceNumber: member.memberNumber,
    createdAt: member.createdAt,
    isActive: true,
  };
}

export async function buildCredentialViewFromSource(
  source: CredentialSource
): Promise<CredentialView> {
  const issueDate = new Date(source.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const memberSince = new Date(source.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  const memberId = applicationMemberId(source.referenceNumber, source.kind);
  const type = applicationTypeLabel(source.kind);
  const standingLabel = applicationStandingLabel(
    source.referenceNumber,
    source.kind
  );
  const statusLabel = source.isActive
    ? source.kind === "investment"
      ? "Active investor"
      : "Active member"
    : "Pending payment";

  const code = createVerificationCode({
    r: source.referenceNumber,
    n: source.name,
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
    name: source.name,
    memberId,
    issueDate,
    memberSince,
    type,
    standingLabel,
    statusLabel,
    isActive: source.isActive,
    verifyUrl,
    qrDataUrl,
  };
}

/**
 * Builds the shared view-model for the certificate + member ID card, including
 * a signed verification code encoded as a QR that points at /verify.
 */
export async function buildCredentialView(
  app: PendingApplication
): Promise<CredentialView> {
  return buildCredentialViewFromSource(credentialSourceFromApplication(app));
}
