export type MemberAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

import type { MembershipAcknowledgements } from "./schemas";

export type PaymentProvider = "stripe" | "paypal" | "manual";

export type MemberRecord = {
  id: string;
  memberNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: MemberAddress;
  membershipPaid: boolean;
  membershipAmount: number;
  investmentUnits: number;
  investmentAmount: number;
  paymentProvider: PaymentProvider;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  paypalOrderId: string | null;
  isFoundingMember: boolean;
  acknowledgements?: MembershipAcknowledgements | null;
  createdAt: string;
};

export type CreateMemberInput = Omit<
  MemberRecord,
  "id" | "memberNumber" | "createdAt" | "membershipPaid"
> & {
  membershipPaid?: boolean;
};
