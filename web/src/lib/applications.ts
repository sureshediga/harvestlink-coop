import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import {
  isStorageUnreachable,
  readBlobJson,
  writeBlobJson,
} from "./blob-store";
import { INVESTOR, MEMBERSHIP } from "./constants";
import type { MemberInfo, MembershipAcknowledgements } from "./schemas";
import { getSupabase, isProductionHosting } from "./supabase";

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
  acknowledgements?: MembershipAcknowledgements | null;
};

const DATA_DIR = path.join(process.cwd(), "data");
const APPLICATIONS_FILE = path.join(DATA_DIR, "applications.json");
const BLOB_KEY = "applications";

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

async function readFallbackApplications(): Promise<PendingApplication[]> {
  if (isProductionHosting()) {
    return readBlobJson<PendingApplication[]>(BLOB_KEY, []);
  }
  return readLocalApplications();
}

async function writeFallbackApplications(
  applications: PendingApplication[]
): Promise<void> {
  if (isProductionHosting()) {
    await writeBlobJson(BLOB_KEY, applications);
    return;
  }
  await writeLocalApplications(applications);
}

async function listAllApplications(): Promise<PendingApplication[]> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (isStorageUnreachable(error)) {
          console.error("Supabase unreachable; using fallback storage:", error);
          return readFallbackApplications();
        }
        throw new Error(error.message);
      }

      return (data ?? []).map(mapFromDb);
    } catch (error) {
      if (isStorageUnreachable(error)) {
        console.error("Supabase unreachable; using fallback storage:", error);
        return readFallbackApplications();
      }
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  return readFallbackApplications();
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
    acknowledgements?: MembershipAcknowledgements;
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
    acknowledgements: input.acknowledgements ?? null,
  };

  const supabase = getSupabase();

  if (supabase) {
    try {
      const payload = mapToDb(application);
      const { error } = await supabase.from("applications").insert(payload);

      if (!error) {
        return application;
      }

      const missingAcknowledgements =
        /acknowledgements/i.test(error.message) ||
        /Could not find the ['"]acknowledgements['"] column/i.test(
          error.message
        );

      if (missingAcknowledgements) {
        throw new Error(
          "Database is missing the acknowledgements column. In the Supabase SQL editor, run web/supabase/migration-acknowledgements.sql, then try again."
        );
      }

      if (!isStorageUnreachable(error)) {
        throw new Error(error.message);
      }

      console.error("Supabase insert unreachable; using fallback storage:", error);
    } catch (error) {
      if (!isStorageUnreachable(error)) {
        throw error instanceof Error ? error : new Error(String(error));
      }
      console.error("Supabase insert unreachable; using fallback storage:", error);
    }
  }

  const applications = await readFallbackApplications();
  applications.push(application);
  await writeFallbackApplications(applications);
  return application;
}

export async function getApplicationByReference(
  referenceNumber: string
): Promise<PendingApplication | null> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("reference_number", referenceNumber)
        .maybeSingle();

      if (error) {
        if (isStorageUnreachable(error)) {
          console.error("Supabase unreachable; using fallback storage:", error);
        } else {
          throw new Error(error.message);
        }
      } else {
        return data ? mapFromDb(data) : null;
      }
    } catch (error) {
      if (!isStorageUnreachable(error)) {
        throw error instanceof Error ? error : new Error(String(error));
      }
      console.error("Supabase unreachable; using fallback storage:", error);
    }
  }

  const applications = await readFallbackApplications();
  return (
    applications.find((app) => app.referenceNumber === referenceNumber) ?? null
  );
}

export async function listApplications(
  filters?: { kind?: ApplicationKind; status?: PendingApplication["status"] }
): Promise<PendingApplication[]> {
  let applications = await listAllApplications();

  if (filters?.kind) {
    applications = applications.filter((app) => app.kind === filters.kind);
  }
  if (filters?.status) {
    applications = applications.filter((app) => app.status === filters.status);
  }

  return applications.sort(
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

  const supabase = getSupabase();

  if (supabase) {
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: confirmed.status,
          confirmed_at: confirmed.confirmedAt,
        })
        .eq("reference_number", referenceNumber);

      if (!error) {
        return confirmed;
      }

      if (!isStorageUnreachable(error)) {
        throw new Error(error.message);
      }

      console.error("Supabase update unreachable; using fallback storage:", error);
    } catch (error) {
      if (!isStorageUnreachable(error)) {
        throw error instanceof Error ? error : new Error(String(error));
      }
      console.error("Supabase update unreachable; using fallback storage:", error);
    }
  }

  const applications = await readFallbackApplications();
  const index = applications.findIndex(
    (app) => app.referenceNumber === referenceNumber
  );
  if (index === -1) {
    applications.push(confirmed);
  } else {
    applications[index] = confirmed;
  }
  await writeFallbackApplications(applications);
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
    acknowledgements: application.acknowledgements ?? null,
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
    acknowledgements: row.acknowledgements
      ? (row.acknowledgements as MembershipAcknowledgements)
      : null,
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
    "compliance_signed_name",
    "compliance_signed_date",
    "enrollment_signed_name",
    "enrollment_signed_date",
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
      app.acknowledgements?.compliance.signedName ?? "",
      app.acknowledgements?.compliance.signedDate ?? "",
      app.acknowledgements?.enrollmentDisclosure.signedName ?? "",
      app.acknowledgements?.enrollmentDisclosure.signedDate ?? "",
      app.createdAt,
      app.confirmedAt ?? "",
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
