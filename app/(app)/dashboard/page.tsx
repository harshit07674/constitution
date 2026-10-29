import React from "react";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getActiveOrFirstConstitution } from "@/lib/services/constitution-service";
import { getUserDecisions } from "@/lib/services/decisions-service";
import { getUserReflections } from "@/lib/services/reflections-service";
import {
  Scroll,
  Plus,
  ArrowRight,
  Printer,
  Edit3,
  Scale,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function DashboardPage() {
  const user = await requireUser();
  const constitution = await getActiveOrFirstConstitution(user.userId);
  const recentDecisions = await getUserDecisions(user.userId);
  const recentReflections = await getUserReflections(user.userId);

  // Time-appropriate thoughtful greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[1100px] mx-auto w-full space-y-10">
      {/* Header Greeting */}
      <div className="space-y-2 border-b border-[var(--color-border)] pb-8">
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-brass)]">
          PERSONAL DESK
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-[var(--color-ink)]">
          {getGreeting()}, {user.name}.
        </h1>
        <p className="text-sm text-[var(--color-muted)] max-w-xl font-light">
          &ldquo;What we do now echoes in who we become. Review your standards before the world demands your compromise.&rdquo;
        </p>
      </div>

      {/* Constitution Status Card */}
      {constitution ? (
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-forest)]">
                  ACTIVE CONSTITUTION
                </span>
                <Badge variant={constitution.status === "ACTIVE" ? "forest" : "outline"}>
                  {constitution.status}
                </Badge>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-ink)] mt-1">
                {constitution.title}
              </h2>
              {constitution.subtitle && (
                <p className="text-xs text-[var(--color-muted)] italic font-serif mt-0.5">
                  &ldquo;{constitution.subtitle}&rdquo;
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/constitution/${constitution.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit3 className="w-3.5 h-3.5 mr-1" />
                  Continue writing
                </Button>
              </Link>
              <Link href={`/constitution/${constitution.id}/document`}>
                <Button variant="primary" size="sm">
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Preview document
                </Button>
              </Link>
            </div>
          </div>

          {/* Counts and Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1 p-4 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm">
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                Core Values
              </span>
              <div className="font-serif text-3xl font-semibold text-[var(--color-forest)]">
                {constitution._count.values}
              </div>
              <p className="text-[11px] text-[var(--color-muted)]">
                Governing virtues defined
              </p>
            </div>

            <div className="space-y-1 p-4 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm">
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                Principles
              </span>
              <div className="font-serif text-3xl font-semibold text-[var(--color-forest)]">
                {constitution._count.principles}
              </div>
              <p className="text-[11px] text-[var(--color-muted)]">
                Specific behavioral rules
              </p>
            </div>

            <div className="space-y-1 p-4 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm">
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                Boundaries
              </span>
              <div className="font-serif text-3xl font-semibold text-[var(--color-forest)]">
                {constitution._count.boundaries}
              </div>
              <p className="text-[11px] text-[var(--color-muted)]">
                Non-negotiable life limits
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--color-muted)] pt-2">
            <span>
              Last amended {new Date(constitution.updatedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <Link
              href={`/constitution/${constitution.id}`}
              className="text-[var(--color-forest)] hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>View full charter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-forest)]/10 text-[var(--color-forest)] mx-auto flex items-center justify-center">
            <Scroll className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
            No constitution created yet
          </h2>
          <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
            You haven&apos;t ratified your personal constitution. Take a few quiet moments to establish what you stand for.
          </p>
          <div className="pt-2">
            <Link href="/onboarding">
              <Button size="md">
                <Plus className="w-4 h-4 mr-1.5" />
                Begin Guided Setup
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Decision Journal & Reflections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Decisions */}
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[var(--color-forest)]" />
              <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                Decision Journal
              </h3>
            </div>
            <Link href="/decisions/new">
              <Button variant="ghost" size="sm" className="text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Record Decision
              </Button>
            </Link>
          </div>

          {recentDecisions.length > 0 ? (
            <div className="space-y-3">
              {recentDecisions.slice(0, 3).map((dec) => (
                <Link
                  key={dec.id}
                  href={`/decisions/${dec.id}`}
                  className="block p-3 rounded bg-[var(--color-paper)] border border-[var(--color-border)] hover:border-[var(--color-forest)]/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-1">
                    <span className="font-semibold text-[var(--color-forest)]">{dec.domain}</span>
                    <span>{new Date(dec.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-[var(--color-ink)]">
                    {dec.title}
                  </h4>
                  <p className="text-xs text-[var(--color-muted)] line-clamp-1 mt-1 font-light">
                    {dec.context}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <p className="text-xs text-[var(--color-muted)]">
                No recent decisions recorded.
              </p>
              <p className="text-[11px] text-[var(--color-muted)] max-w-xs mx-auto">
                When facing complex choices, align your options with your written constitution.
              </p>
            </div>
          )}
        </div>

        {/* Weekly Reflection */}
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[var(--color-forest)]" />
              <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                Weekly Reflection
              </h3>
            </div>
            <Link href="/reflections">
              <Button variant="ghost" size="sm" className="text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Reflect
              </Button>
            </Link>
          </div>

          {recentReflections.length > 0 ? (
            <div className="space-y-3">
              {recentReflections.slice(0, 2).map((ref) => (
                <div
                  key={ref.id}
                  className="p-3 rounded bg-[var(--color-paper)] border border-[var(--color-border)] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                    <span className="font-serif font-semibold text-[var(--color-ink)]">
                      Review of {new Date(ref.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-forest)]" />
                  </div>
                  <p className="text-xs text-[var(--color-ink)] line-clamp-2 italic font-serif">
                    &ldquo;{ref.wentWell}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <p className="text-xs text-[var(--color-muted)]">
                No reflections recorded yet.
              </p>
              <p className="text-[11px] text-[var(--color-muted)] max-w-xs mx-auto">
                Revisit how your week aligned with the principles you swore to uphold.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

