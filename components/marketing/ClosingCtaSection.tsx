import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const ClosingCtaSection: React.FC = () => {
  return (
    <section className="py-24 px-6 border-t border-[var(--color-border)] bg-[var(--color-paper-raised)] text-center">
      <div className="max-w-[700px] mx-auto space-y-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-brass)]">
          BEGIN YOUR DECLARATION
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-normal text-[var(--color-ink)] leading-tight">
          Write down the person you&apos;re choosing to become.
        </h2>
        <p className="text-base md:text-lg text-[var(--color-muted)] leading-relaxed font-light">
          Start with a few values. Let the rest take shape over time.
        </p>
        <div className="pt-4 flex justify-center">
          <Link href="/sign-up">
            <Button size="lg" className="px-8 py-3.5 text-base shadow-sm group">
              <span>Create your constitution</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

