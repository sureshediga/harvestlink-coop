import { getStore } from "@netlify/blobs";
import { isProductionHosting } from "./supabase";

function errorText(error: unknown): string {
  if (error instanceof Error) {
    const cause =
      error.cause instanceof Error
        ? error.cause.message
        : typeof error.cause === "string"
          ? error.cause
          : "";
    return `${error.message}\n${cause}`;
  }

  if (error && typeof error === "object") {
    const record = error as {
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };
    return [record.message, record.details, record.hint, record.code]
      .filter((part) => typeof part === "string" && part.length > 0)
      .join("\n");
  }

  return String(error);
}

export function isStorageUnreachable(error: unknown): boolean {
  const message = errorText(error);

  return (
    /ENOTFOUND/i.test(message) ||
    /ECONNREFUSED/i.test(message) ||
    /ETIMEDOUT/i.test(message) ||
    /fetch failed/i.test(message) ||
    /getaddrinfo/i.test(message) ||
    /network/i.test(message) ||
    /TypeError: fetch failed/i.test(message)
  );
}

function canUseNetlifyBlobs(): boolean {
  if (!isProductionHosting()) {
    return false;
  }

  // Auto-configured on Netlify Functions / Next runtime.
  return Boolean(process.env.NETLIFY || process.env.URL || process.env.DEPLOY_ID);
}

export async function readBlobJson<T>(key: string, fallback: T): Promise<T> {
  if (!canUseNetlifyBlobs()) {
    return fallback;
  }

  try {
    const store = getStore("harvestlink-data");
    const value = await store.get(key, { type: "json" });
    return (value as T | null) ?? fallback;
  } catch (error) {
    console.error(`Netlify Blobs read failed for ${key}:`, error);
    return fallback;
  }
}

export async function writeBlobJson<T>(key: string, value: T): Promise<void> {
  if (!canUseNetlifyBlobs()) {
    throw new Error(
      "Netlify Blobs storage is unavailable in this environment."
    );
  }

  const store = getStore("harvestlink-data");
  await store.setJSON(key, value);
}
