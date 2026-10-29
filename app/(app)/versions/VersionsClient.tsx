"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { History, RotateCcw, Camera, Shield, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

interface VersionItem {
  id: string;
  versionNumber: number;
  note: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snapshot: any;
  createdAt: string | Date;
}

interface VersionsClientProps {
  constitutionId: string;
  constitutionTitle: string;
  initialVersions: VersionItem[];
}

export const VersionsClient: React.FC<VersionsClientProps> = ({
  constitutionId,
  constitutionTitle,
  initialVersions,
}) => {
  const router = useRouter();
  const [versions, setVersions] = useState<VersionItem[]>(initialVersions);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<VersionItem | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/constitutions/${constitutionId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note || undefined }),
      });
      const json = await res.json();
      if (json.success) {
        setVersions([json.data.version, ...versions]);
        setIsSnapshotOpen(false);
        setNote("");
        setFeedback(`Version ${json.data.version.versionNumber} milestone captured.`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    if (!confirm("Restore this version? A new revision will be created from this historical snapshot.")) {
      return;
    }

    setIsRestoring(true);
    try {
      const res = await fetch(`/api/constitutions/${constitutionId}/versions/${versionId}/restore`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setVersions([json.data.version, ...versions]);
        setSelectedVersion(null);
        setFeedback("Constitution successfully restored to new revision.");
        setTimeout(() => setFeedback(null), 3000);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[900px] mx-auto w-full space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-brass)]">
            HISTORICAL MILESTONES
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[var(--color-ink)] mt-1">
            Version History
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Immutable snapshots preserving the evolution of &quot;{constitutionTitle}&quot;.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsSnapshotOpen(true)}>
          <Camera className="w-3.5 h-3.5 mr-1" />
          Create Snapshot
        </Button>
      </div>

      {feedback && (
        <div className="p-3 bg-[var(--color-forest)]/10 border border-[var(--color-forest)]/30 text-xs text-[var(--color-forest)] rounded-sm">
          {feedback}
        </div>
      )}

      {versions.length > 0 ? (
        <div className="space-y-4">
          {versions.map((ver) => (
            <div
              key={ver.id}
              className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[var(--color-surface-secondary)] text-[var(--color-forest)] font-serif font-bold text-sm flex items-center justify-center">
                    v{ver.versionNumber}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[var(--color-ink)]">
                      {ver.note || `Version ${ver.versionNumber} Snapshot`}
                    </h3>
                    <span className="text-xs text-[var(--color-muted)]">
                      Recorded {new Date(ver.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVersion(ver)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Inspect
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRestore(ver.id)}
                    isLoading={isRestoring}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Restore
                  </Button>
                </div>
              </div>

              {/* Snapshot contents quick summary */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[var(--color-muted)] border-t border-[var(--color-border)]/50">
                <span>
                  <strong>Title:</strong> {ver.snapshot?.title}
                </span>
                <span>
                  <strong>Values:</strong> {ver.snapshot?.values?.length || 0}
                </span>
                <span>
                  <strong>Principles:</strong> {ver.snapshot?.principles?.length || 0}
                </span>
                <span>
                  <strong>Boundaries:</strong> {ver.snapshot?.boundaries?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-forest)]/10 text-[var(--color-forest)] mx-auto flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
            No historical snapshots taken yet
          </h2>
          <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
            Take snapshots before major revisions so you can always look back or restore previous principles.
          </p>
          <div className="pt-2">
            <Button size="sm" onClick={() => setIsSnapshotOpen(true)}>
              <Camera className="w-3.5 h-3.5 mr-1" />
              Capture First Snapshot
            </Button>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SNAPSHOT */}
      <Modal
        isOpen={isSnapshotOpen}
        onClose={() => setIsSnapshotOpen(false)}
        title="Create Version Snapshot"
        description="Preserve an immutable milestone of all current constitution data."
      >
        <form onSubmit={handleCreateSnapshot} className="space-y-4">
          <Input
            label="Milestone Note (Optional)"
            placeholder="e.g. Completed initial draft; or Career shift revision"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            Snapshots preserve title, preamble, mission statement, values, principles, and boundaries at this exact moment.
          </p>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsSnapshotOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Capture Snapshot
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: INSPECT SNAPSHOT */}
      <Modal
        isOpen={!!selectedVersion}
        onClose={() => setSelectedVersion(null)}
        title={selectedVersion ? `Inspect Snapshot v${selectedVersion.versionNumber}` : "Snapshot"}
        description={selectedVersion?.note || "Historical constitution state"}
      >
        {selectedVersion && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
            <div className="p-3 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm space-y-1">
              <span className="font-semibold text-[var(--color-forest)] uppercase tracking-wider text-[10px]">
                Declaration Title
              </span>
              <p className="font-serif text-sm font-bold text-[var(--color-ink)]">
                {selectedVersion.snapshot.title}
              </p>
              {selectedVersion.snapshot.subtitle && (
                <p className="italic text-[var(--color-muted)]">
                  &ldquo;{selectedVersion.snapshot.subtitle}&rdquo;
                </p>
              )}
            </div>

            {selectedVersion.snapshot.preamble && (
              <div className="space-y-1">
                <span className="font-semibold text-[var(--color-forest)] uppercase tracking-wider text-[10px]">
                  Preamble
                </span>
                <p className="p-3 bg-[var(--color-paper)] border border-[var(--color-border)] rounded italic font-serif leading-relaxed">
                  &ldquo;{selectedVersion.snapshot.preamble}&rdquo;
                </p>
              </div>
            )}

            {/* Principles */}
            <div className="space-y-2">
              <span className="font-semibold text-[var(--color-forest)] uppercase tracking-wider text-[10px]">
                Principles ({selectedVersion.snapshot.principles?.length || 0})
              </span>
              <div className="space-y-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {selectedVersion.snapshot.principles?.map((p: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-[var(--color-paper)] border-l-2 border-[var(--color-forest)] space-y-0.5">
                    <span className="font-semibold text-[var(--color-ink)]">
                      {p.title}
                    </span>
                    <p className="text-[var(--color-muted)] leading-relaxed font-light">
                      {p.statement}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Boundaries */}
            <div className="space-y-2">
              <span className="font-semibold text-[var(--color-forest)] uppercase tracking-wider text-[10px]">
                Boundaries ({selectedVersion.snapshot.boundaries?.length || 0})
              </span>
              <div className="space-y-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {selectedVersion.snapshot.boundaries?.map((b: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--color-ink)]">{b.title}</span>
                      <span className="text-[10px] uppercase text-[var(--color-muted)]">[{b.domain}]</span>
                    </div>
                    <p className="text-[var(--color-muted)] leading-relaxed">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVersion(null)}
              >
                Close
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleRestore(selectedVersion.id)}
                isLoading={isRestoring}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Restore This Version
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

