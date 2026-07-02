import { z } from "zod";

export const formAcknowledgementSchema = z.object({
  signedName: z.string().min(2, "Printed name is required"),
  signedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Valid date is required"),
  acknowledgedAt: z.string().datetime(),
});

export type FormAcknowledgement = z.infer<typeof formAcknowledgementSchema>;

const contactFieldsSchema = {
  email: z.string().email("Valid email is required"),
  phone: z
    .string()
    .min(10, "Valid phone number is required")
    .regex(/^[\d\s\-+()]+$/, "Valid phone number is required"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Valid ZIP code is required"),
};

export const enrollmentAcknowledgementSchema = formAcknowledgementSchema.extend(
  contactFieldsSchema
);

export type EnrollmentAcknowledgement = z.infer<
  typeof enrollmentAcknowledgementSchema
>;

export const membershipAcknowledgementsSchema = z.object({
  compliance: formAcknowledgementSchema,
  enrollmentDisclosure: enrollmentAcknowledgementSchema,
});

export type MembershipAcknowledgements = z.infer<
  typeof membershipAcknowledgementsSchema
>;

export const memberInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  ...contactFieldsSchema,
});

export type MemberInfo = z.infer<typeof memberInfoSchema>;

export const membershipCheckoutSchema = z.object({
  agreedToTerms: z.literal(true, {
    message: "You must agree to membership terms",
  }),
  acknowledgements: membershipAcknowledgementsSchema,
});

export const investmentCheckoutSchema = memberInfoSchema.extend({
  investmentUnits: z.number().int().min(1, "Minimum investment is 1 unit ($100)"),
  memberNumber: z.string().optional(),
  agreedToTerms: z.literal(true, {
    message: "You must agree to investment terms",
  }),
});

export type MembershipCheckoutPayload = z.infer<typeof membershipCheckoutSchema>;
export type InvestmentCheckoutPayload = z.infer<typeof investmentCheckoutSchema>;

export function memberInfoFromMembershipCheckout(
  data: MembershipCheckoutPayload
): MemberInfo {
  const enrollment = data.acknowledgements.enrollmentDisclosure;
  return {
    fullName: enrollment.signedName,
    email: enrollment.email,
    phone: enrollment.phone,
    street: enrollment.street,
    city: enrollment.city,
    state: enrollment.state,
    zip: enrollment.zip,
  };
}

// Backward-compatible alias
export const checkoutSchema = membershipCheckoutSchema;
export type CheckoutPayload = MembershipCheckoutPayload;
