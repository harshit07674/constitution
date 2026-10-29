import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

export default function PrivacyPage() {
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
            TRANSPARENCY
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-[var(--color-ink)]">
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            Last updated: October 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-[var(--color-ink)] leading-relaxed font-light">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
              1. Our Stance on Privacy
            </h2>
            <p>
              Personal Constitution is built as an intimate, private workspace for intentional reflection. We do not operate a social network, we do not broadcast feeds, and we do not monetize your personal declarations through advertising or behavioral profiling.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
              2. Data We Collect
            </h2>
            <p>
              We collect your name, email address, and hashed authentication credentials necessary to maintain your account. We store the constitutions, values, principles, boundaries, decision journal entries, and reflections you choose to write.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
              3. Access Controls
            </h2>
            <p>
              All stored records are tied directly to your unique user account. Requests to read or modify your data undergo server-side session authentication and ownership validation. No user can view another user&apos;s constitution or records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
              4. Data Retention and Ownership
            </h2>
            <p>
              Your thoughts and writings remain entirely your property. You may edit or delete individual principles, boundaries, decisions, or constitutions at any time through the application interface.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

