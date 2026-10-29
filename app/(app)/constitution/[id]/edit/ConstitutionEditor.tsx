"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  Printer,
  Camera,
  Layers,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

interface ValueItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
}

interface ConstitutionEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialConstitution: any;
  availableValues: ValueItem[];
  userId: string;
}

const CATEGORIES = ["Integrity", "Growth", "Relationships", "Work", "Health", "Money", "General"];
const DOMAINS = ["Work", "Relationships", "Health", "Finances", "Digital Life", "General"];

export const ConstitutionEditor: React.FC<ConstitutionEditorProps> = ({
  initialConstitution,
  availableValues: initialAvailableValues,
}) => {
  const router = useRouter();
  const [constitution, setConstitution] = useState(initialConstitution);
  const [availableValues, setAvailableValues] = useState<ValueItem[]>(initialAvailableValues);

  // Active section tab
  const [activeTab, setActiveTab] = useState<"basics" | "values" | "principles" | "boundaries">("basics");

  // Meta fields
  const [title, setTitle] = useState(constitution.title || "");
  const [subtitle, setSubtitle] = useState(constitution.subtitle || "");
  const [preamble, setPreamble] = useState(constitution.preamble || "");
  const [missionStatement, setMissionStatement] = useState(constitution.missionStatement || "");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE">(constitution.status || "DRAFT");

  // Status flags
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Value modals
  const [isAddValueOpen, setIsAddValueOpen] = useState(false);
  const [selectedValueId, setSelectedValueId] = useState("");
  const [valueNote, setValueNote] = useState("");
  const [customValueName, setCustomValueName] = useState("");
  const [customValueDesc, setCustomValueDesc] = useState("");

  // Principle modals
  const [isPrincipleModalOpen, setIsPrincipleModalOpen] = useState(false);
  const [editingPrincipleId, setEditingPrincipleId] = useState<string | null>(null);
  const [principleTitle, setPrincipleTitle] = useState("");
  const [principleStatement, setPrincipleStatement] = useState("");
  const [principleCategory, setPrincipleCategory] = useState("Integrity");

  // Boundary modals
  const [isBoundaryModalOpen, setIsBoundaryModalOpen] = useState(false);
  const [editingBoundaryId, setEditingBoundaryId] = useState<string | null>(null);
  const [boundaryTitle, setBoundaryTitle] = useState("");
  const [boundaryDesc, setBoundaryDesc] = useState("");
  const [boundaryDomain, setBoundaryDomain] = useState("Work");

  // Snapshot modal
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [snapshotNote, setSnapshotNote] = useState("");

  // Save Meta
  const handleSaveMeta = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch(`/api/constitutions/${constitution.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle: subtitle || null,
          preamble: preamble || null,
          missionStatement: missionStatement || null,
          status,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setConstitution({ ...constitution, ...json.data.constitution });
        setSaveMessage("Saved successfully");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setSaveMessage("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Add Value
  const handleAddValue = async () => {
    if (!selectedValueId) return;
    try {
      const res = await fetch(`/api/constitutions/${constitution.id}/values`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valueId: selectedValueId,
          personalNote: valueNote || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setConstitution({
          ...constitution,
          values: [...constitution.values, json.data.constitutionValue],
        });
        setIsAddValueOpen(false);
        setSelectedValueId("");
        setValueNote("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Custom Value
  const handleCreateCustomValue = async () => {
    if (!customValueName.trim()) return;
    try {
      const res = await fetch("/api/values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customValueName.trim(),
          description: customValueDesc.trim() || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAvailableValues([json.data.value, ...availableValues]);
        setSelectedValueId(json.data.value.id);
        setCustomValueName("");
        setCustomValueDesc("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remove Value
  const handleRemoveValue = async (valId: string) => {
    try {
      await fetch(`/api/constitutions/${constitution.id}/values/${valId}`, {
        method: "DELETE",
      });
      setConstitution({
        ...constitution,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        values: constitution.values.filter((v: any) => v.valueId !== valId),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Save Principle (Create or Edit)
  const handleSavePrinciple = async () => {
    if (!principleTitle.trim() || !principleStatement.trim()) return;
    try {
      if (editingPrincipleId) {
        const res = await fetch(`/api/constitutions/${constitution.id}/principles/${editingPrincipleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: principleTitle,
            statement: principleStatement,
            category: principleCategory,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setConstitution({
            ...constitution,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            principles: constitution.principles.map((p: any) =>
              p.id === editingPrincipleId ? json.data.principle : p
            ),
          });
        }
      } else {
        const res = await fetch(`/api/constitutions/${constitution.id}/principles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: principleTitle,
            statement: principleStatement,
            category: principleCategory,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setConstitution({
            ...constitution,
            principles: [...constitution.principles, json.data.principle],
          });
        }
      }

      setIsPrincipleModalOpen(false);
      setEditingPrincipleId(null);
      setPrincipleTitle("");
      setPrincipleStatement("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Principle
  const handleDeletePrinciple = async (pId: string) => {
    try {
      await fetch(`/api/constitutions/${constitution.id}/principles/${pId}`, {
        method: "DELETE",
      });
      setConstitution({
        ...constitution,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        principles: constitution.principles.filter((p: any) => p.id !== pId),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Save Boundary (Create or Edit)
  const handleSaveBoundary = async () => {
    if (!boundaryTitle.trim() || !boundaryDesc.trim()) return;
    try {
      if (editingBoundaryId) {
        const res = await fetch(`/api/constitutions/${constitution.id}/boundaries/${editingBoundaryId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: boundaryTitle,
            description: boundaryDesc,
            domain: boundaryDomain,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setConstitution({
            ...constitution,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            boundaries: constitution.boundaries.map((b: any) =>
              b.id === editingBoundaryId ? json.data.boundary : b
            ),
          });
        }
      } else {
        const res = await fetch(`/api/constitutions/${constitution.id}/boundaries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: boundaryTitle,
            description: boundaryDesc,
            domain: boundaryDomain,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setConstitution({
            ...constitution,
            boundaries: [...constitution.boundaries, json.data.boundary],
          });
        }
      }

      setIsBoundaryModalOpen(false);
      setEditingBoundaryId(null);
      setBoundaryTitle("");
      setBoundaryDesc("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Boundary
  const handleDeleteBoundary = async (bId: string) => {
    try {
      await fetch(`/api/constitutions/${constitution.id}/boundaries/${bId}`, {
        method: "DELETE",
      });
      setConstitution({
        ...constitution,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        boundaries: constitution.boundaries.filter((b: any) => b.id !== bId),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Create Snapshot
  const handleCreateSnapshot = async () => {
    try {
      const res = await fetch(`/api/constitutions/${constitution.id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: snapshotNote || undefined }),
      });
      const json = await res.json();
      if (json.success) {
        setIsSnapshotModalOpen(false);
        setSnapshotNote("");
        setSaveMessage(`Version ${json.data.version.versionNumber} snapshot created`);
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Existing assigned value IDs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assignedValueIds = new Set(constitution.values.map((v: any) => v.valueId));
  const unassignedValues = availableValues.filter((v) => !assignedValueIds.has(v.id));

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[1000px] mx-auto w-full space-y-8">
      {/* Editor Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div className="space-y-1">
          <Link
            href={`/constitution/${constitution.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-forest)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to overview</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[var(--color-ink)]">
            Constitution Editor
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-xs text-[var(--color-forest)] font-medium animate-in fade-in">
              {saveMessage}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSnapshotModalOpen(true)}
          >
            <Camera className="w-3.5 h-3.5 mr-1" />
            Save Snapshot
          </Button>
          <Link href={`/constitution/${constitution.id}/document`}>
            <Button variant="outline" size="sm">
              <Printer className="w-3.5 h-3.5 mr-1" />
              Document View
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleSaveMeta}
            isLoading={isSaving}
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Editor Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] overflow-x-auto pb-px">
        {[
          { key: "basics", label: "Title & Preamble" },
          { key: "values", label: `Core Values (${constitution.values.length})` },
          { key: "principles", label: `Principles (${constitution.principles.length})` },
          { key: "boundaries", label: `Boundaries (${constitution.boundaries.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? "border-[var(--color-forest)] text-[var(--color-forest)]"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: TITLE & PREAMBLE */}
      {activeTab === "basics" && (
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 md:p-8 space-y-6">
          <div className="space-y-1 pb-4 border-b border-[var(--color-border)]">
            <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
              Document Declaration
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Establish the identity, opening dedication, and life mission of your charter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Input
                label="Constitution Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Input
                label="Subtitle / Epigraph"
                placeholder="e.g. A manifesto for calm focus and lifelong integrity"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Select
                label="Charter Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "ACTIVE")}
                options={[
                  { value: "ACTIVE", label: "Active Charter" },
                  { value: "DRAFT", label: "Draft Proposal" },
                ]}
              />

              <div className="p-3 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-muted)]">
                Active charters appear as your primary compass on the dashboard.
              </div>
            </div>
          </div>

          <Textarea
            label="Preamble (Opening Declaration)"
            rows={4}
            placeholder="We, in pursuit of mental clarity and personal integrity, set forth these standards..."
            value={preamble}
            onChange={(e) => setPreamble(e.target.value)}
            helperText="The preamble sets the tone and purpose for the entire document."
          />

          <Textarea
            label="Personal Mission Statement"
            rows={4}
            placeholder="To master craft patiently, honor relationships with total presence, and choose truth over comfort..."
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            helperText="An overarching compass summarizing what you intend to embody."
          />

          <div className="pt-2 flex justify-end">
            <Button onClick={handleSaveMeta} isLoading={isSaving} size="sm">
              <Save className="w-3.5 h-3.5 mr-1" />
              Save Document Meta
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: VALUES */}
      {activeTab === "values" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
                Governing Virtues
              </h2>
              <p className="text-xs text-[var(--color-muted)]">
                Values selected here appear on your printed document and in the decision journal.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddValueOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Assign Value
            </Button>
          </div>

          {constitution.values.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {constitution.values.map((v: any, idx: number) => (
                <div
                  key={v.value.id}
                  className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-5 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-xs font-semibold text-[var(--color-brass)]">
                        0{idx + 1}.
                      </span>
                      <h3 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                        {v.value.name}
                      </h3>
                      {v.value.isSystem ? (
                        <span className="text-[10px] text-[var(--color-muted)] bg-[var(--color-surface-secondary)] px-1.5 py-0.5 rounded">
                          Curated
                        </span>
                      ) : (
                        <span className="text-[10px] text-[var(--color-forest)] bg-[var(--color-forest)]/10 px-1.5 py-0.5 rounded">
                          Custom
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveValue(v.value.id)}
                      className="p-1 text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors cursor-pointer"
                      title="Remove from constitution"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {v.value.description && (
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed font-light">
                      {v.value.description}
                    </p>
                  )}

                  {v.personalNote && (
                    <p className="text-xs text-[var(--color-forest)] italic pt-1 border-t border-[var(--color-border)]/50">
                      Note: {v.personalNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-muted)]">
              No values assigned. Click &quot;Assign Value&quot; to pick from curated or custom virtues.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRINCIPLES */}
      {activeTab === "principles" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
                Articles & Principles
              </h2>
              <p className="text-xs text-[var(--color-muted)]">
                Concrete behavioral commitments organized by life categories.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingPrincipleId(null);
                setPrincipleTitle("");
                setPrincipleStatement("");
                setPrincipleCategory("Integrity");
                setIsPrincipleModalOpen(true);
              }}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Principle
            </Button>
          </div>

          {constitution.principles.length > 0 ? (
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {constitution.principles.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="sage">{p.category}</Badge>
                      <h3 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                        {p.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingPrincipleId(p.id);
                          setPrincipleTitle(p.title);
                          setPrincipleStatement(p.statement);
                          setPrincipleCategory(p.category || "Integrity");
                          setIsPrincipleModalOpen(true);
                        }}
                        className="p-1 text-[var(--color-muted)] hover:text-[var(--color-forest)] transition-colors cursor-pointer"
                        title="Edit Principle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePrinciple(p.id)}
                        className="p-1 text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors cursor-pointer"
                        title="Delete Principle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--color-ink)]/90 leading-relaxed font-light pl-3 border-l-2 border-[var(--color-forest)]">
                    {p.statement}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-muted)]">
              No principles drafted yet. Click &quot;Add Principle&quot; to articulate your first article.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BOUNDARIES */}
      {activeTab === "boundaries" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
                Personal Boundaries
              </h2>
              <p className="text-xs text-[var(--color-muted)]">
                Hard lines and limits that protect your health, relationships, time, and focus.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingBoundaryId(null);
                setBoundaryTitle("");
                setBoundaryDesc("");
                setBoundaryDomain("Work");
                setIsBoundaryModalOpen(true);
              }}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Boundary
            </Button>
          </div>

          {constitution.boundaries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {constitution.boundaries.map((b: any) => (
                <div
                  key={b.id}
                  className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] bg-[var(--color-surface-secondary)] px-2 py-0.5 rounded">
                      {b.domain}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingBoundaryId(b.id);
                          setBoundaryTitle(b.title);
                          setBoundaryDesc(b.description);
                          setBoundaryDomain(b.domain || "Work");
                          setIsBoundaryModalOpen(true);
                        }}
                        className="p-1 text-[var(--color-muted)] hover:text-[var(--color-forest)] transition-colors cursor-pointer"
                        title="Edit Boundary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBoundary(b.id)}
                        className="p-1 text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors cursor-pointer"
                        title="Delete Boundary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                    {b.title}
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-muted)]">
              No boundaries established yet. Click &quot;Add Boundary&quot; to define limits for work, health, and focus.
            </div>
          )}
        </div>
      )}

      {/* MODAL: ASSIGN VALUE */}
      <Modal
        isOpen={isAddValueOpen}
        onClose={() => setIsAddValueOpen(false)}
        title="Assign Virtue to Constitution"
        description="Choose from curated classical virtues or create a custom value."
      >
        <div className="space-y-4">
          {unassignedValues.length > 0 ? (
            <Select
              label="Select Available Virtue"
              value={selectedValueId}
              onChange={(e) => setSelectedValueId(e.target.value)}
              options={[
                { value: "", label: "-- Choose a value --" },
                ...unassignedValues.map((v) => ({
                  value: v.id,
                  label: `${v.name}${v.isSystem ? "" : " (Custom)"}`,
                })),
              ]}
            />
          ) : (
            <p className="text-xs text-[var(--color-muted)]">
              All available catalogue virtues have already been assigned.
            </p>
          )}

          <Input
            label="Optional Personal Note"
            placeholder="e.g. Specifically in creative output"
            value={valueNote}
            onChange={(e) => setValueNote(e.target.value)}
          />

          <Button
            onClick={handleAddValue}
            disabled={!selectedValueId}
            size="sm"
            className="w-full"
          >
            Assign Value
          </Button>

          <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-forest)]">
              Or Author a Custom Value
            </h4>
            <Input
              placeholder="Value Name (e.g. Craftsmanship)"
              value={customValueName}
              onChange={(e) => setCustomValueName(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={customValueDesc}
              onChange={(e) => setCustomValueDesc(e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateCustomValue}
              disabled={!customValueName.trim()}
              className="w-full"
            >
              Create Custom Value
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: PRINCIPLE (CREATE / EDIT) */}
      <Modal
        isOpen={isPrincipleModalOpen}
        onClose={() => setIsPrincipleModalOpen(false)}
        title={editingPrincipleId ? "Edit Principle" : "New Principle"}
        description="Formulate an actionable rule aligned with your values."
      >
        <div className="space-y-4">
          <Input
            label="Principle Short Title"
            placeholder="e.g. Truth Before Ease"
            value={principleTitle}
            onChange={(e) => setPrincipleTitle(e.target.value)}
            required
          />

          <Select
            label="Category / Article"
            value={principleCategory}
            onChange={(e) => setPrincipleCategory(e.target.value)}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />

          <Textarea
            label="Detailed Commitment Statement"
            rows={4}
            placeholder="Never obscure facts or misrepresent reality to avoid temporary friction. Transparent truth creates enduring trust."
            value={principleStatement}
            onChange={(e) => setPrincipleStatement(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPrincipleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSavePrinciple}
              disabled={!principleTitle.trim() || !principleStatement.trim()}
            >
              {editingPrincipleId ? "Update Principle" : "Save Principle"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: BOUNDARY (CREATE / EDIT) */}
      <Modal
        isOpen={isBoundaryModalOpen}
        onClose={() => setIsBoundaryModalOpen(false)}
        title={editingBoundaryId ? "Edit Boundary" : "New Boundary"}
        description="Establish explicit limits protecting your time and peace."
      >
        <div className="space-y-4">
          <Input
            label="Boundary Title"
            placeholder="e.g. The Sunset Rule"
            value={boundaryTitle}
            onChange={(e) => setBoundaryTitle(e.target.value)}
            required
          />

          <Select
            label="Life Domain"
            value={boundaryDomain}
            onChange={(e) => setBoundaryDomain(e.target.value)}
            options={DOMAINS.map((d) => ({ value: d, label: d }))}
          />

          <Textarea
            label="Explanation & Constraints"
            rows={4}
            placeholder="No work messages past 7:30 PM. Emergencies require a phone call; routine inquiries wait for daylight."
            value={boundaryDesc}
            onChange={(e) => setBoundaryDesc(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBoundaryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveBoundary}
              disabled={!boundaryTitle.trim() || !boundaryDesc.trim()}
            >
              {editingBoundaryId ? "Update Boundary" : "Save Boundary"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: SNAPSHOT */}
      <Modal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        title="Create Version Snapshot"
        description="Save an immutable historical milestone of your constitution."
      >
        <div className="space-y-4">
          <Input
            label="Snapshot Note (Optional)"
            placeholder="e.g. Major revision after career transition"
            value={snapshotNote}
            onChange={(e) => setSnapshotNote(e.target.value)}
          />

          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            This creates an immutable copy of all values, principles, and boundaries. You can review past milestones or restore previous snapshots at any time in Version History.
          </p>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSnapshotModalOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateSnapshot}>
              Create Snapshot
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

