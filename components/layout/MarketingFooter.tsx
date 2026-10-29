import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const MarketingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 py-16 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[var(--color-forest)]" />
            <span className="font-serif text-lg tracking-[0.15em] font-semibold text-[var(--color-ink)]">
              PERSONAL CONSTITUTION
            </span>
          </div>
          <p className="text-sm text-[var(--color-muted)] max-w-sm leading-relaxed">
            A quiet workspace to define your principles, document your boundaries, and live deliberately.
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            &copy; {currentYear} Personal Constitution. All rights reserved.
          </p>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-forest)]">
            Product
          </h4>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li>
              <Link href="#how-it-works" className="hover:text-[var(--color-ink)] transition-colors">
                How it works
              </Link>
            </li>
            <li>
              <Link href="#philosophy" className="hover:text-[var(--color-ink)] transition-colors">
                The Philosophy
              </Link>
            </li>
            <li>
              <Link href="#preview" className="hover:text-[var(--color-ink)] transition-colors">
                Sample Constitution
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-[var(--color-ink)] transition-colors">
                Get Started
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-forest)]">
            Account
          </h4>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li>
              <Link href="/sign-in" className="hover:text-[var(--color-ink)] transition-colors">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-[var(--color-ink)] transition-colors">
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-forest)]">
            Legal & Trust
          </h4>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li>
              <Link href="/privacy" className="hover:text-[var(--color-ink)] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[var(--color-ink)] transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

