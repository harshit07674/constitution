"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Scale, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

const DOMAINS = ["Work", "Relationships", "Health", "Finances", "Digital Life", "General"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NewDecisionForm: React.FC<{ constitution: any }> = ({ constitution }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("Work");
  const [context, setContext] = useState("");
  const [reflection, setReflection] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleValue = (valId: string) => {
    if (selectedValues.includes(valId)) {
      setSelectedValues(selectedValues.filter((id) => id !== valId));
    } else {
      setSelectedValues([...selectedValues, valId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constitutionId: constitution.id,
          title,
          domain,
          context,
          reflection: reflection || undefined,
          valueIds: selectedValues,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message || "Failed to record decision reflection");
        setIsSubmitting(false);
        return;
      }

      router.push(`/decisions/${json.data.decision.id}`);
      router.refresh();
    } catch {
      setError("An unexpected network error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[800px] mx-auto w-full space-y-8">
      <div className="space-y-1 border-b border-[var(--color-border)] pb-6">
        <Link
          href="/decisions"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-forest)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to decisions</span>
        </Link>
        <h1 className="font-serif text-3xl font-normal text-[var(--color-ink)] mt-2">
          Record a Decision Alignment
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Clarify the dilemma, connect relevant virtues, and reflect on which option upholds your principles.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-xs text-[var(--color-danger)] rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Decision Title / Question"
              placeholder="e.g. Evaluating relocation for promotion vs remaining near family"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Select
              label="Life Domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              options={DOMAINS.map((d) => ({ value: d, label: d }))}
            />
          </div>
        </div>

        <Textarea
          label="The Crossroads & Context"
          rows={5}
          placeholder="Describe the dilemma, the stakes involved, and what competing tensions make this choice difficult..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          required
        />

        {/* Virtues selector */}
        {constitution.values.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Which ratified virtues are most relevant to this choice?
            </label>
            <div className="flex flex-wrap gap-2">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {constitution.values.map((v: any) => {
                const isSelected = selectedValues.includes(v.value.id);
                return (
                  <button
                    key={v.value.id}
                    type="button"
                    onClick={() => toggleValue(v.value.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[var(--color-forest)] text-white border-[var(--color-forest)]"
                        : "bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]"
                    }`}
                  >
                    <span>{v.value.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <Textarea
          label="Principle Reflection & Resolution"
          rows={5}
          placeholder="Reflect on which choice best preserves your internal integrity. Which path aligns with the person you promised to become?"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          helperText="Suggestions are reflection prompts, not dogmatic instructions."
        />

        <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <Link href="/decisions">
            <Button variant="ghost" size="sm" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            <Save className="w-3.5 h-3.5 mr-1" />
            Save Decision Entry
          </Button>
        </div>
      </form>
    </div>
  );
};

