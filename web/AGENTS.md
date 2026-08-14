<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project notes

- **Site URL / QR links:** Public URLs (certificate/ID `/verify` QR links, payment redirects) are built from `getSiteUrl()` in `src/lib/site-url.ts` (`NEXT_PUBLIC_SITE_URL` → Netlify `URL` → localhost). Set `NEXT_PUBLIC_SITE_URL` with **no trailing slash**; `getSiteUrl()` strips trailing slashes defensively, so append paths as `` `${getSiteUrl()}/verify` `` rather than re-adding slashes.
- **Generated artifacts don't auto-update:** Certificates and member ID cards embed their QR at view/download time. Downloaded PNGs / printed PDFs are static — changing the site URL or verification signing requires re-generating them; old downloads keep the old link.
- **Admin/verify signing:** `CERT_SIGNING_SECRET` signs certificate verification codes and admin instructions access tokens; the admin session cookie reuses it. Changing it invalidates previously issued codes/sessions.
- **Payments:** Zelle is always offered on Join/Invest. PayPal and Stripe buttons appear only when credentials are configured (`PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET`, and/or `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`). `GET /api/payments/methods` reports `{ zelle, paypal, stripe }` without exposing secrets. For production PayPal set `PAYPAL_MODE=live` (default/sandbox talks to PayPal sandbox). PayPal/Stripe capture activates the member immediately; Zelle stays pending until an admin marks it paid.
