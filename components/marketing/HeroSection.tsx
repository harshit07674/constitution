import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Editorial Statement */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-sm">
            <Compass className="w-3.5 h-3.5 text-[var(--color-forest)]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-forest)]">
              A personal document for the life you choose
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-[var(--color-ink)] leading-[1.05] tracking-tight">
              Know what you stand for.
            </h1>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-[var(--color-forest)] font-normal leading-[1.1]">
              Live like you mean it.
            </h2>
          </div>

          <p className="text-lg md:text-xl text-[var(--color-muted)] leading-relaxed max-w-xl font-light">
            A personal constitution brings your values, principles, and boundaries into one place—so you can return to what matters when life gets complicated.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/sign-up">
              <Button size="lg" className="px-7 py-3 text-base shadow-sm group">
                <span>Write your constitution</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#preview">
              <Button variant="outline" size="lg" className="px-6 py-3 text-base">
                Explore an example
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-[var(--color-border)] flex items-center gap-8 text-xs text-[var(--color-muted)]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-forest)]" />
              <span>Private & confidential workspace</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-forest)]" />
              <span>Printable keepsake document</span>
            </div>
          </div>
        </div>

        {/* Right Column: Believable Document Preview */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-8 shadow-md">
            {/* Document Header */}
            <div className="text-center pb-6 border-b border-[var(--color-border)] space-y-1.5">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-brass)] font-semibold">
                ESTABLISHED 2026
              </span>
              <h3 className="font-serif text-2xl font-bold text-[var(--color-ink)] tracking-wide">
                THE CONSTITUTION OF AN INTENTIONAL LIFE
              </h3>
              <p className="font-serif italic text-xs text-[var(--color-muted)]">
                &ldquo;Quiet conviction over reactive noise.&rdquo;
              </p>
            </div>

            {/* Preamble Excerpt */}
            <div className="py-4 border-b border-[var(--color-border)] text-xs text-[var(--color-ink)]/80 leading-relaxed italic font-serif">
              We, in pursuit of mental clarity and personal integrity, do set forth this declaration to govern daily choices, creative output, and relations with others.
            </div>

            {/* Article I: Selected Principles */}
            <div className="py-4 space-y-3">
              <div className="text-[11px] tracking-wider uppercase font-semibold text-[var(--color-forest)] flex items-center justify-between">
                <span>ARTICLE I &mdash; ON INTEGRITY & TRUTH</span>
                <span className="text-[10px] text-[var(--color-muted)]">SEC. 1</span>
              </div>
              <p className="text-xs text-[var(--color-ink)] leading-relaxed">
                <strong className="font-semibold text-[var(--color-forest)]">Speak accurately:</strong> Never utter as fact what you have not verified. Accept discomfort today rather than build upon a falsehood.
              </p>
            </div>

            {/* Article II: Boundaries */}
            <div className="py-4 border-t border-[var(--color-border)] space-y-3">
              <div className="text-[11px] tracking-wider uppercase font-semibold text-[var(--color-forest)] flex items-center justify-between">
                <span>ARTICLE II &mdash; ON TIME & FOCUS</span>
                <span className="text-[10px] text-[var(--color-muted)]">SEC. 2</span>
              </div>
              <p className="text-xs text-[var(--color-ink)] leading-relaxed">
                <strong className="font-semibold text-[var(--color-forest)]">The Sacred Morning:</strong> The first ninety minutes of every day are reserved for contemplation and creation, free from algorithmic distraction.
              </p>
            </div>

            {/* Document Signature Footprint */}
            <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-muted)] font-serif">
              <span>Ratified in private reflection</span>
              <span className="italic border-b border-[var(--color-border)] pb-0.5 px-3">Harshit K.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

