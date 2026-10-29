"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";

export const InteractivePreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"values" | "principles" | "boundaries">("principles");

  return (
    <section id="preview" className="py-24 px-6 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30">
      <div className="max-w-[1000px] mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-brass)]">
            SPECIMEN
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-[var(--color-ink)]">
            Explore a Living Constitution
          </h2>
          <p className="text-sm text-[var(--color-muted)]">
            Click through the sections below to see how values, principles, and boundaries harmonize into a coherent charter.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center items-center gap-3">
          {(["values", "principles", "boundaries"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium transition-all rounded cursor-pointer ${
                activeTab === tab
                  ? "bg-[var(--color-forest)] text-white shadow-xs"
                  : "bg-[var(--color-paper-raised)] text-[var(--color-muted)] hover:text-[var(--color-ink)] border border-[var(--color-border)]"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Document Sheet */}
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-8 md:p-12 shadow-sm transition-all">
          <div className="pb-8 border-b border-[var(--color-border)] text-center space-y-2">
            <span className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-brass)] font-semibold">
              DOCUMENT SPECIMEN &bull; ARTICLE EXCERPT
            </span>
            <h3 className="font-serif text-3xl font-bold text-[var(--color-ink)]">
              THE CONSTITUTION OF CALM PERSISTENCE
            </h3>
            <p className="text-xs text-[var(--color-muted)] italic font-serif">
              Preamble: In recognition of the fleeting nature of time and the distractibility of human ambition, I ratify these standards.
            </p>
          </div>

          <div className="pt-8 min-h-[320px]">
            {activeTab === "values" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xl font-semibold text-[var(--color-forest)]">
                    Ratified Core Values
                  </h4>
                  <span className="text-xs text-[var(--color-muted)]">Ranked by Priority</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Integrity",
                      desc: "Complete congruence between private thought and public deed. No compromises behind closed doors.",
                    },
                    {
                      name: "Curiosity",
                      desc: "The continuous willingness to discard obsolete assumptions and investigate what is true.",
                    },
                    {
                      name: "Discipline",
                      desc: "Freedom bought through daily obedience to voluntary constraints and craft mastery.",
                    },
                    {
                      name: "Simplicity",
                      desc: "Clearing away superfluous noise to honor physical vitality, family, and deep creative focus.",
                    },
                  ].map((val, idx) => (
                    <div key={val.name} className="p-4 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-semibold text-[var(--color-forest)]">
                          0{idx + 1}.
                        </span>
                        <span className="font-serif text-base font-semibold text-[var(--color-ink)]">
                          {val.name}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed">{val.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "principles" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xl font-semibold text-[var(--color-forest)]">
                    Governing Articles & Principles
                  </h4>
                  <Badge variant="sage">Work & Integrity</Badge>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      article: "ARTICLE I",
                      sec: "SEC. 1",
                      title: "The Standard of Craftsmanship",
                      text: "Never ship work that relies on concealment of defects. If a foundation is unstable, rebuild it deliberately before painting the facade.",
                    },
                    {
                      article: "ARTICLE I",
                      sec: "SEC. 2",
                      title: "Truth Under Stress",
                      text: "When an outcome falters, volunteer the error immediately. Defensiveness compounds failure; swift accountability restores equilibrium.",
                    },
                    {
                      article: "ARTICLE II",
                      sec: "SEC. 1",
                      title: "Directness with Kindness",
                      text: "Offer honest feedback without cruelty. Withholding genuine critique to avoid momentary friction is cowardice disguised as courtesy.",
                    },
                  ].map((p) => (
                    <div key={p.title} className="p-4 border-l-2 border-[var(--color-forest)] bg-[var(--color-paper)]/50 space-y-1">
                      <div className="text-[10px] tracking-wider uppercase font-semibold text-[var(--color-muted)] flex items-center gap-2">
                        <span>{p.article}</span>
                        <span>&bull;</span>
                        <span>{p.sec}</span>
                      </div>
                      <h5 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                        {p.title}
                      </h5>
                      <p className="text-xs text-[var(--color-ink)]/80 leading-relaxed">{p.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "boundaries" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xl font-semibold text-[var(--color-forest)]">
                    Non-Negotiable Boundaries
                  </h4>
                  <Badge variant="brass">Life Domains</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      domain: "Digital Life",
                      title: "No Ingestion Before Output",
                      desc: "The morning hours belong to primary creation. Email, social platforms, and media notifications remain silenced until 11:00 AM.",
                    },
                    {
                      domain: "Work",
                      title: "The Sunset Rule",
                      desc: "No work communications past 7:30 PM. Emergencies require an explicit phone call; non-emergencies await normal daylight.",
                    },
                    {
                      domain: "Relationships",
                      title: "Total Presence at the Table",
                      desc: "Phones and screens are absent during all shared family meals. The people physically across the table receive unbroken eye contact.",
                    },
                    {
                      domain: "Finances",
                      title: "The 72-Hour Cooldown",
                      desc: "Any non-essential personal purchase exceeding $200 must sit on a physical cooling-off list for three full days prior to transaction.",
                    },
                  ].map((b) => (
                    <div key={b.title} className="p-4 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-semibold text-[var(--color-forest)]">
                          {b.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] bg-[var(--color-surface-secondary)] px-2 py-0.5 rounded">
                          {b.domain}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

