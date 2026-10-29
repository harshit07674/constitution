import React from "react";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getUserDecisions } from "@/lib/services/decisions-service";
import { getActiveOrFirstConstitution } from "@/lib/services/constitution-service";
import { Scale, Plus, Calendar, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function DecisionsPage() {
  const user = await requireUser();
  const constitution = await getActiveOrFirstConstitution(user.userId);
  const decisions = await getUserDecisions(user.userId);

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[1000px] mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-brass)]">
            DECISION ALIGNMENT
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[var(--color-ink)] mt-1">
            Decision Journal
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Weigh complex crossroads and dilemmas against your written principles.
          </p>
        </div>

        <Link href="/decisions/new">
          <Button size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Record Decision
          </Button>
        </Link>
      </div>

      {decisions.length > 0 ? (
        <div className="space-y-4">
          {decisions.map((dec) => (
            <Link
              key={dec.id}
              href={`/decisions/${dec.id}`}
              className="block bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-forest)] transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)]/60 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="sage">{dec.domain}</Badge>
                  <h3 className="font-serif text-xl font-bold text-[var(--color-ink)] group-hover:text-[var(--color-forest)] transition-colors">
                    {dec.title}
                  </h3>
                </div>
                <span className="text-xs text-[var(--color-muted)]">
                  {new Date(dec.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <p className="text-xs text-[var(--color-muted)] leading-relaxed font-light line-clamp-2">
                {dec.context}
              </p>

              {dec.reflection && (
                <div className="mt-3 p-3 bg-[var(--color-paper)] border-l-2 border-[var(--color-forest)] text-xs text-[var(--color-ink)] italic font-serif">
                  &ldquo;{dec.reflection}&rdquo;
                </div>
              )}

              {dec.values.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[var(--color-border)]/40">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] mr-1">
                    Related Virtues:
                  </span>
                  {dec.values.map((v) => (
                    <span
                      key={v.value.id}
                      className="text-[10px] bg-[var(--color-surface-secondary)] text-[var(--color-forest)] px-2 py-0.5 rounded font-medium"
                    >
                      {v.value.name}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-forest)]/10 text-[var(--color-forest)] mx-auto flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
            No decision entries yet
          </h2>
          <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
            Use this space whenever facing a meaningful choice—evaluating career moves, personal boundaries, or commitments against your written charter.
          </p>
          <div className="pt-2">
            <Link href="/decisions/new">
              <Button size="sm">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Record First Decision
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

