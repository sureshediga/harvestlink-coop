import { listApplications } from "./applications";
import { listMembers } from "./members";

export type CommunityCounts = {
  members: number;
  investors: number;
};

function uniqueEmails(emails: string[]): number {
  return new Set(
    emails.map((email) => email.trim().toLowerCase()).filter(Boolean)
  ).size;
}

/**
 * Public social-proof counts: founding members and investors, including
 * pending applications so the numbers move as soon as someone signs up.
 * Returns null (never throws) when storage is unavailable.
 */
export async function getCommunityCountsSafe(): Promise<CommunityCounts | null> {
  try {
    const [members, membershipApps, investmentApps] = await Promise.all([
      listMembers(),
      listApplications({ kind: "membership" }),
      listApplications({ kind: "investment" }),
    ]);

    const memberEmails = [
      ...members
        .filter((member) => member.isFoundingMember)
        .map((member) => member.email),
      ...membershipApps.map((application) => application.email),
    ];

    const investorEmails = [
      ...members
        .filter((member) => member.investmentUnits > 0)
        .map((member) => member.email),
      ...investmentApps.map((application) => application.email),
    ];

    return {
      members: uniqueEmails(memberEmails),
      investors: uniqueEmails(investorEmails),
    };
  } catch (error) {
    console.error("Community counts unavailable:", error);
    return null;
  }
}
