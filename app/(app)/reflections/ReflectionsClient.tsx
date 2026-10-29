"use client";

import React, { useState } from "react";
import { Plus, CalendarCheck, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";

interface ReflectionItem {
  id: string;
  wentWell: string;
  principlesFollowed: string;
  improvementNotes: string;
  createdAt: string | Date;
}

interface ReflectionsClientProps {
  initialReflections: ReflectionItem[];
  constitutionId: string | null;
}

export const ReflectionsClient: React.FC<ReflectionsClientProps> = ({
  initialReflections,
  constitutionId,
}) => {
  const [reflections, setReflections] = useState<ReflectionItem[]>(initialReflections);
  const [isOpen, setIsOpen] = useState(false);
  const [wentWell, setWentWell] = useState("");
  const [principlesFollowed, setPrinciplesFollowed] = useState("");
  const [improvementNotes, setImprovementNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wentWell.trim() || !principlesFollowed.trim() || !improvementNotes.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constitutionId,
          wentWell,
          principlesFollowed,
          improvementNotes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setReflections([json.data.reflection, ...reflections]);
        setIsOpen(false);
        setWentWell("");
        setPrinciplesFollowed("");
        setImprovementNotes("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you wish to delete this reflection?")) return;
    try {
      await fetch(`/api/reflections/${id}`, { method: "DELETE" });
      setReflections(reflections.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[900px] mx-auto w-full space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-brass)]">
            ACCOUNTABILITY
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[var(--color-ink)] mt-1">
            Weekly Reflection
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            A quiet weekly audit of actions taken, standards upheld, and adjustments needed.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Weekly Review
        </Button>
      </div>

      {reflections.length > 0 ? (
        <div className="space-y-6">
          {reflections.map((ref) => (
            <div
              key={ref.id}
              className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 md:p-8 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[var(--color-forest)]" />
                  <h3 className="font-serif text-lg font-bold text-[var(--color-ink)]">
                    Week of {new Date(ref.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                </div>

                <button
                  onClick={() => handleDelete(ref.id)}
                  className="p-1 text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors cursor-pointer"
                  title="Delete reflection"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="space-y-1.5 p-3.5 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm">
                  <span className="font-semibold uppercase tracking-wider text-[var(--color-forest)]">
                    What Went Well
                  </span>
                  <p className="text-[var(--color-ink)] leading-relaxed font-light whitespace-pre-line">
                    {ref.wentWell}
                  </p>
                </div>

                <div className="space-y-1.5 p-3.5 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm">
                  <span className="font-semibold uppercase tracking-wider text-[var(--color-forest)]">
                    Principles Upheld
                  </span>
                  <p className="text-[var(--color-ink)] leading-relaxed font-light whitespace-pre-line">
                    {ref.principlesFollowed}
                  </p>
                </div>

                <div className="space-y-1.5 p-3.5 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm">
                  <span className="font-semibold uppercase tracking-wider text-[var(--color-brass)]">
                    Course Corrections
                  </span>
                  <p className="text-[var(--color-ink)] leading-relaxed font-light whitespace-pre-line">
                    {ref.improvementNotes}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-forest)]/10 text-[var(--color-forest)] mx-auto flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
            No weekly reviews recorded yet
          </h2>
          <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
            Take five minutes at the end of each week to assess how well your daily actions adhered to your written principles.
          </p>
          <div className="pt-2">
            <Button size="sm" onClick={() => setIsOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Write First Reflection
            </Button>
          </div>
        </div>
      )}

      {/* MODAL: ADD REFLECTION */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Weekly Principle Review"
        description="Reflect honestly on the past seven days without self-judgment."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            label="1. What went well this week?"
            rows={3}
            placeholder="Where did you notice clarity, calm, and genuine progress?"
            value={wentWell}
            onChange={(e) => setWentWell(e.target.value)}
            required
          />

          <Textarea
            label="2. Which specific principles did you successfully embody?"
            rows={3}
            placeholder="e.g. Upheld 'Truth Before Ease' during project review; kept the morning boundary intact."
            value={principlesFollowed}
            onChange={(e) => setPrinciplesFollowed(e.target.value)}
            required
          />

          <Textarea
            label="3. Where did you slip, and what will you adjust?"
            rows={3}
            placeholder="e.g. Allowed reactive email notifications after 8:00 PM; re-enforcing the sunset rule next week."
            value={improvementNotes}
            onChange={(e) => setImprovementNotes(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Save Weekly Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

