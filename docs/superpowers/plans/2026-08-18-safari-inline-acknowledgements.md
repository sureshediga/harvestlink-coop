# Safari-safe inline membership acknowledgements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/join` acknowledgement overlay popups with expand-in-place panels so Safari users can read and sign the two required forms.

**Architecture:** `JoinForm` keeps a single `openDisclaimer` id. Tapping Read and sign / View signed form expands `AcknowledgementPanel` under that row (one at a time). The panel is normal page content: no overlay, no body scroll lock, no inner scrollbar. Signing still writes the existing acknowledgement objects and collapses the panel.

**Tech Stack:** Next.js (App Router) in `web/`, React 19 client components, Tailwind CSS, existing `MEMBERSHIP_DISCLAIMERS` and acknowledgement schemas.

## Global Constraints

- Presentation: expand in place under the acknowledgement row
- How many forms open at once: one
- Scrolling: page scroll only — no overlay, no inner scrollbar, no body scroll lock
- After a successful sign: panel collapses; row shows “Signed by {name} on {date}”
- Re-open: “View signed form” expands the same panel with existing values
- Payload / payment gates: unchanged
- Copy: replace “Read and sign in popup →” with “Read and sign →”
- No `role="dialog"`, no `aria-modal`, no full-screen overlay
- Do not set `documentElement.style.overflow` or `body.style.position`
- Do not put the legal text in a `max-height` + `overflow-y-auto` box
- After expand, scroll with `element.scrollIntoView({ block: "start" })` (no smooth animation)
- Escape-to-close is not required
- Do not add Jest/Vitest for this change
- Do not change disclaimer copy, `.docx` files, acknowledgement schema, or the invest flow

## File structure

- Create: `web/src/components/AcknowledgementPanel.tsx` — inline panel + `FormAcknowledgementRow`
- Modify: `web/src/components/JoinForm.tsx` — render the panel under the matching row
- Delete: `web/src/components/AcknowledgementModal.tsx` — overlay popup path must not remain

---

### Task 1: Inline AcknowledgementPanel

**Files:**
- Create: `web/src/components/AcknowledgementPanel.tsx`

**Interfaces:**
- Consumes: `DisclaimerDefinition` from `@/lib/disclaimers`; `FormAcknowledgement` and `EnrollmentAcknowledgement` from `@/lib/schemas`; `disclaimerDocumentUrl()`
- Produces:
  - `AcknowledgementPanel(props: AcknowledgementPanelProps): JSX.Element`
  - `FormAcknowledgementRow(props: FormAcknowledgementRowProps): JSX.Element`
  - `AcknowledgementPanelProps`: `{ disclaimer: DisclaimerDefinition; collectApplicationInfo?: boolean; defaultName?: string; existingAcknowledgement?: FormAcknowledgement | EnrollmentAcknowledgement | null; onCancel: () => void; onAcknowledge: (acknowledgement: FormAcknowledgement | EnrollmentAcknowledgement) => void }`
  - `FormAcknowledgementRowProps`: `{ label: string; acknowledged: boolean; signedName?: string; signedDate?: string; onOpen: () => void }`

- [ ] **Step 1: Create `web/src/components/AcknowledgementPanel.tsx`**

Create the file with this exact content. It is the current modal form without overlay, dialog role, or body scroll lock. `onCancel` replaces `onClose`. Mount scrolls the panel into view.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  disclaimerDocumentUrl,
  type DisclaimerDefinition,
} from "@/lib/disclaimers";
import type {
  EnrollmentAcknowledgement,
  FormAcknowledgement,
} from "@/lib/schemas";

type AcknowledgementPanelProps = {
  disclaimer: DisclaimerDefinition;
  collectApplicationInfo?: boolean;
  defaultName?: string;
  existingAcknowledgement?: FormAcknowledgement | EnrollmentAcknowledgement | null;
  onCancel: () => void;
  onAcknowledge: (
    acknowledgement: FormAcknowledgement | EnrollmentAcknowledgement
  ) => void;
};

