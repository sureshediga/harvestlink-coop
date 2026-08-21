import { getSiteUrl } from "./site-url";
import { signAccessToken } from "./verify";
import type { ApplicationKind } from "./applications";

export function instructionsViewUrl(
  kind: ApplicationKind,
  referenceNumber: string
): string {
  const path =
    kind === "investment" ? "/invest/instructions" : "/join/instructions";
  const token = signAccessToken(referenceNumber);
  return `${getSiteUrl()}${path}?ref=${encodeURIComponent(referenceNumber)}&t=${encodeURIComponent(token)}`;
}
