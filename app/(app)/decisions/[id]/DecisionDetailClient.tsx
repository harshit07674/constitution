"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Edit2, Check, Scale } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DecisionDetailClient: React.FC<{ decision: any }> = ({ decision }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingReflection, setIsEditingReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState(decision.reflection || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you wish to delete this decision entry?")) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/decisions/${decision.id}`, { method: "DELETE" });
      router.push("/decisions");
      router.refresh();
    } catch {
      setIsDeleting(false);
    }
  };

  const handleUpdateReflection = async () => {
    setIsUpdating(true);
    try {
      await fetch(`/api/decisions/${decision.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reflection: reflectionText }),
      });
      decision.reflection = reflectionText;
      setIsEditingReflection(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[800px] mx-auto w-full space-y-8">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-6">
        <Link
          href="/decisions"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-forest)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to decision list</span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          isLoading={isDeleting}
          className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete Entry
        </Button>
      </div>

      <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 md:p-8 space-y-6">
        <div className="space-y-2 border-b border-[var(--color-border)] pb-6">
          <div className="flex items-center gap-3">
            <Badge variant="sage">{decision.domain}</Badge>
            <span className="text-xs text-[var(--color-muted)]">
              {new Date(decision.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--color-ink)]">
            {decision.title}
          </h1>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-forest)]">
            Dilemma & Circumstances
          </h3>
          <p className="text-sm text-[var(--color-ink)] leading-relaxed font-light whitespace-pre-line">
            {decision.context}
          </p>
        </div>

        {decision.values.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-forest)]">
              Anchoring Virtues
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {decision.values.map((v: any) => (
                <span
                  key={v.value.id}
                  className="px-2.5 py-1 bg-[var(--color-paper)] border border-[var(--color-border)] rounded text-xs font-medium text-[var(--color-forest)]"
                >
                  {v.value.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-forest)]">
              Constitutional Reflection
            </h3>
            {!isEditingReflection && (
              <button
                onClick={() => setIsEditingReflection(true)}
                className="text-xs text-[var(--color-forest)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit reflection</span>
              </button>
            )}
          </div>

          {isEditingReflection ? (
            <div className="space-y-3">
              <Textarea
                rows={5}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingReflection(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdateReflection}
                  isLoading={isUpdating}
                >
                  Save Reflection
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[var(--color-paper)] border-l-2 border-[var(--color-forest)] rounded-r text-sm text-[var(--color-ink)] italic font-serif leading-relaxed">
              {decision.reflection || "No reflection written for this entry."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

