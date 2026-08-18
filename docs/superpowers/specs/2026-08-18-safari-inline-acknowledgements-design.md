# Safari-safe inline membership acknowledgements

**Date:** 2026-08-18  
**Status:** Approved for implementation planning  
**Scope:** Replace membership acknowledgement popups on `/join` with expand-in-place panels

## Goal

Make the two required membership acknowledgement forms usable in Safari (including iPhone Safari) without changing what is collected, signed, or sent at payment.

## Problem

On Review & Sign, “Read and sign in popup” opens `AcknowledgementModal`: a `position: fixed` overlay that also sets `document.body` to `position: fixed` to lock background scroll. In Safari that overlay often never appears, so members cannot sign the forms and cannot join.

## Decisions

| Topic | Choice |
| --- | --- |
| Presentation | Expand in place under the acknowledgement row |
| How many forms open at once | One |
| Scrolling | Page scroll only — no overlay, no inner scrollbar, no body scroll lock |
| After a successful sign | Panel collapses; row shows “Signed by {name} on {date}” |
| Re-open | “View signed form” expands the same panel with existing values |
| Payload / payment gates | Unchanged |

## Out of scope

- Invest flow acknowledgements (there are none today)
- Changing disclaimer copy, `.docx` files, or acknowledgement schema
- Adding a frontend test runner (the `web` app has none today)
- Fixing or keeping the overlay modal for Safari

## User flow

Review & Sign stays one step on `/join`. The two required rows remain:

1. Member Compliance & Acknowledgement Form
2. Membership Enrollment & Disclosure Form (collects name, email, phone, address)

Tapping **Read and sign** on a row expands that form directly under the row: legal sections, “Download original document (.docx)”, signature fields, **I acknowledge and sign**, and **Cancel**.

Rules:

- Opening one form closes the other if it is open.
- **Cancel** collapses the panel and does not save.
- A successful sign collapses that panel and marks the row signed.
- **View signed form** re-opens the panel with the saved values so the member can review or re-sign.
- The rest of the step (terms checkbox, payment choices) stays below the two rows and is unchanged.

Copy change: replace “Read and sign in popup →” with “Read and sign →”.

## Components

Replace overlay `AcknowledgementModal` with an inline `AcknowledgementPanel` used by `JoinForm`.

Keep `FormAcknowledgementRow` for the checkbox, label, signed summary, and open actions. The row no longer opens a dialog; it tells `JoinForm` which disclaimer id is expanded.

`AcknowledgementPanel` reuses the current modal contents and validation:

- Disclaimer title, sections, certification, and `.docx` download
- Enrollment-only contact/address fields when `collectApplicationInfo` is true
- Printed name and date
- Same client-side validation messages as today

Constraints:

- No `role="dialog"`, no `aria-modal`, no full-screen overlay
- Do not set `documentElement.style.overflow` or `body.style.position`
- Do not put the legal text in a `max-height` + `overflow-y-auto` box
- After expand, scroll the panel into view with `element.scrollIntoView({ block: "start" })` (no smooth animation)
- Escape-to-close is not required; this is not a dialog

Replace `web/src/components/AcknowledgementModal.tsx` with `web/src/components/AcknowledgementPanel.tsx` (inline form + row). Update `JoinForm` so expanded-disclaimer state renders `AcknowledgementPanel` under the matching row. Delete the overlay component so `/join` has no popup path.

## Data and errors

Signing still produces the existing objects:

- Compliance: `{ signedName, signedDate, acknowledgedAt }`
- Enrollment: the same plus `{ email, phone, street, city, state, zip }`

`membershipPayload()`, `ensureReadyToPay()`, PayPal/Stripe/Zelle submit, and API schemas do not change.

Validation errors stay on the expanded panel. The existing “please sign both forms” / “please agree to terms” errors stay above payment choices.

Re-signing overwrites the in-memory acknowledgement for that form, same as viewing the old modal and signing again.

## Testing

Do not add Jest/Vitest for this change. Required verification is a manual checklist on Safari and one other browser (Chrome or Edge):

1. On `/join` Review & Sign, **Read and sign** expands the compliance form in the page. No overlay/dialog appears.
2. The expanded form is readable by scrolling the page (including iPhone Safari).
3. **Cancel** collapses the panel; the row is still unsigned.
4. A valid sign collapses the panel and shows “Signed by … on …”.
5. Opening the second form closes the first.
6. **View signed form** re-opens with the saved values.
7. Payment buttons still refuse until both forms are signed and terms are checked.
8. Desktop Chrome/Edge still complete the same flow.

## Success criteria

A Safari user can read, sign, and submit both acknowledgement forms on `/join` without a popup, and the application payload is unchanged.
