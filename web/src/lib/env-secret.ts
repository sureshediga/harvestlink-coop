/**
 * True when an env value looks like a real credential, not an empty or
 * example placeholder from `.env.example` (e.g. `sk_test_...`).
 */
export function isRealSecret(value: string | undefined): boolean {
  const trimmed = value?.trim() ?? "";
  if (trimmed.length < 8) return false;
  if (trimmed.includes("...")) return false;
  if (trimmed.toLowerCase().startsWith("change-me")) return false;
  return true;
}
