"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";

type Props = {
  name: string;
  memberId: string;
  memberSince: string;
  type: string;
};

function buildIdCardPng(props: Props): string {
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

  drawField("NAME", props.name, 55, 230, soil, 42);
  drawField("MEMBER ID", props.memberId, 55, 360, green, 32);
  drawField("TYPE", props.type, 540, 360, soil, 32);
  drawField("MEMBER SINCE", props.memberSince, 55, 490, soil, 30);

  return canvas.toDataURL("image/png");
}

export function MemberIdCard({ name, memberId, memberSince, type }: Props) {
  const [downloadError, setDownloadError] = useState<string | null>(null);

  function handlePrint() {
    document.body.classList.add("printing-idcard");
    const cleanup = () => {
      document.body.classList.remove("printing-idcard");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  function handleDownloadPng() {
    setDownloadError(null);
    try {
      const dataUrl = buildIdCardPng({ name, memberId, memberSince, type });
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

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 px-6 py-7 sm:px-8">
          <div className="col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-soil/50">
              Name
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-soil">{name}</p>
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
            <p className="mt-1 font-serif text-lg font-bold text-soil">{type}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-soil/50">
              Member since
            </p>
            <p className="mt-1 font-serif text-lg font-semibold text-soil">
              {memberSince}
            </p>
          </div>
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
