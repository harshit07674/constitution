import React from "react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Discover what matters.",
      description:
        "Select from curated classical virtues or define custom values that represent your highest character. Reorder them deliberately to establish what takes priority when tensions arise.",
    },
    {
      number: "02",
      title: "Put your principles into words.",
      description:
        "Translate abstract virtues into actionable articles, life domain rules, and non-negotiable boundaries. Give each commitment a title and a definitive statement.",
    },
    {
      number: "03",
      title: "Return to your constitution.",
      description:
        "Print a museum-grade document for your physical desk. Whenever high-stakes decisions arise, weigh each path against your written articles in the decision journal.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-[var(--color-border)] bg-[var(--color-paper)]">
      <div className="max-w-[1200px] mx-auto space-y-16">
        <div className="max-w-xl space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-forest)]">
            THE PROCESS
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-[var(--color-ink)]">
            How a personal constitution comes together.
          </h2>
          <p className="text-sm text-[var(--color-muted)]">
            Simple enough to draft in a single afternoon. Deep enough to guide a decade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step) => (
            <div key={step.number} className="space-y-4 relative">
              <div className="font-serif text-6xl text-[var(--color-forest)]/30 font-light select-none">
                {step.number}
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed font-light">
                {step.description}
              </p>
              <div className="w-12 h-0.5 bg-[var(--color-border)] mt-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

