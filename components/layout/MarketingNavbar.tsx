"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const MarketingNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-[var(--color-paper)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <BookOpen className="w-5 h-5 text-[var(--color-forest)] transition-transform group-hover:scale-105" />
          <span className="font-serif text-lg tracking-[0.15em] font-semibold text-[var(--color-ink)]">
            PERSONAL CONSTITUTION
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#philosophy"
            className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Philosophy
          </Link>
          <Link
            href="#preview"
            className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Sample
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Privacy
          </Link>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="primary" size="sm">
              Create your constitution
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[var(--color-ink)] hover:text-[var(--color-forest)] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--color-border)] bg-[var(--color-paper-raised)] px-6 py-4 space-y-3">
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] py-1.5"
          >
            How it works
          </Link>
          <Link
            href="#philosophy"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] py-1.5"
          >
            Philosophy
          </Link>
          <Link
            href="#preview"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] py-1.5"
          >
            Sample
          </Link>
          <Link
            href="/privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] py-1.5"
          >
            Privacy
          </Link>
          <div className="pt-3 border-t border-[var(--color-border)] flex flex-col gap-2">
            <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="sm" className="w-full">
                Create your constitution
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

