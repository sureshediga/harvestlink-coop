import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signed, HttpOnly session cookie for admin auth. Reuses CERT_SIGNING_SECRET
 * (domain-separated) so no extra env var is required.
 */

export const SESSION_COOKIE = "hl_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
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
    createHmac("sha256", getSecret()).update(`session:${body}`).digest()
  ).slice(0, 43);
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

type SessionPayload = { email: string; exp: number };

export function createSessionToken(email: string): string {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = base64url(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sign(body), sig)) return null;
  try {
    const payload = JSON.parse(
      base64urlDecode(body).toString("utf8")
    ) as SessionPayload;
    if (!payload.email || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload.email;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

/** Reads and validates the admin session from cookies (server components + route handlers). */
export async function getAdminEmail(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** True when the request carries a valid admin session OR the legacy admin key. */
export async function isAdminAuthorized(request: Request): Promise<boolean> {
  if (await getAdminEmail()) return true;
  const adminKey = process.env.ADMIN_EXPORT_KEY;
  const authHeader = request.headers.get("authorization");
  return Boolean(adminKey && authHeader === `Bearer ${adminKey}`);
}
