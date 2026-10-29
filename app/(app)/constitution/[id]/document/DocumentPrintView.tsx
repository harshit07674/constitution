"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DocumentPrintViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constitution: any;
  userName: string;
}

export const DocumentPrintView: React.FC<DocumentPrintViewProps> = ({
  constitution,
  userName,
}) => {
  const handlePrint = () => {
    window.print();
  };

  // Group principles by category into Roman-numeral articles
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const principlesByCategory: Record<string, any[]> = {};
  for (const p of constitution.principles) {
    const cat = p.category || "General Commitments";
    if (!principlesByCategory[cat]) principlesByCategory[cat] = [];
    principlesByCategory[cat].push(p);
  }

  // Group boundaries by domain
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boundariesByDomain: Record<string, any[]> = {};
  for (const b of constitution.boundaries) {
    const dom = b.domain || "General Limits";
    if (!boundariesByDomain[dom]) boundariesByDomain[dom] = [];
    boundariesByDomain[dom].push(b);
  }

  const establishedDateString = constitution.establishedAt
    ? new Date(constitution.establishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unrecorded";

  return (
    <div className="flex-1 bg-[var(--color-paper)] p-4 sm:p-8 md:p-12 overflow-y-auto">
      {/* Action Bar (Hidden in Print) */}
      <div className="no-print max-w-[850px] mx-auto mb-8 flex items-center justify-between">
        <Link
          href={`/constitution/${constitution.id}`}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-forest)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to workspace</span>
        </Link>

        <Button onClick={handlePrint} size="sm" className="shadow-xs">
          <Printer className="w-4 h-4 mr-1.5" />
          <span>Print / Save as PDF</span>
        </Button>
      </div>

      {/* The Printable Document Sheet */}
      <article className="document-sheet max-w-[850px] mx-auto bg-white border border-[var(--color-border)] p-10 sm:p-16 md:p-20 shadow-sm space-y-12 text-[#1c1f1b]">
        {/* Document Header */}
        <header className="text-center space-y-3 pb-8 border-b-2 border-[#1c1f1b]">
          <div className="text-[11px] tracking-[0.3em] uppercase text-[#64745A] font-semibold">
            OFFICIAL PERSONAL CHARTER
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1c1f1b] uppercase">
            {constitution.title}
          </h1>
          {constitution.subtitle && (
            <p className="font-serif italic text-base text-[#555555]">
              &ldquo;{constitution.subtitle}&rdquo;
            </p>
          )}
          <div className="text-[11px] text-[#777777] uppercase tracking-wider pt-2">
            RATIFIED BY {userName.toUpperCase()} &bull; ESTABLISHED {establishedDateString.toUpperCase()}
          </div>
        </header>

        {/* Preamble */}
        {constitution.preamble && (
          <section className="print-avoid-break space-y-2 py-4 border-b border-[#dddddd]">
            <h2 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#64745A]">
              PREAMBLE
            </h2>
            <p className="font-serif italic text-base sm:text-lg leading-relaxed text-[#222222]">
              &ldquo;{constitution.preamble}&rdquo;
            </p>
          </section>
        )}

        {/* Mission Statement */}
        {constitution.missionStatement && (
          <section className="print-avoid-break space-y-2 py-4 border-b border-[#dddddd]">
            <h2 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#64745A]">
              PURPOSE & MISSION
            </h2>
            <p className="text-sm leading-relaxed text-[#333333] font-light">
              {constitution.missionStatement}
            </p>
          </section>
        )}

        {/* Core Values */}
        {constitution.values.length > 0 && (
          <section className="print-avoid-break space-y-4 py-4 border-b border-[#dddddd]">
            <h2 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#64745A]">
              FOUNDATIONAL VIRTUES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {constitution.values.map((v: any, idx: number) => (
                <div key={v.value.id} className="space-y-1">
                  <div className="font-serif text-sm font-bold text-[#1c1f1b] flex items-center gap-1.5">
                    <span>{idx + 1}.</span>
                    <span>{v.value.name}</span>
                  </div>
                  {v.value.description && (
                    <p className="text-xs text-[#555555] leading-relaxed">
                      {v.value.description}
                    </p>
                  )}
                  {v.personalNote && (
                    <p className="text-xs text-[#354A3A] italic">
                      Note: {v.personalNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Articles & Principles */}
        <section className="space-y-8">
          <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#64745A]">
            ARTICLES OF CONDUCT
          </div>

          {Object.entries(principlesByCategory).map(([category, principles], catIdx) => (
            <article key={category} className="print-avoid-break space-y-4">
              <div className="border-b border-[#222222] pb-1 flex items-baseline justify-between">
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-[#1c1f1b]">
                  ARTICLE {romanNumerals[catIdx] || catIdx + 1} &mdash; ON {category.toUpperCase()}
                </h3>
              </div>

              <div className="space-y-4 pl-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {principles.map((p: any, pIdx: number) => (
                  <div key={p.id} className="space-y-0.5">
                    <h4 className="font-serif text-sm font-semibold text-[#1c1f1b]">
                      Section {pIdx + 1}. {p.title}
                    </h4>
                    <p className="text-xs text-[#333333] leading-relaxed font-light pl-3 border-l border-[#cccccc]">
                      {p.statement}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* Boundaries */}
        {constitution.boundaries.length > 0 && (
          <section className="print-avoid-break space-y-6 pt-4 border-t border-[#dddddd]">
            <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#64745A]">
              NON-NEGOTIABLE BOUNDARIES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {constitution.boundaries.map((b: any) => (
                <div key={b.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#1c1f1b]">
                      {b.title}
                    </span>
                    <span className="text-[10px] uppercase text-[#777777]">
                      [{b.domain}]
                    </span>
                  </div>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Restrained Signature Line */}
        <footer className="print-avoid-break pt-16 border-t border-[#1c1f1b] mt-16 flex items-end justify-between text-xs text-[#555555]">
          <div className="space-y-1">
            <p className="font-serif italic text-xs">
              Affirmed and sworn in personal conviction:
            </p>
            <p className="font-serif text-lg font-semibold text-[#1c1f1b] pt-2">
              {userName}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="w-48 border-b border-[#222222] pb-1" />
            <span className="text-[10px] uppercase tracking-wider text-[#888888]">
              SIGNATURE / DATE
            </span>
          </div>
        </footer>
      </article>
    </div>
  );
};

