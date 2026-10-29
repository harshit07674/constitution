import React from "react";
import { Shield, Lock, EyeOff } from "lucide-react";

export const PrivacySection: React.FC = () => {
  return (
    <section className="py-24 px-6 border-t border-[var(--color-border)] bg-[var(--color-paper)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-forest)]">
              SANCTUARY
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-[var(--color-ink)] leading-tight">
              Your principles are personal.
              <br />
              <span className="italic text-[var(--color-brass)]">Your space should be, too.</span>
            </h2>
            <p className="text-sm md:text-base text-[var(--color-muted)] leading-relaxed font-light">
              We believe a personal manifesto cannot flourish in a public feed or an attention economy. Your drafts, decisions, and weekly reflections are kept behind authenticated account boundaries, visible only to you.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm space-y-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-forest)]/10 flex items-center justify-center text-[var(--color-forest)]">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                Private by Default
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                There are no public profile feeds, share-counters, or social metrics. You author in a serene workspace built solely for self-alignment.
              </p>
            </div>

            <div className="p-6 bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm space-y-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-forest)]/10 flex items-center justify-center text-[var(--color-forest)]">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                Isolated Records
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Every query, mutation, and document view rigorously validates user identity on the server. Your data cannot be read by another user.
              </p>
            </div>

            <div className="p-6 bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm space-y-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-forest)]/10 flex items-center justify-center text-[var(--color-forest)]">
                <EyeOff className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                No Ad Tracking
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                We do not sell personal data, display intrusive advertisements, or harvest your principles for third-party marketing profiles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

