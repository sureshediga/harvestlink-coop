import { SITE } from "./constants";

const GENERIC =
  `Unable to submit application. Please try again or email ${SITE.contactEmail}.`;

/** Errors safe/useful to show to the applicant (no secrets). */
function isActionableDatabaseError(message: string): boolean {
  const patterns = [
    /supabase/i,
    /SUPABASE_/,
    /Database is not configured/i,
    /Database storage is unavailable/i,
    /relation .+ does not exist/i,
    /does not exist/i,
    /Could not find the .+ column/i,
    /schema cache/i,
    /row-level security/i,
    /permission denied/i,
    /Invalid API key/i,
    /JWT/i,
    /PGRST/i,
    /duplicate key/i,
    /unique constraint/i,
    /violates/i,
    /acknowledgements/i,
    /migration/i,
  ];

  return patterns.some((pattern) => pattern.test(message));
}

export function publicApiErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return GENERIC;
  }

  const message = error.message.trim();
  if (!message) {
    return GENERIC;
  }

  if (isActionableDatabaseError(message)) {
    return message;
  }

  return GENERIC;
}