const inputClass =
  "w-full rounded-xl border border-gold/25 bg-white px-4 py-3 text-soil outline-none ring-green focus:ring-2";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function isEnrollmentAcknowledgement(
  value: FormAcknowledgement | EnrollmentAcknowledgement
): value is EnrollmentAcknowledgement {
  return "email" in value;
}

export function AcknowledgementPanel({
  disclaimer,
  collectApplicationInfo = false,
  defaultName = "",
  existingAcknowledgement,
  onCancel,
  onAcknowledge,
}: AcknowledgementPanelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const existingEnrollment =
    existingAcknowledgement && isEnrollmentAcknowledgement(existingAcknowledgement)
      ? existingAcknowledgement
      : null;

  const [signedName, setSignedName] = useState(
    existingAcknowledgement?.signedName ?? defaultName
  );
  const [signedDate, setSignedDate] = useState(
    existingAcknowledgement?.signedDate ?? todayIsoDate()
  );
  const [email, setEmail] = useState(existingEnrollment?.email ?? "");
  const [phone, setPhone] = useState(existingEnrollment?.phone ?? "");
  const [street, setStreet] = useState(existingEnrollment?.street ?? "");
  const [city, setCity] = useState(existingEnrollment?.city ?? "");
  const [state, setState] = useState(existingEnrollment?.state ?? "");
  const [zip, setZip] = useState(existingEnrollment?.zip ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    rootRef.current?.scrollIntoView({ block: "start" });
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = signedName.trim();
    if (trimmedName.length < 2) {
      setError("Please enter your printed name.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(signedDate)) {
      setError("Please enter a valid date.");
      return;
    }

    if (collectApplicationInfo) {
      const trimmedEmail = email.trim();
      const trimmedPhone = phone.trim();
      const trimmedStreet = street.trim();
      const trimmedCity = city.trim();
      const trimmedState = state.trim();
      const trimmedZip = zip.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (trimmedPhone.length < 10 || !/^[\d\s\-+()]+$/.test(trimmedPhone)) {
        setError("Please enter a valid phone number.");
        return;
      }
      if (trimmedStreet.length < 3) {
        setError("Please enter your street address.");
        return;
      }
      if (trimmedCity.length < 2) {
        setError("Please enter your city.");
        return;
      }
      if (trimmedState.length < 2) {
        setError("Please enter your state.");
        return;
      }
      if (!/^\d{5}(-\d{4})?$/.test(trimmedZip)) {
        setError("Please enter a valid ZIP code.");
        return;
      }

      onAcknowledge({
        signedName: trimmedName,
        signedDate,
        acknowledgedAt: new Date().toISOString(),
        email: trimmedEmail,
        phone: trimmedPhone,
        street: trimmedStreet,
        city: trimmedCity,
        state: trimmedState,
        zip: trimmedZip,
      });
      return;
    }

    onAcknowledge({
      signedName: trimmedName,
      signedDate,
      acknowledgedAt: new Date().toISOString(),
    });
  }

  return (
    <div
      ref={rootRef}
      className="mt-3 rounded-2xl border border-gold/20 bg-white shadow-sm"
      aria-labelledby="acknowledgement-panel-title"
    >
      <div className="border-b border-gold/15 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="acknowledgement-panel-title"
              className="font-serif text-2xl font-semibold text-soil"
            >
              {disclaimer.title}
            </h2>
            <p className="mt-1 text-sm text-soil/60">
              {collectApplicationInfo
                ? "Read the form below, enter your details, and sign with your printed name and date."
                : "Read the form below, then sign with your printed name and date."}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 rounded-full px-3 py-1 text-sm font-medium text-soil/60 hover:bg-cream hover:text-soil"
            aria-label="Close"
          >
            Close
          </button>
        </div>
        <a
          href={disclaimerDocumentUrl(disclaimer.documentFileName)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-medium text-green hover:underline"
        >
          Download original document (.docx)
        </a>
      </div>

      <div className="px-6 py-5">
        <div className="space-y-6 text-sm leading-relaxed text-soil/80">
          {disclaimer.sections.map((section) => (
            <section key={section.heading}>
              <h3 className="font-semibold text-soil">{section.heading}</h3>
              <div className="mt-2 space-y-2">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-xl border border-gold/20 bg-cream/40 p-4">
            <h3 className="font-semibold text-soil">Member Certification</h3>
            <div className="mt-2 space-y-2">
              {disclaimer.certification.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gold/15 bg-cream/30 px-6 py-4"
      >
        {collectApplicationInfo && (
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-soil">
                Full name
              </span>
              <input
                value={signedName}
                onChange={(event) => {
                  setSignedName(event.target.value);
                  setError(null);
                }}
                className={inputClass}
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-soil">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                className={inputClass}
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-soil">
                Phone
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setError(null);
                }}
                className={inputClass}
                autoComplete="tel"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-soil">
                Street address
              </span>
              <input
                value={street}
                onChange={(event) => {
                  setStreet(event.target.value);
                  setError(null);
                }}
                className={inputClass}
                autoComplete="street-address"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-soil">
                City
              </span>
              <input
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setError(null);
                }}
                className={inputClass}
                autoComplete="address-level2"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-soil">
                State
              </span>
              <input
                value={state}
                onChange={(event) => {
                  setState(event.target.value);
                  setError(null);
                }}
                className={inputClass}
                autoComplete="address-level1"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-soil">
                ZIP code
              </span>
              <input
                value={zip}
                onChange={(event) => {
                  setZip(event.target.value);
                  setError(null);
                }}
                className={inputClass}
                autoComplete="postal-code"
              />
            </label>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {!collectApplicationInfo && (
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-soil">
                Printed name
              </span>
              <input
                value={signedName}
                onChange={(event) => {
                  setSignedName(event.target.value);
                  setError(null);
                }}
                className={inputClass}
                autoComplete="name"
              />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-soil">
              Date
            </span>
            <input
              type="date"
              value={signedDate}
              onChange={(event) => {
                setSignedDate(event.target.value);
                setError(null);
              }}
              className={inputClass}
            />
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-white hover:bg-green/90"
          >
            I acknowledge and sign
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-gold/30 px-6 py-3 text-sm font-semibold text-soil hover:bg-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

type FormAcknowledgementRowProps = {
  label: string;
  acknowledged: boolean;
  signedName?: string;
  signedDate?: string;
  onOpen: () => void;
};

export function FormAcknowledgementRow({
  label,
  acknowledged,
  signedName,
  signedDate,
  onOpen,
}: FormAcknowledgementRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gold/15 bg-cream/30 p-4">
      <input
        type="checkbox"
        checked={acknowledged}
        readOnly
        aria-readonly="true"
        className="mt-1 h-4 w-4 rounded border-gold/40 text-green focus:ring-green"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-soil/80">{label}</p>
        {acknowledged && signedName && signedDate ? (
          <p className="mt-1 text-xs text-green">
            Signed by {signedName} on {signedDate}
          </p>
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="mt-2 text-sm font-semibold text-green hover:underline"
          >
            Read and sign →
          </button>
        )}
        {acknowledged && (
          <button
            type="button"
            onClick={onOpen}
            className="mt-1 block text-xs font-medium text-soil/50 hover:text-soil"
          >
            View signed form
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Confirm the new file typechecks**

Run from `web/`:

```bash
npx tsc --noEmit
```

Expected: exit code 0. `JoinForm` still imports `AcknowledgementModal` until Task 2; that existing import must still typecheck.

- [ ] **Step 3: Commit**

```bash
git add web/src/components/AcknowledgementPanel.tsx
git commit -m "Add inline acknowledgement panel so join forms can sign without a popup."
```

---

### Task 2: Wire JoinForm and delete the overlay

**Files:**
- Modify: `web/src/components/JoinForm.tsx`
- Delete: `web/src/components/AcknowledgementModal.tsx`

**Interfaces:**
- Consumes: `AcknowledgementPanel` and `FormAcknowledgementRow` from `./AcknowledgementPanel` (Task 1)
- Produces: `/join` Review & Sign expands at most one `AcknowledgementPanel` under its row; `handleAcknowledgement` still clears `openDisclaimer` after a successful sign; `membershipPayload()` and `ensureReadyToPay()` unchanged

- [ ] **Step 1: Point JoinForm at the inline panel**

In `web/src/components/JoinForm.tsx`, replace the import:

```tsx
import {
  AcknowledgementPanel,
  FormAcknowledgementRow,
} from "./AcknowledgementPanel";
```

Replace the “Required acknowledgements” block (the two `FormAcknowledgementRow`s) with this, so each panel renders under its row:

```tsx
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-soil">
              Required acknowledgements
            </p>
            <div>
              <FormAcknowledgementRow
                label="I have read and signed the HarvestLinx Member Compliance & Acknowledgement Form."
                acknowledged={Boolean(complianceAck)}
                signedName={complianceAck?.signedName}
                signedDate={complianceAck?.signedDate}
                onOpen={() => setOpenDisclaimer("compliance")}
              />
              {openDisclaimer === "compliance" && (
                <AcknowledgementPanel
                  disclaimer={MEMBERSHIP_DISCLAIMERS.compliance}
                  defaultName={
                    enrollmentAck?.signedName ?? complianceAck?.signedName
                  }
                  existingAcknowledgement={complianceAck}
                  onCancel={() => setOpenDisclaimer(null)}
                  onAcknowledge={(acknowledgement) =>
                    handleAcknowledgement("compliance", acknowledgement)
                  }
                />
              )}
            </div>
            <div>
              <FormAcknowledgementRow
                label="I have read and signed the HarvestLinx Membership Enrollment & Disclosure Form (includes your application details)."
                acknowledged={Boolean(enrollmentAck)}
                signedName={enrollmentAck?.signedName}
                signedDate={enrollmentAck?.signedDate}
                onOpen={() => setOpenDisclaimer("enrollmentDisclosure")}
              />
              {openDisclaimer === "enrollmentDisclosure" && (
                <AcknowledgementPanel
                  disclaimer={MEMBERSHIP_DISCLAIMERS.enrollmentDisclosure}
                  collectApplicationInfo
                  defaultName={
                    enrollmentAck?.signedName ?? complianceAck?.signedName
                  }
                  existingAcknowledgement={enrollmentAck}
                  onCancel={() => setOpenDisclaimer(null)}
                  onAcknowledge={(acknowledgement) =>
                    handleAcknowledgement("enrollmentDisclosure", acknowledgement)
                  }
                />
              )}
            </div>
          </div>
```

Delete the overlay mount at the bottom of the component (the `{openDisclaimer && (` … `AcknowledgementModal` … `)}` block). Leave `handleAcknowledgement` as it is; it already sets `setOpenDisclaimer(null)` after a successful sign.

- [ ] **Step 2: Delete the overlay file**

Delete `web/src/components/AcknowledgementModal.tsx`.

From the repo root, confirm nothing still imports it:

```bash
rg AcknowledgementModal web/src
```

Expected: no matches.

- [ ] **Step 3: Typecheck**

Run from `web/`:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 4: Manual verification**

Start the app from `web/` with `npm run dev`. On `/join`, continue to Review & Sign, then check:

1. **Read and sign** expands the compliance form in the page. No overlay/dialog appears.
2. The expanded form is readable by scrolling the page.
3. **Cancel** collapses the panel; the row is still unsigned.
4. A valid sign collapses the panel and shows “Signed by … on …”.
5. Opening the second form closes the first.
6. **View signed form** re-opens with the saved values.
7. Payment buttons still refuse until both forms are signed and terms are checked.
8. Repeat 1–4 in Safari (iPhone Safari if available) and Chrome or Edge.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/JoinForm.tsx
git add -u web/src/components/AcknowledgementModal.tsx
git commit -m "Show join acknowledgements inline so Safari can open and sign them."
```
