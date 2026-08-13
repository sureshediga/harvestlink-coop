import { promises as fs } from "fs";
import path from "path";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import {
  isStorageUnreachable,
  readBlobJson,
  writeBlobJson,
} from "./blob-store";
import { getSupabase, isProductionHosting } from "./supabase";

export type AdminRecord = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt: string | null;
};

export type PublicAdmin = {
  id: string;
  email: string;
  createdAt: string;
  lastLoginAt: string | null;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "admins.json");
const BLOB_KEY = "admins";

// --- password hashing (scrypt; no native deps) ---

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${derived.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "base64");
  const expected = Buffer.from(parts[2], "base64");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * True when the Supabase `admins` table doesn't exist yet (migration not run).
 * In that case we transparently use the Netlify Blobs / local fallback so admin
 * login works out of the box without a manual SQL migration.
 */
function isMissingAdminsTable(error: unknown): boolean {
  const err = error as { code?: string; message?: string } | null;
  const code = err?.code ?? "";
  const message = (err?.message ?? String(error ?? "")).toLowerCase();
  return (
    code === "42P01" || // postgres: undefined_table
    code === "PGRST205" || // postgrest: table not found in schema cache
    message.includes("could not find the table") ||
    (message.includes("relation") && message.includes("does not exist")) ||
    (message.includes("admins") && message.includes("does not exist"))
  );
}

function shouldFallback(error: unknown): boolean {
  return isStorageUnreachable(error) || isMissingAdminsTable(error);
}

function toPublic(admin: AdminRecord): PublicAdmin {
  return {
    id: admin.id,
    email: admin.email,
    createdAt: admin.createdAt,
    lastLoginAt: admin.lastLoginAt,
  };
}

// --- storage (Supabase -> Netlify Blobs -> local JSON), mirroring members.ts ---

async function readLocal(): Promise<AdminRecord[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as AdminRecord[];
  } catch {
    return [];
  }
}

async function writeLocal(admins: AdminRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(admins, null, 2));
}

async function readFallback(): Promise<AdminRecord[]> {
  if (isProductionHosting()) return readBlobJson<AdminRecord[]>(BLOB_KEY, []);
  return readLocal();
}

async function writeFallback(admins: AdminRecord[]): Promise<void> {
  if (isProductionHosting()) {
    await writeBlobJson(BLOB_KEY, admins);
    return;
  }
  await writeLocal(admins);
}

function mapFromDb(row: Record<string, unknown>): AdminRecord {
  return {
    id: String(row.id),
    email: String(row.email),
    passwordHash: String(row.password_hash),
    createdAt: String(row.created_at),
    lastLoginAt: row.last_login_at ? String(row.last_login_at) : null,
  };
}

export async function listAdmins(): Promise<AdminRecord[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        if (shouldFallback(error)) return readFallback();
        throw new Error(error.message);
      }
      return (data ?? []).map(mapFromDb);
    } catch (error) {
      if (shouldFallback(error)) return readFallback();
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
  return readFallback();
}

export async function countAdmins(): Promise<number> {
  return (await listAdmins()).length;
}

export async function getAdminByEmail(
  email: string
): Promise<AdminRecord | null> {
  const normalized = normalizeEmail(email);
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("email", normalized)
        .maybeSingle();
      if (error) {
        if (!shouldFallback(error)) throw new Error(error.message);
      } else {
        return data ? mapFromDb(data) : null;
      }
    } catch (error) {
      if (!shouldFallback(error)) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  }
  const admins = await readFallback();
  return admins.find((a) => a.email === normalized) ?? null;
}

export async function createAdmin(input: {
  email: string;
  password: string;
}): Promise<PublicAdmin> {
  const email = normalizeEmail(input.email);
  if (!email.includes("@")) throw new Error("A valid email is required");
  if (input.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const existing = await getAdminByEmail(email);
  if (existing) throw new Error("An admin with that email already exists");

  const record: AdminRecord = {
    id: randomUUID(),
    email,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("admins").insert({
        id: record.id,
        email: record.email,
        password_hash: record.passwordHash,
        created_at: record.createdAt,
        last_login_at: record.lastLoginAt,
      });
      if (!error) return toPublic(record);
      if (!shouldFallback(error)) throw new Error(error.message);
    } catch (error) {
      if (!shouldFallback(error)) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  }

  const admins = await readFallback();
  admins.push(record);
  await writeFallback(admins);
  return toPublic(record);
}

export async function touchLastLogin(email: string): Promise<void> {
  const normalized = normalizeEmail(email);
  const now = new Date().toISOString();
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("admins")
        .update({ last_login_at: now })
        .eq("email", normalized);
      if (!error) return;
      if (!shouldFallback(error)) throw new Error(error.message);
    } catch (error) {
      if (!shouldFallback(error)) return; // best-effort; don't block login
    }
  }
  const admins = await readFallback();
  const idx = admins.findIndex((a) => a.email === normalized);
  if (idx !== -1) {
    admins[idx] = { ...admins[idx], lastLoginAt: now };
    await writeFallback(admins);
  }
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminRecord | null> {
  const admin = await getAdminByEmail(email);
  if (!admin) return null;
  return verifyPassword(password, admin.passwordHash) ? admin : null;
}

export async function listPublicAdmins(): Promise<PublicAdmin[]> {
  return (await listAdmins()).map(toPublic);
}
