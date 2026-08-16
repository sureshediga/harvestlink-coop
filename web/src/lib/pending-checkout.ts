import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { readBlobJson, writeBlobJson } from "./blob-store";
import { isProductionHosting } from "./supabase";
import type { ApplicationKind } from "./applications";
import type { MemberInfo } from "./schemas";

export type PendingCheckout = MemberInfo & {
  id: string;
  kind: ApplicationKind;
  investmentUnits: number;
  memberNumber?: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const PENDING_FILE = path.join(DATA_DIR, "pending-checkouts.json");
const BLOB_KEY = "pending-checkouts";

type PendingCheckoutMap = Record<string, PendingCheckout>;

async function readLocalPending(): Promise<PendingCheckoutMap> {
  try {
    const raw = await fs.readFile(PENDING_FILE, "utf-8");
    return JSON.parse(raw) as PendingCheckoutMap;
  } catch {
    return {};
  }
}

async function writeLocalPending(records: PendingCheckoutMap): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PENDING_FILE, JSON.stringify(records, null, 2));
}

/**
 * Pending checkouts bridge the PayPal approval redirect (created in one request,
 * captured in another). On Netlify the working directory isn't writable/shared
 * across function invocations, so production uses Netlify Blobs; local dev uses
 * a JSON file. Mirrors the fallback storage used for applications.
 */
async function readPending(): Promise<PendingCheckoutMap> {
  if (isProductionHosting()) {
    return readBlobJson<PendingCheckoutMap>(BLOB_KEY, {});
  }
  return readLocalPending();
}

async function writePending(records: PendingCheckoutMap): Promise<void> {
  if (isProductionHosting()) {
    await writeBlobJson(BLOB_KEY, records);
    return;
  }
  await writeLocalPending(records);
}

export async function createPendingCheckout(
  data: MemberInfo & {
    kind: ApplicationKind;
    investmentUnits: number;
    memberNumber?: string;
  }
): Promise<PendingCheckout> {
  const record: PendingCheckout = {
    id: randomUUID(),
    kind: data.kind,
    investmentUnits: data.investmentUnits,
    memberNumber: data.memberNumber,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    street: data.street,
    city: data.city,
    state: data.state,
    zip: data.zip,
    createdAt: new Date().toISOString(),
  };

  const records = await readPending();
  records[record.id] = record;
  await writePending(records);
  return record;
}

export async function getPendingCheckout(
  id: string
): Promise<PendingCheckout | null> {
  const records = await readPending();
  return records[id] ?? null;
}

export async function deletePendingCheckout(id: string): Promise<void> {
  const records = await readPending();
  delete records[id];
  await writePending(records);
}
