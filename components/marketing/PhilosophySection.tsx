import React from "react";

export const PhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="py-24 px-6 border-t border-[var(--color-border)] bg-[var(--color-paper-raised)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-brass)]">
              THE PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-[var(--color-ink)] leading-snug">
              Not another list of goals.
              <br />
              <span className="italic text-[var(--color-forest)]">A clearer sense of who you want to be.</span>
            </h2>
          </div>

          <div className="lg:col-span-6 space-y-6 text-[var(--color-muted)] text-base md:text-lg leading-relaxed font-light">
            <p>
              Goals describe outcomes you wish to achieve—external targets that may change with circumstance or luck. A constitution documents the internal standards and principles you choose as your compass, regardless of external storms.
            </p>
            <p>
              When a hard crossroad appears—in your work, relationships, or creative pursuits—you don&apos;t need generic advice or motivational platitudes. You need your own vetted words, reflecting who you determined you would be when your head was clear.
            </p>
            <div className="pt-2 border-l-2 border-[var(--color-brass)] pl-4 italic text-sm text-[var(--color-ink)]">
              &ldquo;Principles are not handcuffs. They are the scaffolding upon which true personal freedom is constructed.&rdquo;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

