"use client";

import { useState } from "react";
import { CERTIFICATE, SITE } from "@/lib/constants";

type Props = {
  name: string;
  referenceNumber: string;
  issueDate: string;
};

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

function buildCertificatePng(props: Props): string {
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
  ctx.fillText(SITE.legalName.toUpperCase(), centerX, 170);

  ctx.fillStyle = gold;
  ctx.font = "22px Georgia, serif";
  ctx.fillText("FOUNDING MEMBERSHIP CERTIFICATE", centerX, 215);

  ctx.fillStyle = soil;
  ctx.font = "bold 58px Georgia, serif";
  drawWrappedText(ctx, CERTIFICATE.title, centerX, 320, width - 260, 66);

  ctx.fillStyle = soil;
  ctx.font = "italic 26px Georgia, serif";
  ctx.fillText("This certifies that", centerX, 470);

  ctx.fillStyle = green;
  ctx.font = "bold 64px Georgia, serif";
  ctx.fillText(props.name, centerX, 555);

  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 260, 585);
  ctx.lineTo(centerX + 260, 585);
  ctx.stroke();

  ctx.fillStyle = soil;
  ctx.font = "30px Georgia, serif";
  drawWrappedText(ctx, CERTIFICATE.body, centerX, 660, width - 300, 42);

  ctx.fillStyle = green;
  ctx.font = "italic 28px Georgia, serif";
  drawWrappedText(ctx, CERTIFICATE.tagline, centerX, 800, width - 300, 40);

  ctx.fillStyle = soil;
  ctx.font = "bold 26px Georgia, serif";
  ctx.fillText(`Reference: ${props.referenceNumber}`, centerX, 960);
  ctx.font = "26px Georgia, serif";
  ctx.fillText(`Issued: ${props.issueDate}`, centerX, 1005);

  ctx.fillStyle = "#8a7a68";
  ctx.font = "20px Georgia, serif";
  drawWrappedText(ctx, CERTIFICATE.note, centerX, 1150, width - 320, 28);

  return canvas.toDataURL("image/png");
}

export function MembershipCertificate({ name, referenceNumber, issueDate }: Props) {
  const [downloadError, setDownloadError] = useState<string | null>(null);

  function handlePrint() {
    window.print();
  }

  function handleDownloadPng() {
    setDownloadError(null);
    try {
      const dataUrl = buildCertificatePng({ name, referenceNumber, issueDate });
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
            Founding Membership Certificate
          </p>
        </div>

        <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
          <h2 className="font-serif text-3xl font-bold text-soil sm:text-4xl">
            {CERTIFICATE.title}
          </h2>

          <p className="mt-6 text-sm italic text-soil/70">This certifies that</p>
          <p className="mt-2 font-serif text-3xl font-bold text-green sm:text-4xl">
            {name}
          </p>
          <div className="mx-auto mt-3 h-px w-48 bg-gold/60" />

          <p className="mx-auto mt-6 max-w-md text-base text-soil/80">
            {CERTIFICATE.body}
          </p>
          <p className="mx-auto mt-5 max-w-md font-serif text-lg italic text-green">
            {CERTIFICATE.tagline}
          </p>

          <div className="mt-8 flex flex-col items-center gap-1 text-sm text-soil">
            <p className="font-semibold">Reference: {referenceNumber}</p>
            <p>Issued: {issueDate}</p>
          </div>

          <p className="mx-auto mt-6 max-w-sm text-xs text-soil/50">
            {CERTIFICATE.note}
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
          onClick={handleDownloadPng}
          className="rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-white transition hover:bg-saffron/90"
        >
          Download PNG
        </button>
      </div>

      {downloadError && (
        <p className="no-print mt-3 text-center text-sm text-red-600">
          {downloadError}
        </p>
      )}
    </div>
  );
}
