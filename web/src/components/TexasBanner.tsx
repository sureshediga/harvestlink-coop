"use client";

import { useEffect, useState } from "react";

export function TexasBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("texas-banner-dismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="bg-green text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <p className="text-sm font-medium">
          Opening Soon in Texas — Shipments from India are in transit
        </p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem("texas-banner-dismissed", "1");
            setVisible(false);
          }}
          className="shrink-0 rounded px-2 py-1 text-sm text-cream/80 hover:bg-white/10"
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
