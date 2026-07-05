import type { FormAcknowledgement } from "./schemas";

export type DisclaimerId = "compliance" | "enrollmentDisclosure";

export type MembershipAcknowledgements = {
  compliance: FormAcknowledgement;
  enrollmentDisclosure: FormAcknowledgement;
};

export type DisclaimerDefinition = {
  id: DisclaimerId;
  title: string;
  documentFileName: string;
  sections: Array<{ heading: string; body: string[] }>;
  certification: string[];
};

export const MEMBERSHIP_DISCLAIMERS: Record<DisclaimerId, DisclaimerDefinition> = {
  compliance: {
    id: "compliance",
    title: "Member Compliance & Acknowledgement Form",
    documentFileName: "Harvestlinx_Member_Compliance_and_Acknowledgement_Form.docx",
    sections: [
      {
        heading: "Section 1 — Risk Acknowledgement",
        body: [
          "The applicant understands and accepts that participation in HarvestLinx Cooperative involves business, market, operational, regulatory, import/export, and financial risks.",
          "The Cooperative makes no guarantees regarding future performance, patronage distributions, product sales, or business outcomes.",
          "By completing this form, the applicant acknowledges and accepts these risks.",
        ],
      },
      {
        heading: "Section 2 — Privacy Notice & Consent",
        body: [
          "HarvestLinx Cooperative collects and maintains member information for governance, compliance, operational, communications, and member service purposes.",
          "The Cooperative will use reasonable safeguards to protect member information and will only share information as required by law or legitimate operational necessity.",
          "The applicant consents to the collection, storage, and use of information as described above.",
        ],
      },
      {
        heading: "Section 3 — Conflict of Interest Disclosure",
        body: [
          "The Cooperative requires transparency from members serving in governance, advisory, procurement, retail, or leadership roles.",
          "Please disclose any actual, potential, or perceived conflicts of interest. If no conflicts exist, write \"None\".",
        ],
      },
      {
        heading: "Section 4 — Intellectual Property Acknowledgement",
        body: [
          "The applicant acknowledges that HarvestLinx®, Maithri®, all logos, trademarks, packaging designs, marketing materials, product names, digital assets, and related intellectual property are owned exclusively by HarvestLinx Cooperative.",
          "Membership does not grant ownership rights or independent usage rights unless specifically authorized in writing by the Cooperative.",
        ],
      },
      {
        heading: "Section 5 — Receipt of Documents Acknowledgement",
        body: [
          "The applicant confirms receipt and review of the following documents: Membership Enrollment & Disclosure Form, Membership Agreement, Privacy Notice, Conflict of Interest Policy, Bylaws Summary, and Brand and Intellectual Property Policies.",
          "The applicant acknowledges having had the opportunity to ask questions and obtain clarification regarding these documents.",
        ],
      },
    ],
    certification: [
      "I certify that the information provided in this document is accurate and complete. I acknowledge that I have reviewed and understood the Risk Acknowledgement, Privacy Notice & Consent, Conflict of Interest Disclosure, Intellectual Property Acknowledgement, and Receipt of Documents Acknowledgement sections.",
      "I agree to comply with HarvestLinx Cooperative policies, bylaws, membership requirements, and applicable standards.",
      "Electronic Signature Consent: I agree that my electronic signature shall have the same legal effect as my handwritten signature under the U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN Act) and applicable state laws.",
    ],
  },
  enrollmentDisclosure: {
    id: "enrollmentDisclosure",
    title: "Membership Enrollment & Disclosure Form",
    documentFileName: "Harvestlinx_Membership_Enrollment_and_Disclosure_Form.docx",
    sections: [
      {
        heading: "Section 1 — Membership Application",
        body: [
          "This section collects your application information for membership in HarvestLinx Cooperative, including your name, email, phone, and address. The standard membership joining fee is USD 100.",
        ],
      },
      {
        heading: "Section 2 — Membership Disclosure Acknowledgement",
        body: [
          "IMPORTANT NOTICE: Membership in HarvestLinx Cooperative is intended to allow participation in the Cooperative's activities, products, and member services.",
          "The USD 100 membership joining fee does not confer voting rights. Voting rights require a minimum USD 1,000 cooperative capital investment — one member, one vote among voting members, with dividends proportional to investment.",
          "Membership is NOT a security or stock offering, a bank deposit, an investment contract, or a guarantee of profits or appreciation.",
          "The Cooperative does not guarantee dividends, patronage refunds, distributions, or financial returns. Any patronage distributions are subject to Board approval, Cooperative performance, and applicable law.",
          "By signing below, the applicant acknowledges understanding these disclosures.",
        ],
      },
      {
        heading: "Section 3 — Membership Fee & Capital Contribution Disclosure",
        body: [
          "The USD 100 membership joining fee supports cooperative administration, member services, governance activities, brand development, and operating expenses.",
          "The applicant acknowledges understanding how membership fees are used and agrees to the applicable policies and bylaws.",
        ],
      },
    ],
    certification: [
      "I certify that the information provided is accurate and complete. I acknowledge that I have read and understood the Membership Disclosure Acknowledgement and Membership Fee & Capital Contribution Disclosure.",
      "I agree to comply with the HarvestLinx Cooperative Bylaws, policies, and membership requirements.",
      "Electronic Signature Consent: I agree that my electronic signature shall have the same legal effect as my handwritten signature under the U.S. E-SIGN Act and applicable state laws.",
    ],
  },
};

export function disclaimerDocumentUrl(fileName: string): string {
  return `/documents/${encodeURIComponent(fileName)}`;
}
