import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
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

async function readPending(): Promise<Record<string, PendingCheckout>> {
  try {
    const raw = await fs.readFile(PENDING_FILE, "utf-8");
    return JSON.parse(raw) as Record<string, PendingCheckout>;
  } catch {
    return {};
  }
}

async function writePending(
  records: Record<string, PendingCheckout>
): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PENDING_FILE, JSON.stringify(records, null, 2));
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
