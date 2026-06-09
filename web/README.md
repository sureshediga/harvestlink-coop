# HarvestLink Cooperative Website

Consumer-friendly pre-launch site for **HarvestLink Cooperative** — a member-owned cooperative connecting U.S. consumers to farmer partners in India.

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
| `NEXT_PUBLIC_SITE_URL` | Recommended | Production site URL (Netlify sets `URL` automatically for API routes) |
| `SUPABASE_URL` | **Required on Netlify** | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **Required on Netlify** | Supabase service role key |
| `ADMIN_EXPORT_KEY` | Optional | Bearer token for CSV export |

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

Membership and investment forms **require Supabase on Netlify**. Local JSON files do not work in production.

1. Run `supabase/migration.sql` in the Supabase SQL editor (creates `members` and `applications` tables).
2. In Netlify → **Site configuration → Environment variables**, set:
   - `SUPABASE_URL` — no quotes, e.g. `https://xxxxx.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` — the **service_role** key (not anon)
3. **Clear cache and redeploy** (Deploys → Trigger deploy → Clear cache and deploy site).
4. After deploy, submit again. If it still fails, open browser DevTools → Network → click the failed `manual` request and read the JSON `error` message.

A **501** usually means the Next.js runtime did not handle the API route — confirm build logs show `Using Next.js Runtime - v5` and that `@netlify/plugin-nextjs` is installed.

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

## Design Spec

See `docs/superpowers/specs/2026-06-05-harvestlink-ui-design.md` for the full UI design specification.
