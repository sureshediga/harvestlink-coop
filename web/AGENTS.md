<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project notes

- **Site URL / QR links:** Public URLs (certificate/ID `/verify` QR links, payment redirects) are built from `getSiteUrl()` in `src/lib/site-url.ts` (`NEXT_PUBLIC_SITE_URL` → Netlify `URL` → localhost). Set `NEXT_PUBLIC_SITE_URL` with **no trailing slash**; `getSiteUrl()` strips trailing slashes defensively, so append paths as `` `${getSiteUrl()}/verify` `` rather than re-adding slashes.
- **Generated artifacts don't auto-update:** Certificates and member ID cards embed their QR at view/download time. Downloaded PNGs / printed PDFs are static — changing the site URL or verification signing requires re-generating them; old downloads keep the old link.
- **Admin/verify signing:** `CERT_SIGNING_SECRET` signs certificate verification codes and admin instructions access tokens; the admin session cookie reuses it. Changing it invalidates previously issued codes/sessions.
- **Supabase RLS:** The app connects with the Supabase **service_role** key (server-only) which bypasses RLS. Tables (`members`, `applications`, `admins`) should have RLS enabled with no policies. If `SUPABASE_SERVICE_ROLE_KEY` holds a publishable/anon key instead, writes fail once RLS is on — `GET /api/health` reports `supabaseKeyRole` and `siteUrl` to diagnose.
