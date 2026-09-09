import type { MembershipAcknowledgements } from "./schemas";

export type MemberAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
};

export function memberAddressFromInfo(info: {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}): MemberAddress {
  return {
    street: info.street,
    city: info.city,
    state: info.state,
    zip: info.zip,
    country: info.country?.trim() || undefined,
  };
}

export function formatAddressLocality(address: {
  city: string;
  state: string;
  zip: string;
  country?: string;
}): string {
  const locality = `${address.city}, ${address.state} ${address.zip}`.trim();
  const country = address.country?.trim();
  return country ? `${locality}, ${country}` : locality;
}

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
