"use client";

import { useEffect, useState } from "react";
import {
  disclaimerDocumentUrl,
  type DisclaimerDefinition,
} from "@/lib/disclaimers";
import type { FormAcknowledgement } from "@/lib/schemas";

type AcknowledgementModalProps = {
  disclaimer: DisclaimerDefinition;
  defaultName?: string;
  existingAcknowledgement?: FormAcknowledgement | null;
  onClose: () => void;
  onAcknowledge: (acknowledgement: FormAcknowledgement) => void;
};

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AcknowledgementModal({
  disclaimer,
  defaultName = "",
  existingAcknowledgement,
  onClose,
  onAcknowledge,
}: AcknowledgementModalProps) {
  const [signedName, setSignedName] = useState(
    existingAcknowledgement?.signedName ?? defaultName
  );
  const [signedDate, setSignedDate] = useState(
    existingAcknowledgement?.signedDate ?? todayIsoDate()
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

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

    onAcknowledge({
      signedName: trimmedName,
      signedDate,
      acknowledgedAt: new Date().toISOString(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-soil/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="acknowledgement-modal-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-gold/15 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="acknowledgement-modal-title"
                className="font-serif text-2xl font-semibold text-soil"
              >
                {disclaimer.title}
              </h2>
              <p className="mt-1 text-sm text-soil/60">
                Read the form below, then sign with your printed name and date.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-3 py-1 text-sm font-medium text-soil/60 hover:bg-cream hover:text-soil"
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

        <div className="flex-1 overflow-y-auto px-6 py-5">
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
          <div className="grid gap-4 sm:grid-cols-2">
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
                className="w-full rounded-xl border border-gold/25 bg-white px-4 py-3 text-soil outline-none ring-green focus:ring-2"
                autoComplete="name"
              />
            </label>
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
                className="w-full rounded-xl border border-gold/25 bg-white px-4 py-3 text-soil outline-none ring-green focus:ring-2"
              />
            </label>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-white hover:bg-green/90"
            >
              I acknowledge and sign
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gold/30 px-6 py-3 text-sm font-semibold text-soil hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
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
            Read and sign in popup →
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
