import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { INVESTOR, MEMBERSHIP } from "./constants";
import type { MemberInfo } from "./schemas";
import { getSupabase, isProductionHosting, requireSupabase } from "./supabase";

export type ApplicationKind = "membership" | "investment";

export type PendingApplication = MemberInfo & {
  id: string;
  referenceNumber: string;
  kind: ApplicationKind;
  investmentUnits: number;
  membershipAmount: number;
  investmentAmount: number;
  totalAmount: number;
  memberNumber?: string;
  status: "pending_payment" | "confirmed";
  createdAt: string;
  confirmedAt: string | null;
};

const DATA_DIR = path.join(process.cwd(), "data");
const APPLICATIONS_FILE = path.join(DATA_DIR, "applications.json");

async function readLocalApplications(): Promise<PendingApplication[]> {
  try {
    const raw = await fs.readFile(APPLICATIONS_FILE, "utf-8");
    return JSON.parse(raw) as PendingApplication[];
  } catch {
    return [];
  }
}

async function writeLocalApplications(
  applications: PendingApplication[]
): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(APPLICATIONS_FILE, JSON.stringify(applications, null, 2));
}

async function listAllApplications(): Promise<PendingApplication[]> {
  const supabase = isProductionHosting() ? requireSupabase() : getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(mapFromDb);
  }

  return readLocalApplications();
}

async function generateReferenceNumber(kind: ApplicationKind): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = kind === "membership" ? "HL-APP" : "HL-INV";
  const applications = await listAllApplications();
  const count = applications.filter((a) => a.kind === kind).length + 1;
  return `${prefix}-${year}-${String(count).padStart(4, "0")}`;
}

export async function createApplication(
  input: MemberInfo & {
    kind: ApplicationKind;
    investmentUnits?: number;
    memberNumber?: string;
  }
): Promise<PendingApplication> {
  const referenceNumber = await generateReferenceNumber(input.kind);
  const investmentUnits =
    input.kind === "investment" ? Math.max(input.investmentUnits ?? 1, 1) : 0;
  const membershipAmount =
    input.kind === "membership" ? MEMBERSHIP.joiningFee * 100 : 0;
  const investmentAmount = investmentUnits * INVESTOR.unitAmount * 100;

  const application: PendingApplication = {
    id: randomUUID(),
    referenceNumber,
    kind: input.kind,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    street: input.street,
    city: input.city,
    state: input.state,
    zip: input.zip,
    investmentUnits,
    membershipAmount,
    investmentAmount,
    totalAmount: membershipAmount + investmentAmount,
    memberNumber: input.memberNumber,
    status: "pending_payment",
    createdAt: new Date().toISOString(),
    confirmedAt: null,
  };

  const supabase = isProductionHosting() ? requireSupabase() : getSupabase();

  if (supabase) {
    const { error } = await supabase.from("applications").insert(mapToDb(application));

    if (error) {
      throw new Error(error.message);
    }

    return application;
  }

  if (isProductionHosting()) {
    throw new Error("Database storage is unavailable.");
  }

  const applications = await readLocalApplications();
  applications.push(application);
  await writeLocalApplications(applications);
  return application;
}

export async function getApplicationByReference(
  referenceNumber: string
): Promise<PendingApplication | null> {
  const supabase = isProductionHosting() ? requireSupabase() : getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("reference_number", referenceNumber)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? mapFromDb(data) : null;
  }

  const applications = await readLocalApplications();
  return (
    applications.find((app) => app.referenceNumber === referenceNumber) ?? null
  );
}

export async function listApplications(
  filters?: { kind?: ApplicationKind; status?: PendingApplication["status"] }
): Promise<PendingApplication[]> {
  const supabase = isProductionHosting() ? requireSupabase() : getSupabase();

  if (supabase) {
    let query = supabase.from("applications").select("*").order("created_at", {
      ascending: false,
    });

    if (filters?.kind) {
      query = query.eq("kind", filters.kind);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(mapFromDb);
  }

  let filtered = await readLocalApplications();

  if (filters?.kind) {
    filtered = filtered.filter((app) => app.kind === filters.kind);
  }
  if (filters?.status) {
    filtered = filtered.filter((app) => app.status === filters.status);
  }

  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function confirmApplication(
  referenceNumber: string
): Promise<PendingApplication> {
  const existing = await getApplicationByReference(referenceNumber);

  if (!existing) {
    throw new Error("Application not found");
  }

  if (existing.status === "confirmed") {
    return existing;
  }

  const confirmed: PendingApplication = {
    ...existing,
    status: "confirmed",
    confirmedAt: new Date().toISOString(),
  };

  const supabase = isProductionHosting() ? requireSupabase() : getSupabase();

  if (supabase) {
    const { error } = await supabase
      .from("applications")
      .update({
        status: confirmed.status,
        confirmed_at: confirmed.confirmedAt,
      })
      .eq("reference_number", referenceNumber);

    if (error) {
      throw new Error(error.message);
    }

    return confirmed;
  }

  const applications = await readLocalApplications();
  const index = applications.findIndex(
    (app) => app.referenceNumber === referenceNumber
  );
  applications[index] = confirmed;
  await writeLocalApplications(applications);
  return confirmed;
}

function mapToDb(application: PendingApplication) {
  return {
    id: application.id,
    reference_number: application.referenceNumber,
    kind: application.kind,
    full_name: application.fullName,
    email: application.email,
    phone: application.phone,
    street: application.street,
    city: application.city,
    state: application.state,
    zip: application.zip,
    investment_units: application.investmentUnits,
    membership_amount: application.membershipAmount,
    investment_amount: application.investmentAmount,
    total_amount: application.totalAmount,
    member_number: application.memberNumber ?? null,
    status: application.status,
    created_at: application.createdAt,
    confirmed_at: application.confirmedAt,
  };
}

function mapFromDb(row: Record<string, unknown>): PendingApplication {
  return {
    id: String(row.id),
    referenceNumber: String(row.reference_number),
    kind: row.kind as ApplicationKind,
    fullName: String(row.full_name),
    email: String(row.email),
    phone: String(row.phone),
    street: String(row.street),
    city: String(row.city),
    state: String(row.state),
    zip: String(row.zip),
    investmentUnits: Number(row.investment_units),
    membershipAmount: Number(row.membership_amount),
    investmentAmount: Number(row.investment_amount),
    totalAmount: Number(row.total_amount),
    memberNumber: row.member_number ? String(row.member_number) : undefined,
    status: row.status as PendingApplication["status"],
    createdAt: String(row.created_at),
    confirmedAt: row.confirmed_at ? String(row.confirmed_at) : null,
  };
}

export function applicationsToCsv(
  applications: PendingApplication[]
): string {
  const headers = [
    "reference_number",
    "kind",
    "status",
    "full_name",
    "email",
    "phone",
    "street",
    "city",
    "state",
    "zip",
    "membership_amount",
    "investment_units",
    "investment_amount",
    "total_amount",
    "member_number",
    "created_at",
    "confirmed_at",
  ];

  const rows = applications.map((app) =>
    [
      app.referenceNumber,
      app.kind,
      app.status,
      app.fullName,
      app.email,
      app.phone,
      app.street,
      app.city,
      app.state,
      app.zip,
      (app.membershipAmount / 100).toFixed(2),
      app.investmentUnits,
      (app.investmentAmount / 100).toFixed(2),
      (app.totalAmount / 100).toFixed(2),
      app.memberNumber ?? "",
      app.createdAt,
      app.confirmedAt ?? "",
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
