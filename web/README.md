# HarvestLinx Cooperative Website

Consumer-friendly pre-launch site for **HarvestLinx Cooperative** — a member-owned cooperative connecting U.S. consumers to farmer partners in India.

## Features

- Marketing pages (Home, How It Works, Farmers, Membership, Texas, Vision, FAQ)
- Founding member signup via **Zelle** (614-961-9552)
- Optional cooperative investment (multiples of $100)
- Member and application storage (Supabase required on Netlify; local JSON for dev)
- Admin CSV export of members

## Quick Start

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Description |
|---|---|---|
| `STRIPE_SECRET_KEY` | For Stripe payments | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For Stripe payments | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | For Stripe payments | Stripe webhook signing secret |
| `PAYPAL_CLIENT_ID` | For PayPal payments | PayPal REST app client ID |
| `PAYPAL_CLIENT_SECRET` | For PayPal payments | PayPal REST app secret |
| `PAYPAL_MODE` | For PayPal | `sandbox` or `live` |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public site URL used to build certificate/ID **QR verify links** and payment redirects. Use **no trailing slash** (e.g. `https://your-site.netlify.app`). Netlify's `URL` is used as a fallback. |
| `SUPABASE_URL` | **Required on Netlify** | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **Required on Netlify** | Supabase service role key |
| `ADMIN_EXPORT_KEY` | Optional | Bearer token for CSV export APIs; also the one-time **setup key** used to create the first admin account at `/admin/setup` |
| `CERT_SIGNING_SECRET` | Recommended | HMAC secret signing certificate/ID verification codes and the instructions-page access tokens. Set a long random string in production; a dev fallback is used if unset. |

Without Supabase, records are stored in `data/*.json` (local dev only — not persisted on Netlify).

## Deploy to Netlify

The repo includes `netlify.toml` at the project root with `base = "web"` and the Netlify Next.js plugin.

### 1. Supabase (required for production)

Run `supabase/migration.sql` in your [Supabase](https://supabase.com) SQL editor. This creates `members` and `applications` tables.

### 2. Connect the site

**Option A — Netlify UI**

1. Push this project to GitHub/GitLab/Bitbucket.
2. In [Netlify](https://app.netlify.com), **Add new site → Import an existing project**.
3. Netlify reads `netlify.toml` automatically (`base: web`, build command, Next.js plugin).
4. Add environment variables under **Site configuration → Environment variables**:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EXPORT_KEY` (secure random string for admin CSV/confirm API)
   - `NEXT_PUBLIC_SITE_URL` = your Netlify site URL (e.g. `https://your-site.netlify.app`)
5. Deploy.

**Option B — Netlify CLI**

```bash
cd web
npm install
npx netlify-cli login
npx netlify-cli init          # link or create a site from repo root
npx netlify-cli deploy --build --prod
```

Run `netlify init` from the **repository root** (where `netlify.toml` lives), not from `web/`.

### 3. Admin after deploy

Replace `localhost:3000` with your Netlify URL in the curl examples below.

### Form submission fails (500 / 501)

Membership and investment forms prefer **Supabase** on Netlify. If Supabase is missing or unreachable, the site falls back to **Netlify Blobs** so signups can still succeed.

Recommended setup:

1. Run `supabase/migration.sql` in the Supabase SQL editor (creates `members` and `applications` tables).
2. In Netlify → **Site configuration → Environment variables**, set:
   - `SUPABASE_URL` — no quotes, e.g. `https://xxxxx.supabase.co` (must resolve in DNS)
   - `SUPABASE_SERVICE_ROLE_KEY` — the **service_role** key (not anon)
3. **Clear cache and redeploy** (Deploys → Trigger deploy → Clear cache and deploy site).
4. Check `GET /api/health` — `ok` should be `true`, and `storage` should be `supabase` or `netlify-blobs`.
5. After deploy, submit again. If it still fails, open browser DevTools → Network → click the failed `manual` request and read the JSON `error` message.

A **501** usually means the Next.js runtime did not handle the API route — confirm build logs show `Using Next.js Runtime - v5` and that `@netlify/plugin-nextjs` is installed.

## Admin dashboard (`/admin`)

The `/admin` dashboard uses per-user login (email + password), with hashed passwords and a signed HttpOnly session cookie.

1. First-time setup: go to `/admin/setup`, enter the **setup key** (your `ADMIN_EXPORT_KEY`) plus the email + password for the first admin. Setup is only available while no admin accounts exist.
2. Sign in at `/admin/login`. Manage additional admins at `/admin/admins`.
3. If using Supabase, run `supabase/migration-admins.sql` to create the `admins` table (otherwise admins persist via Netlify Blobs / local JSON like other records).

The CSV export APIs still accept `Authorization: Bearer <ADMIN_EXPORT_KEY>` for programmatic use, in addition to a logged-in admin session.

## Admin: Pending Applications

Export all membership applications (pending Zelle payments):

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_EXPORT_KEY" \
  "http://localhost:3000/api/admin/applications?status=pending_payment" \
  -o applications-pending.csv
```

Confirm payment received and activate membership:

```bash
curl -X POST http://localhost:3000/api/admin/applications \
  -H "Authorization: Bearer YOUR_ADMIN_EXPORT_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"referenceNumber\":\"HL-APP-2026-0001\"}"
```

## Admin Export (Members)

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_EXPORT_KEY" \
  http://localhost:3000/api/admin/export -o members.csv
```

## Certificates & QR codes

Membership certificates and member ID cards include a QR code linking to `/verify?c=<signed code>`. The QR's base URL comes from `getSiteUrl()` (`NEXT_PUBLIC_SITE_URL` → Netlify `URL` → localhost).

- Keep `NEXT_PUBLIC_SITE_URL` **without a trailing slash**. `getSiteUrl()` strips trailing slashes defensively, but a clean value avoids surprises. (A trailing slash previously produced a `//verify` double-slash that broke QR scans.)
- The QR is rendered into the certificate/ID at the moment it's viewed/downloaded. **Downloaded PNGs and printed PDFs do not auto-update** — if the site URL changes, previously downloaded artifacts keep the old link and must be re-generated (re-open the instructions page and re-download).

## Design Spec

See `docs/superpowers/specs/2026-06-05-harvestlink-ui-design.md` for the full UI design specification.
