export function publicApiErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unable to submit application. Please try again or email hello@harvestlink.coop.";
  }

  const message = error.message;

  if (
    message.includes("Supabase") ||
    message.includes("SUPABASE_") ||
    message.includes("Database is not configured") ||
    message.includes("relation") ||
    message.includes("does not exist")
  ) {
    return message;
  }

  return "Unable to submit application. Please try again or email hello@harvestlink.coop.";
}
