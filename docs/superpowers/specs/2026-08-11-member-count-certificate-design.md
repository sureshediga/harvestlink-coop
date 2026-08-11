# Member Count & Founding Membership Certificate

**Date:** 2026-08-11  
**Status:** Approved for implementation planning  
**Scope:** Landing-page founding-member count + post-signup certificate (print/PDF + PNG)

## Goal

Gamify founding membership on the marketing site by showing how many people have joined, and give every applicant an immediate shareable/printable certificate that affirms pride in sourcing produce directly from farmers.

## Decisions

| Topic | Choice |
| --- | --- |
| Counter style | Count-up of founding members (not a spots-remaining countdown) |
| Who increments the public number | Confirmed members only (payment activated in `members`) |
| When certificate is issued | Immediately after join form submit (pending Zelle payment) |
| Certificate delivery | On-screen + Print/Save as PDF **and** Download PNG |
| Landing placement | Inside the existing Membership block (not hero) |
| Membership tagline | “Be the member you can be. Source direct from farmers & Eat healthy” |
| Certificate title | “Proud Farmer Cooperative Member” |

## Out of scope (v1)

- Emailing the certificate as an attachment
- Certificate gated on payment confirmation
- Animated count-up / realtime websocket updates
- Social OAuth share APIs (WhatsApp/Instagram share is manual via saved PNG)

## Member count

### Behavior

- Landing page Membership card shows:
  - Large confirmed-member count
  - Label: “founding members”
  - Tagline: “Be the member you can be. Source direct from farmers & Eat healthy”
  - Existing Join Now CTA and membership notes remain

### Data

- New public endpoint: `GET /api/member-count`
- Response: `{ "count": number }`
- Count = number of records returned by existing member storage (`listMembers()`), which already prefers healthy Supabase and falls back to Netlify Blobs / local JSON
- Pending applications (`applications` with `pending_payment`) do **not** count

### Rendering

- Prefer server-side fetch on the home page so the count is present on first paint
- If the count cannot be loaded, show fallback copy without a fabricated number, e.g. “Be among our founding members,” plus the same tagline

### Edge cases

- Storage unreachable → fallback copy (no crash)
- Count is `0` → still show `0 founding members` (honest early-stage social proof)

## Certificate

### When / where

- After successful `POST /api/applications/manual`, user lands on `/join/instructions?ref=...`
- Instructions page loads the pending application and renders the certificate above the Zelle payment steps

### Content

- **Title:** Proud Farmer Cooperative Member
- **Org:** HarvestLinx Cooperative (display name may use existing site branding; keep “HarvestLinx” on the certificate to match contact identity)
- **Body:** Proud to source produce directly from farmer-owned organisations
- **Tagline:** Be the member you can be. Source direct from farmers & Eat healthy
- **Fields:** Signed name from enrollment disclosure, application reference number, signed/issue date
- **Standing line (under name):** "Our Nth member" (membership) or "Our Nth investor" (investment), where N is the ordinal parsed from the reference number's trailing sequence (e.g. `HL-APP-2026-0002` → 2nd). Hidden when the ordinal can't be determined.
- **Disclosure (small):** Membership activates after joining-fee payment is confirmed

The certificate is shared by both `/join/instructions` (membership, `HL-APP-...`) and `/invest/instructions` (investment, `HL-INV-...`); the standing-line noun switches on application kind.

### Delivery

1. **On-screen** designed certificate panel
2. **Print / Save as PDF** via browser print with a print stylesheet (hide chrome/nav; show certificate)
3. **Download PNG** via client-side render (canvas / html-to-image) of a share-friendly certificate variant (~square or 4:5 for mobile sharing)

### Edge cases

- Missing application ref / lookup fails → keep existing error UX; no certificate
- PNG generation fails → keep Print/PDF available; show a short non-blocking error on download

## Architecture

```
Home (/)
  └─ Membership block
       └─ member count from GET /api/member-count
            └─ listMembers() → Supabase | Netlify Blobs | local

Join flow
  └─ JoinForm submit → POST /api/applications/manual
       └─ redirect /join/instructions?ref=HL-APP-...
            └─ MembershipCertificate (name, ref, date)
                 ├─ Print / Save PDF
                 └─ Download PNG
```

### New / touched pieces

| Piece | Role |
| --- | --- |
| `GET /api/member-count` | Public count API |
| Home Membership section | Display count + tagline |
| `MembershipCertificate` component | Visual certificate + print styles |
| Certificate PNG helper (client) | Export share image |
| `/join/instructions` | Mount certificate above payment steps |

### Non-goals for storage

- No new database tables required for v1
- Certificate is generated from application data already stored; not persisted as a separate file in v1

## Copy reference

**Landing Membership block**

- Count label: `founding members`
- Tagline: `Be the member you can be. Source direct from farmers & Eat healthy`

**Certificate**

- Title: `Proud Farmer Cooperative Member`
- Body: `Proud to source produce directly from farmer-owned organisations`
- Tagline: `Be the member you can be. Source direct from farmers & Eat healthy`
- Note: `Membership activates after joining-fee payment is confirmed`

## Testing (acceptance)

1. Home Membership block shows confirmed member count (or honest fallback)
2. Submitting membership application still redirects to instructions with ref
3. Instructions page shows certificate with correct name, ref, and date
4. Print preview shows certificate without site chrome
5. Download PNG produces a usable image file
6. Pending applications do not increase the public count until member confirmation

## Open follow-ups (later)

- Optional email delivery of certificate PDF after payment confirmation
- “Official” certificate upgrade once payment is confirmed (member number instead of application ref)
