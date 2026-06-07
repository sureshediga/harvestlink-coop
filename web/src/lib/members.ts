import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { CreateMemberInput, MemberRecord } from "./members-types";
import { getSupabase } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "members.json");

async function readLocalMembers(): Promise<MemberRecord[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as MemberRecord[];
  } catch {
    return [];
  }
}

async function writeLocalMembers(members: MemberRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(members, null, 2));
}

async function generateMemberNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const members = await listMembers();
  const count = members.length + 1;
  return `HL-${year}-${String(count).padStart(4, "0")}`;
}

export async function listMembers(): Promise<MemberRecord[]> {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(mapFromDb);
  }

  return readLocalMembers();
}

export async function getMemberBySessionId(
  sessionId: string
): Promise<MemberRecord | null> {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? mapFromDb(data) : null;
  }

  const members = await readLocalMembers();
  return members.find((m) => m.stripeSessionId === sessionId) ?? null;
}

export async function getMemberByPayPalOrderId(
  orderId: string
): Promise<MemberRecord | null> {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("paypal_order_id", orderId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? mapFromDb(data) : null;
  }

  const members = await readLocalMembers();
  return members.find((m) => m.paypalOrderId === orderId) ?? null;
}

export async function createMember(
  input: CreateMemberInput
): Promise<MemberRecord> {
  const memberNumber = await generateMemberNumber();
  const record: MemberRecord = {
    id: randomUUID(),
    memberNumber,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    address: input.address,
    membershipPaid: input.membershipPaid ?? true,
    membershipAmount: input.membershipAmount,
    investmentUnits: input.investmentUnits,
    investmentAmount: input.investmentAmount,
    paymentProvider: input.paymentProvider,
    stripeSessionId: input.stripeSessionId,
    stripePaymentIntentId: input.stripePaymentIntentId,
    paypalOrderId: input.paypalOrderId,
    isFoundingMember: input.isFoundingMember,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabase();

  if (supabase) {
    const { error } = await supabase.from("members").insert(mapToDb(record));

    if (error) {
      throw new Error(error.message);
    }

    return record;
  }

  const members = await readLocalMembers();
  members.push(record);
  await writeLocalMembers(members);
  return record;
}

function mapToDb(record: MemberRecord) {
  return {
    id: record.id,
    member_number: record.memberNumber,
    full_name: record.fullName,
    email: record.email,
    phone: record.phone,
    address: record.address,
    membership_paid: record.membershipPaid,
    membership_amount: record.membershipAmount,
    investment_units: record.investmentUnits,
    investment_amount: record.investmentAmount,
    payment_provider: record.paymentProvider,
    stripe_session_id: record.stripeSessionId,
    stripe_payment_intent_id: record.stripePaymentIntentId,
    paypal_order_id: record.paypalOrderId,
    is_founding_member: record.isFoundingMember,
    created_at: record.createdAt,
  };
}

function mapFromDb(row: Record<string, unknown>): MemberRecord {
  return {
    id: String(row.id),
    memberNumber: String(row.member_number),
    fullName: String(row.full_name),
    email: String(row.email),
    phone: String(row.phone),
    address: row.address as MemberRecord["address"],
    membershipPaid: Boolean(row.membership_paid),
    membershipAmount: Number(row.membership_amount),
    investmentUnits: Number(row.investment_units),
    investmentAmount: Number(row.investment_amount),
    paymentProvider: (row.payment_provider as MemberRecord["paymentProvider"]) ?? "stripe",
    stripeSessionId: row.stripe_session_id ? String(row.stripe_session_id) : null,
    stripePaymentIntentId: row.stripe_payment_intent_id
      ? String(row.stripe_payment_intent_id)
      : null,
    paypalOrderId: row.paypal_order_id ? String(row.paypal_order_id) : null,
    isFoundingMember: Boolean(row.is_founding_member),
    createdAt: String(row.created_at),
  };
}

export function membersToCsv(members: MemberRecord[]): string {
  const headers = [
    "member_number",
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
    "payment_provider",
    "is_founding_member",
    "created_at",
  ];

  const rows = members.map((m) =>
    [
      m.memberNumber,
      m.fullName,
      m.email,
      m.phone,
      m.address.street,
      m.address.city,
      m.address.state,
      m.address.zip,
      (m.membershipAmount / 100).toFixed(2),
      m.investmentUnits,
      (m.investmentAmount / 100).toFixed(2),
      m.paymentProvider,
      m.isFoundingMember,
      m.createdAt,
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
