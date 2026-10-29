import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getConstitutionDetails } from "@/lib/services/constitution-service";
import {
  Printer,
  Edit3,
  Calendar,
  History,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function ConstitutionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  let constitution;
  try {
    constitution = await getConstitutionDetails(user.userId, id);
  } catch {
    notFound();
  }

  // Group principles by category
  const principlesByCategory: Record<string, typeof constitution.principles> = {};
  for (const p of constitution.principles) {
    const cat = p.category || "General Principles";
    if (!principlesByCategory[cat]) principlesByCategory[cat] = [];
    principlesByCategory[cat].push(p);
  }

  // Group boundaries by domain
  const boundariesByDomain: Record<string, typeof constitution.boundaries> = {};
  for (const b of constitution.boundaries) {
    const dom = b.domain || "General Limits";
    if (!boundariesByDomain[dom]) boundariesByDomain[dom] = [];
    boundariesByDomain[dom].push(b);
  }

  // Roman numerals helper for articles
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[1000px] mx-auto w-full space-y-10">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <Link href="/dashboard" className="hover:text-[var(--color-forest)]">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-medium">Constitution</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[var(--color-ink)] mt-1">
            {constitution.title}
          </h1>
          {constitution.subtitle && (
            <p className="font-serif italic text-sm text-[var(--color-muted)] mt-0.5">
              &ldquo;{constitution.subtitle}&rdquo;
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/constitution/${constitution.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              Edit charter
            </Button>
          </Link>
          <Link href={`/constitution/${constitution.id}/document`}>
            <Button variant="primary" size="sm">
              <Printer className="w-3.5 h-3.5 mr-1" />
              Document view
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Metadata Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm text-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
            Status
          </span>
          <Badge variant={constitution.status === "ACTIVE" ? "forest" : "outline"} className="mt-1">
            {constitution.status}
          </Badge>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
            Established
          </span>
          <span className="font-medium text-[var(--color-ink)] mt-1 block">
            {constitution.establishedAt
              ? new Date(constitution.establishedAt).toLocaleDateString(undefined, { year: "numeric", month: "short" })
              : "Ongoing"}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
            Articles
          </span>
          <span className="font-medium text-[var(--color-ink)] mt-1 block">
            {Object.keys(principlesByCategory).length} categories
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
            Snapshots
          </span>
          <Link href="/versions" className="font-medium text-[var(--color-forest)] mt-1 block hover:underline">
            {constitution.versions.length} versions
          </Link>
        </div>
      </div>

      {/* Preamble & Mission Statement */}
      {(constitution.preamble || constitution.missionStatement) && (
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 md:p-8 space-y-6">
          {constitution.preamble && (
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-semibold text-[var(--color-forest)] uppercase tracking-wider text-xs">
                Preamble
              </h3>
              <p className="font-serif italic text-base md:text-lg text-[var(--color-ink)]/90 leading-relaxed pl-4 border-l-2 border-[var(--color-brass)]">
                &ldquo;{constitution.preamble}&rdquo;
              </p>
            </div>
          )}

          {constitution.missionStatement && (
            <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
              <h3 className="font-serif text-lg font-semibold text-[var(--color-forest)] uppercase tracking-wider text-xs">
                Mission Statement
              </h3>
              <p className="text-sm text-[var(--color-ink)] leading-relaxed font-light">
                {constitution.missionStatement}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Core Values Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--color-forest)]" />
            <span>Ratified Values</span>
          </h2>
          <span className="text-xs text-[var(--color-muted)]">
            {constitution.values.length} virtues
          </span>
        </div>

        {constitution.values.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {constitution.values.map((v, idx) => (
              <div
                key={v.value.id}
                className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xs font-semibold text-[var(--color-brass)]">
                    0{idx + 1}.
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                    {v.value.name}
                  </h3>
                  {v.value.isSystem ? (
                    <span className="text-[10px] text-[var(--color-muted)] bg-[var(--color-surface-secondary)] px-1.5 py-0.5 rounded">
                      Curated
                    </span>
                  ) : (
                    <span className="text-[10px] text-[var(--color-forest)] bg-[var(--color-forest)]/10 px-1.5 py-0.5 rounded">
                      Custom
                    </span>
                  )}
                </div>
                {v.value.description && (
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    {v.value.description}
                  </p>
                )}
                {v.personalNote && (
                  <p className="text-xs text-[var(--color-forest)] italic pt-1 border-t border-[var(--color-border)]/50">
                    Personal note: {v.personalNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-muted)]">
            No values assigned yet. Click &quot;Edit charter&quot; to select core virtues.
          </div>
        )}
      </div>

      {/* Governing Articles & Principles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--color-forest)]" />
            <span>Articles & Principles</span>
          </h2>
          <span className="text-xs text-[var(--color-muted)]">
            {constitution.principles.length} principles
          </span>
        </div>

        {Object.keys(principlesByCategory).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(principlesByCategory).map(([category, principles], catIdx) => (
              <div
                key={category}
                className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 md:p-8 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-brass)] font-semibold">
                      ARTICLE {romanNumerals[catIdx] || catIdx + 1}
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
                      On {category}
                    </h3>
                  </div>
                  <Badge variant="sage">{principles.length} commitments</Badge>
                </div>

                <div className="space-y-4 pt-2">
                  {principles.map((p, pIdx) => (
                    <div
                      key={p.id}
                      className="p-4 bg-[var(--color-paper)] border-l-2 border-[var(--color-forest)] space-y-1"
                    >
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-semibold">
                        <span>SECTION {pIdx + 1}</span>
                      </div>
                      <h4 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                        {p.title}
                      </h4>
                      <p className="text-xs text-[var(--color-ink)]/90 leading-relaxed font-light">
                        {p.statement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-muted)]">
            No principles written yet.
          </div>
        )}
      </div>

      {/* Non-Negotiable Boundaries */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--color-brass)]" />
            <span>Personal Boundaries</span>
          </h2>
          <span className="text-xs text-[var(--color-muted)]">
            {constitution.boundaries.length} limits
          </span>
        </div>

        {Object.keys(boundariesByDomain).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {constitution.boundaries.map((b) => (
              <div
                key={b.id}
                className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                    {b.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] bg-[var(--color-surface-secondary)] px-2 py-0.5 rounded">
                    {b.domain}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-muted)]">
            No boundaries defined yet.
          </div>
        )}
      </div>
    </div>
  );
}

