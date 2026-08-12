"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";

type Props = {
  name: string;
  memberId: string;
  memberSince: string;
  type: string;
  statusLabel?: string;
  isActive?: boolean;
  qrDataUrl?: string;
  verifyUrl?: string;
};

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = src;
  if (typeof img.decode === "function") {
    await img.decode();
  } else {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("QR image failed to load"));
    });
  }
  return img;
}

async function buildIdCardPng(props: Props): Promise<string> {
  const width = 1000;
  const height = 630;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const cream = "#faf7f2";
  const green = "#2d6a4f";
  const gold = "#d4a853";
  const soil = "#3d2b1f";
  const label = "#8a7a68";

  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = gold;
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.fillStyle = green;
  ctx.fillRect(20, 20, width - 40, 130);

  ctx.textAlign = "left";
  ctx.fillStyle = cream;
  ctx.font = "bold 36px Georgia, serif";
  ctx.fillText(SITE.legalName.toUpperCase(), 55, 80);
  ctx.fillStyle = gold;
  ctx.font = "bold 22px Georgia, serif";
  ctx.fillText("MEMBER ID CARD", 55, 118);

  const drawField = (
    labelText: string,
    valueText: string,
    x: number,
    y: number,
    valueColor: string,
    valueSize = 34
  ) => {
    ctx.fillStyle = label;
    ctx.font = "bold 20px Georgia, serif";
    ctx.fillText(labelText, x, y);
    ctx.fillStyle = valueColor;
    ctx.font = `bold ${valueSize}px Georgia, serif`;
    ctx.fillText(valueText, x, y + 42);
  };

  drawField("NAME", props.name, 55, 220, soil, 40);
  drawField("MEMBER ID", props.memberId, 55, 345, green, 30);
  drawField("TYPE", props.type, 460, 345, soil, 30);
  drawField("MEMBER SINCE", props.memberSince, 55, 470, soil, 28);
  if (props.statusLabel) {
    drawField(
      "STATUS",
      props.statusLabel,
      460,
      470,
      props.isActive ? green : "#b7791f",
      28
    );
  }

  if (props.qrDataUrl) {
    try {
      const qr = await loadImage(props.qrDataUrl);
      const qrSize = 150;
      ctx.drawImage(qr, width - qrSize - 55, 175, qrSize, qrSize);
      ctx.fillStyle = label;
      ctx.font = "16px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("Scan to verify", width - 55 - qrSize / 2, 345);
      ctx.textAlign = "left";
    } catch {
      // QR is best-effort; skip if it fails to load.
    }
  }

  return canvas.toDataURL("image/png");
}

export function MemberIdCard({
  name,
  memberId,
  memberSince,
  type,
  statusLabel,
  isActive,
  qrDataUrl,
  verifyUrl,
}: Props) {
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  function handlePrint() {
    document.body.classList.add("printing-idcard");
    const cleanup = () => {
      document.body.classList.remove("printing-idcard");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  async function handleDownloadPng() {
    setDownloadError(null);
    setDownloading(true);
    try {
      const dataUrl = await buildIdCardPng({
        name,
        memberId,
        memberSince,
        type,
        statusLabel,
        isActive,
        qrDataUrl,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `harvestlinx-member-id-${memberId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Member ID PNG download failed:", error);
      setDownloadError(
        "Couldn't generate the image. You can still use Print / Save as PDF."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="idcard-print">
      <div className="overflow-hidden rounded-2xl border border-gold/40 bg-cream shadow-sm">
        <div className="flex items-center justify-between bg-green px-6 py-4">
          <p className="font-serif text-sm font-bold uppercase tracking-widest text-cream">
            {SITE.legalName}
          </p>
          <p className="font-serif text-xs font-bold uppercase tracking-widest text-gold">
            Member ID Card
          </p>
        </div>

        <div className="flex items-start justify-between gap-4 px-6 py-7 sm:px-8">
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-5">
            <div className="col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-soil/50">
                Name
              </p>
              <p className="mt-1 font-serif text-2xl font-bold text-soil">
                {name}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-soil/50">
                Member ID
              </p>
              <p className="mt-1 font-serif text-lg font-bold text-green">
                {memberId}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-soil/50">
                Type
              </p>
              <p className="mt-1 font-serif text-lg font-bold text-soil">
                {type}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-soil/50">
                Member since
              </p>
              <p className="mt-1 font-serif text-lg font-semibold text-soil">
                {memberSince}
              </p>
            </div>
            {statusLabel && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-soil/50">
                  Status
                </p>
                <p
                  className={`mt-1 font-serif text-lg font-bold ${
                    isActive ? "text-green" : "text-[#b7791f]"
                  }`}
                >
                  {statusLabel}
                </p>
              </div>
            )}
          </div>

          {qrDataUrl && (
            <div className="flex shrink-0 flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Verification QR code"
                className="h-24 w-24"
                width={96}
                height={96}
              />
              <p className="mt-1 text-[10px] text-soil/50">Scan to verify</p>
            </div>
          )}
        </div>
      </div>

      <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-full border border-green/40 bg-white px-6 py-3 text-sm font-semibold text-green transition hover:bg-green/5"
        >
          Print / Save as PDF
        </button>
        <button
          type="button"
          disabled={downloading}
          onClick={handleDownloadPng}
          className="rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-white transition hover:bg-saffron/90 disabled:opacity-60"
        >
          {downloading ? "Preparing…" : "Download PNG"}
        </button>
      </div>

      {verifyUrl && (
        <p className="no-print mt-3 text-center text-xs text-soil/60">
          Verify this ID at{" "}
          <a href={verifyUrl} className="font-semibold text-green hover:underline">
            {SITE.name}/verify
          </a>
        </p>
      )}

      {downloadError && (
        <p className="no-print mt-3 text-center text-sm text-red-600">
          {downloadError}
        </p>
      )}
    </div>
  );
}
