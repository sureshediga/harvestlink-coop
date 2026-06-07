/** Site URL for redirects. Netlify sets URL at runtime; set NEXT_PUBLIC_SITE_URL for client-side links. */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    "http://localhost:3000"
  );
}
