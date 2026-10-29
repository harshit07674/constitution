import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-paper)]">
      <MarketingNavbar />
      <main className="flex-1 py-16 px-6 max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-forest)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-3 border-b border-[var(--color-border)] pb-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-brass)]">
            TERMS
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-[var(--color-ink)]">
            Terms of Service
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            Last updated: October 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-[var(--color-ink)] leading-relaxed font-light">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
              1. Nature of the Product
            </h2>
            <p>
              Personal Constitution is a personal reflection, principles organization, and decision alignment tool. It is not a licensed medical, psychological, legal, or financial advisory product. All reflections, decisions, and written standards are authored and interpreted entirely by you.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
              2. Account Responsibility
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
              3. Service Continuity
            </h2>
            <p>
              We strive for continuous availability and dependable persistence. You can print and export your constitution at any time to preserve an offline physical record of your life charter.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

