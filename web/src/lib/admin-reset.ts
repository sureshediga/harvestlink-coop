import { createHmac, timingSafeEqual } from "crypto";

const RESET_TTL_SECONDS = 60 * 60; // 1 hour
const DEV_FALLBACK_SECRET = "dev-insecure-cert-signing-secret";

function getSecret(): string {
  return process.env.CERT_SIGNING_SECRET?.trim() || DEV_FALLBACK_SECRET;
}

function base64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(value: string): Buffer {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function sign(body: string): string {
  return base64url(
    createHmac("sha256", getSecret()).update(`admin-reset:${body}`).digest()
  ).slice(0, 43);
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

type ResetPayload = { email: string; exp: number };

export function createPasswordResetToken(email: string): string {
  const payload: ResetPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + RESET_TTL_SECONDS,
  };
  const body = base64url(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${body}.${sign(body)}`;
}

export function verifyPasswordResetToken(
  token: string | undefined | null
): string | null {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sign(body), sig)) return null;
  try {
    const payload = JSON.parse(
      base64urlDecode(body).toString("utf8")
    ) as ResetPayload;
    if (!payload.email || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload.email;
  } catch {
    return null;
  }
}

export function setupKeyMatches(provided: string): boolean {
  const expected = process.env.ADMIN_EXPORT_KEY?.trim() ?? "";
  const given = provided.trim();
  if (!expected || !given) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
