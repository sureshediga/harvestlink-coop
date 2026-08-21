"use client";

import { useState } from "react";
import { CERTIFICATE, INVESTOR_CERTIFICATE, SITE } from "@/lib/constants";

type Props = {
  name: string;
  referenceNumber: string;
  issueDate: string;
  standingLabel?: string | null;
  statusLabel?: string;
  isActive?: boolean;
  qrDataUrl?: string;
  verifyUrl?: string;
  variant?: "membership" | "investment";
};

function copyFor(variant: Props["variant"]) {
  return variant === "investment" ? INVESTOR_CERTIFICATE : CERTIFICATE;
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = candidate;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

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

function drawStatusPill(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  isActive: boolean
) {
  ctx.font = "bold 22px Georgia, serif";
  const paddingX = 24;
  const textWidth = ctx.measureText(text).width;
  const w = textWidth + paddingX * 2;
  const h = 44;
  const x = centerX - w / 2;
  ctx.fillStyle = isActive ? "#2d6a4f" : "#f0dcae";
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y - h / 2, w, h, 22);
    ctx.fill();
  } else {
    ctx.fillRect(x, y - h / 2, w, h);
  }
  ctx.fillStyle = isActive ? "#faf7f2" : "#7a5a1f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, centerX, y + 1);
  ctx.textBaseline = "alphabetic";
}

async function buildCertificatePng(props: Props): Promise<string> {
  const copy = copyFor(props.variant);
  const width = 1080;
  const height = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const cream = "#faf7f2";
  const green = "#2d6a4f";
  const gold = "#d4a853";
  const soil = "#3d2b1f";
  const terracotta = "#c4704a";

  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = gold;
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, width - 80, height - 80);
  ctx.strokeStyle = green;
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 70, width - 140, height - 140);

  ctx.textAlign = "center";
  const centerX = width / 2;

  ctx.fillStyle = green;
  ctx.font = "600 30px Georgia, serif";
  ctx.fillText(SITE.legalName.toUpperCase(), centerX, 160);

  ctx.fillStyle = gold;
  ctx.font = "22px Georgia, serif";
  ctx.fillText(copy.eyebrow.toUpperCase(), centerX, 205);

  ctx.fillStyle = soil;
  ctx.font = "bold 56px Georgia, serif";
  drawWrappedText(ctx, copy.title, centerX, 300, width - 260, 62);

  ctx.fillStyle = soil;
  ctx.font = "italic 26px Georgia, serif";
  ctx.fillText("This certifies that", centerX, 440);

  ctx.fillStyle = green;
  ctx.font = "bold 62px Georgia, serif";
  ctx.fillText(props.name, centerX, 520);

  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 260, 550);
  ctx.lineTo(centerX + 260, 550);
  ctx.stroke();

  if (props.standingLabel) {
    ctx.fillStyle = terracotta;
    ctx.font = "bold 32px Georgia, serif";
    ctx.fillText(props.standingLabel, centerX, 600);
  }

  ctx.fillStyle = soil;
  ctx.font = "28px Georgia, serif";
  drawWrappedText(ctx, copy.body, centerX, 660, width - 320, 40);

  ctx.fillStyle = green;
  ctx.font = "italic 26px Georgia, serif";
  drawWrappedText(ctx, copy.tagline, centerX, 760, width - 320, 38);

  ctx.fillStyle = soil;
  ctx.font = "bold 24px Georgia, serif";
  ctx.fillText(`Reference: ${props.referenceNumber}`, centerX, 862);
  ctx.font = "22px Georgia, serif";
  ctx.fillText(`Issued: ${props.issueDate}`, centerX, 898);

  if (props.statusLabel) {
    drawStatusPill(
      ctx,
      props.statusLabel.toUpperCase(),
      centerX,
      948,
      Boolean(props.isActive)
    );
  }

  if (props.qrDataUrl) {
    try {
      const qr = await loadImage(props.qrDataUrl);
      const qrSize = 150;
      ctx.drawImage(qr, centerX - qrSize / 2, 1000, qrSize, qrSize);
      ctx.fillStyle = "#8a7a68";
      ctx.font = "18px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("Scan to verify authenticity", centerX, 1180);
    } catch {
      // QR is best-effort; skip if it fails to load.
    }
  }

  return canvas.toDataURL("image/png");
}

export function MembershipCertificate({
  name,
  referenceNumber,
  issueDate,
  standingLabel,
  statusLabel,
  isActive,
  qrDataUrl,
  verifyUrl,
  variant = "membership",
}: Props) {
  const copy = copyFor(variant);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  function handlePrint() {
    document.body.classList.remove("printing-idcard");
    window.print();
  }

  async function handleDownloadPng() {
    setDownloadError(null);
    setDownloading(true);
    try {
      const dataUrl = await buildCertificatePng({
        name,
        referenceNumber,
        issueDate,
        standingLabel,
        statusLabel,
        isActive,
        qrDataUrl,
        variant,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `harvestlinx-certificate-${referenceNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Certificate PNG download failed:", error);
      setDownloadError(
        "Couldn't generate the image. You can still use Print / Save as PDF."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="certificate-print">
      <div className="overflow-hidden rounded-2xl border-4 border-gold/60 bg-cream shadow-sm">
        <div className="border-b-2 border-gold/40 bg-white/60 px-6 py-4 text-center">
          <p className="font-serif text-sm font-semibold uppercase tracking-widest text-green">
            {SITE.legalName}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gold">
            {copy.eyebrow}
          </p>
        </div>

        <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
          <h2 className="font-serif text-3xl font-bold text-soil sm:text-4xl">
            {copy.title}
          </h2>

          <p className="mt-6 text-sm italic text-soil/70">This certifies that</p>
          <p className="mt-2 font-serif text-3xl font-bold text-green sm:text-4xl">
            {name}
          </p>
          {standingLabel && (
            <p className="mt-2 font-serif text-lg font-semibold text-terracotta">
              {standingLabel}
            </p>
          )}
          <div className="mx-auto mt-3 h-px w-48 bg-gold/60" />

          <p className="mx-auto mt-6 max-w-md text-base text-soil/80">
            {copy.body}
          </p>
          <p className="mx-auto mt-5 max-w-md font-serif text-lg italic text-green">
            {copy.tagline}
          </p>

          <div className="mt-8 flex flex-col items-center gap-1 text-sm text-soil">
            <p className="font-semibold">Reference: {referenceNumber}</p>
            <p>Issued: {issueDate}</p>
          </div>

          {statusLabel && (
            <span
              className={`mt-5 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
                isActive
                  ? "bg-green/15 text-green"
                  : "bg-gold/20 text-[#7a5a1f]"
              }`}
            >
              {statusLabel}
            </span>
          )}

          {qrDataUrl && (
            <div className="mt-6 flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Verification QR code"
                className="h-28 w-28"
                width={112}
                height={112}
              />
              <p className="mt-2 text-xs text-soil/50">
                Scan to verify authenticity
              </p>
            </div>
          )}

          <p className="mx-auto mt-6 max-w-sm text-xs text-soil/50">
            {copy.note}
          </p>
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
          Verify this certificate at{" "}
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
