"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface ValueItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [availableValues, setAvailableValues] = useState<ValueItem[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [customValueName, setCustomValueName] = useState("");
  const [missionStatement, setMissionStatement] = useState("");
  const [title, setTitle] = useState("My Personal Constitution");
  const [subtitle, setSubtitle] = useState("A charter for deliberate living");
  const [templateChoice, setTemplateChoice] = useState<"starter" | "blank">("starter");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchValues() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/values");
        const json = await res.json();
        if (json.success) {
          setAvailableValues(json.data.values);
          // Default select 3 classic virtues
          const defaults = json.data.values.slice(0, 3).map((v: ValueItem) => v.id);
          setSelectedValues(defaults);
        }
      } catch (err) {
        console.error("Failed to load values", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchValues();
  }, []);

  const toggleValue = (id: string) => {
    if (selectedValues.includes(id)) {
      setSelectedValues(selectedValues.filter((v) => v !== id));
    } else {
      setSelectedValues([...selectedValues, id]);
    }
  };

  const handleAddCustomValue = async () => {
    if (!customValueName.trim()) return;
    try {
      const res = await fetch("/api/values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: customValueName.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setAvailableValues([json.data.value, ...availableValues]);
        setSelectedValues([...selectedValues, json.data.value.id]);
        setCustomValueName("");
      }
    } catch (err) {
      console.error("Failed to add custom value", err);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create Constitution
      const constRes = await fetch("/api/constitutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          missionStatement: missionStatement.trim() || undefined,
          status: "ACTIVE",
          initialValues: selectedValues,
        }),
      });
      const constJson = await constRes.json();
      const constitutionId = constJson.data.constitution.id;

      // If starter template chosen, seed initial sample principles & boundaries
      if (templateChoice === "starter") {
        // Principle 1
        await fetch(`/api/constitutions/${constitutionId}/principles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Truth Before Ease",
            statement: "Never obscure facts or misrepresent reality to avoid temporary friction. Transparent truth creates enduring trust.",
            category: "Integrity",
          }),
        });

        // Principle 2
        await fetch(`/api/constitutions/${constitutionId}/principles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Deliberate Creation",
            statement: "Dedicate unbroken focus to your highest craft before letting external notifications dictate your daily attention.",
            category: "Work",
          }),
        });

        // Boundary 1
        await fetch(`/api/constitutions/${constitutionId}/boundaries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "The Uninterrupted Morning",
            description: "No incoming feeds, messages, or news before completing your morning deep work block.",
            domain: "Digital Life",
          }),
        });
      }

      // 2. Mark onboarding completed
      await fetch("/api/auth/onboarding", { method: "POST" });

      router.push(`/constitution/${constitutionId}`);
      router.refresh();
    } catch (err) {
      console.error("Failed to finish onboarding", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col justify-center py-12 px-6">
      <div className="max-w-2xl w-full mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-[var(--color-forest)]" />
            <span className="font-serif text-sm tracking-[0.2em] font-semibold text-[var(--color-ink)]">
              CONSTITUTION ONBOARDING
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[var(--color-ink)]">
            {step === 1 && "Choose your core virtues"}
            {step === 2 && "Articulate your personal mission"}
            {step === 3 && "Name & configure your document"}
          </h1>
          <p className="text-xs text-[var(--color-muted)]">
            Step {step} of 3 &bull; You can freely refine, add, or alter these at any time.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s
                  ? "w-10 bg-[var(--color-forest)]"
                  : step > s
                  ? "w-6 bg-[var(--color-sage)]"
                  : "w-6 bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>

        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-8 shadow-sm">
          {/* STEP 1: VALUES */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                  Select 3 to 7 foundational values
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  These serve as the bedrock for your articles, rules, and future decision reflections.
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-xs text-[var(--color-muted)]">
                  Loading virtues catalogue...
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
                  {availableValues.map((val) => {
                    const isSelected = selectedValues.includes(val.id);
                    return (
                      <button
                        key={val.id}
                        type="button"
                        onClick={() => toggleValue(val.id)}
                        className={`flex items-center justify-between p-3 rounded border text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[var(--color-forest)] text-white border-[var(--color-forest)] font-medium shadow-2xs"
                            : "bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]"
                        }`}
                      >
                        <span className="truncate">{val.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Add Custom Value */}
              <div className="pt-3 border-t border-[var(--color-border)] flex gap-2">
                <Input
                  placeholder="Add custom value (e.g. Craftsmanship)"
                  value={customValueName}
                  onChange={(e) => setCustomValueName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomValue();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddCustomValue}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs text-[var(--color-muted)]">
                  {selectedValues.length} value{selectedValues.length === 1 ? "" : "s"} selected
                </span>
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={selectedValues.length === 0}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: MISSION STATEMENT */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                  Draft an optional personal mission or motto
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  A concise declaration of intent that anchors the top of your document.
                </p>
              </div>

              <Textarea
                rows={5}
                placeholder="e.g. To live with quiet discipline, master my craft with patience, and treat every human encounter with directness and generosity."
                value={missionStatement}
                onChange={(e) => setMissionStatement(e.target.value)}
              />

              <div className="pt-4 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setMissionStatement("");
                      setStep(3);
                    }}
                  >
                    Skip for now
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TEMPLATE & INITIAL CONSTITUTION */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                  Establish your constitution
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Give your document a title and choose how you would like to begin.
                </p>
              </div>

              <Input
                label="Constitution Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Input
                label="Subtitle or Epigraph"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Starting Structure
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setTemplateChoice("starter")}
                    className={`p-4 border rounded cursor-pointer transition-all ${
                      templateChoice === "starter"
                        ? "border-[var(--color-forest)] bg-[var(--color-forest)]/5 ring-1 ring-[var(--color-forest)]"
                        : "border-[var(--color-border)] hover:bg-[var(--color-paper)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-semibold text-sm text-[var(--color-ink)]">
                        Starter Framework
                      </span>
                      {templateChoice === "starter" && <Check className="w-4 h-4 text-[var(--color-forest)]" />}
                    </div>
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      Includes starter principle templates and boundary examples ready to personalize.
                    </p>
                  </div>

                  <div
                    onClick={() => setTemplateChoice("blank")}
                    className={`p-4 border rounded cursor-pointer transition-all ${
                      templateChoice === "blank"
                        ? "border-[var(--color-forest)] bg-[var(--color-forest)]/5 ring-1 ring-[var(--color-forest)]"
                        : "border-[var(--color-border)] hover:bg-[var(--color-paper)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-semibold text-sm text-[var(--color-ink)]">
                        Blank Slate
                      </span>
                      {templateChoice === "blank" && <Check className="w-4 h-4 text-[var(--color-forest)]" />}
                    </div>
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      Start with only your chosen values and author every article from scratch.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  isLoading={isSubmitting}
                  onClick={handleComplete}
                  className="px-6"
                >
                  <span>Enter Workspace</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

