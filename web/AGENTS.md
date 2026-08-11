<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This repo is a single Next.js 16 (Turbopack) app living in `web/`. All commands run from `web/`. Standard scripts are in `web/package.json` (`dev`, `build`, `start`, `lint`); run/test/build docs are in `web/README.md`.

- Run the dev server with `npm run dev` from `web/` (serves on `http://localhost:3000`). It is a long-running process — start it in a background/tmux session, not a blocking foreground call.
- `.env.local` is required (copy from `web/.env.example`). Payment (Stripe/PayPal) and Supabase keys are all optional for local dev — leave them blank and membership/investment records persist to local JSON under `web/data/` (gitignored). Only Zelle ("manual") signup works without payment keys; card/PayPal checkout routes need real keys.
- `GET /api/health` reports `storage: "unavailable"` in local dev. That is expected: the health check only probes Supabase/Netlify Blobs, not the local-JSON fallback, so writes still succeed via `web/data/*.json`.
- The no-payment "hello world" flow is founding-member signup at `/join`: continue → open and sign both acknowledgement modals (Compliance, then Enrollment & Disclosure which collects contact/address) → check the terms box → "Submit application ... via Zelle" → redirects to `/join/instructions?ref=HL-APP-...`. This POSTs `/api/applications/manual`.
- `npm run lint` currently reports one pre-existing error in `src/components/TexasBanner.tsx` (setState-in-effect) and one unused-var warning; these are unrelated to environment setup.
