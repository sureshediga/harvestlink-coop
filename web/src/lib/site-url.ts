/** Site URL for redirects. Netlify sets URL at runtime; set NEXT_PUBLIC_SITE_URL for client-side links. */
export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    "http://localhost:3000";
  // Strip trailing slash(es) so callers can safely append "/verify", "/join", etc.
  // without producing a double slash (which breaks QR scans / some routers).
  return url.replace(/\/+$/, "");
}
