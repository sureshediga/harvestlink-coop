import { createHmac, timingSafeEqual } from "crypto";

/**
 * Server-side signing for anti-fraud credential features:
 *  - Unguessable access tokens that gate the (otherwise enumerable) instructions
 *    pages, derived from the reference so no extra storage is needed.
 *  - Signed verification codes embedded in certificate / ID-card QR codes so a
 *    forged or edited artifact can be detected at /verify.
 *
 * Both use HMAC-SHA256 with CERT_SIGNING_SECRET. The secret must be set in
 * production; a clearly-insecure fallback keeps local dev working.
 */

const DEV_FALLBACK_SECRET = "dev-insecure-cert-signing-secret";
let warnedMissingSecret = false;

function getSecret(): string {
  const secret = process.env.CERT_SIGNING_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production" && !warnedMissingSecret) {
    warnedMissingSecret = true;
    console.warn(
      "CERT_SIGNING_SECRET is not set — using an insecure fallback. Set CERT_SIGNING_SECRET in the environment to secure certificate verification."
    );
  }
  return DEV_FALLBACK_SECRET;
}

function base64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(value: string): Buffer {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64");
}

function hmac(data: string): Buffer {
  return createHmac("sha256", getSecret()).update(data).digest();
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Unguessable token that grants access to an application's instructions page. */
export function signAccessToken(reference: string): string {
  return base64url(hmac(`access:${reference}`)).slice(0, 24);
}

export function verifyAccessToken(
  reference: string,
  token: string | undefined | null
): boolean {
  if (!token) return false;
  return safeEqual(signAccessToken(reference), token);
}

export type VerificationPayload = {
  /** reference number (used to look up live status) */
  r: string;
  /** name on the credential */
  n: string;
  /** member id */
  m: string;
  /** type label (e.g. "Founding Member" / "Investor") */
  t: string;
  /** issue date (display string) */
  d: string;
};

/** Signed, self-contained code embedded in the certificate / ID-card QR. */
export function createVerificationCode(payload: VerificationPayload): string {
  const body = base64url(Buffer.from(JSON.stringify(payload), "utf8"));
  const sig = base64url(hmac(`verify:${body}`)).slice(0, 32);
  return `${body}.${sig}`;
}

/** Returns the payload if the code's signature is valid, otherwise null. */
export function decodeVerificationCode(
  code: string | undefined | null
): VerificationPayload | null {
  if (!code || !code.includes(".")) return null;
  const [body, sig] = code.split(".");
  if (!body || !sig) return null;
  const expected = base64url(hmac(`verify:${body}`)).slice(0, 32);
  if (!safeEqual(expected, sig)) return null;
  try {
    return JSON.parse(base64urlDecode(body).toString("utf8")) as VerificationPayload;
  } catch {
    return null;
  }
}
