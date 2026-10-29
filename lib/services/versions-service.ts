import { prisma } from "@/lib/db/prisma";
import { ensureConstitutionOwnership } from "./constitution-service";
import { NotFoundError } from "@/lib/errors/api-error";
import { Prisma } from "@prisma/client";

export async function getConstitutionVersions(userId: string, constitutionId: string) {
  await ensureConstitutionOwnership(userId, constitutionId);

  return prisma.constitutionVersion.findMany({
    where: { constitutionId },
    orderBy: { versionNumber: "desc" },
  });
}

export async function createConstitutionSnapshot(
  userId: string,
  constitutionId: string,
  note?: string | null
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  const full = await prisma.constitution.findUnique({
    where: { id: constitutionId },
    include: {
      values: {
        include: { value: true },
        orderBy: { position: "asc" },
      },
      principles: {
        orderBy: [{ category: "asc" }, { position: "asc" }],
      },
      boundaries: {
        orderBy: [{ domain: "asc" }, { position: "asc" }],
      },
    },
  });

  if (!full) {
    throw new NotFoundError("Constitution not found");
  }

  // Get current highest version number
  const latestVersion = await prisma.constitutionVersion.findFirst({
    where: { constitutionId },
    orderBy: { versionNumber: "desc" },
    select: { versionNumber: true },
  });

  const nextVersion = (latestVersion?.versionNumber || 0) + 1;

  const snapshot = {
    title: full.title,
    subtitle: full.subtitle,
    preamble: full.preamble,
    missionStatement: full.missionStatement,
    establishedAt: full.establishedAt,
    values: full.values.map((v) => ({
      valueId: v.valueId,
      name: v.value.name,
      slug: v.value.slug,
      personalNote: v.personalNote,
      position: v.position,
    })),
    principles: full.principles.map((p) => ({
      title: p.title,
      statement: p.statement,
      category: p.category,
      position: p.position,
    })),
    boundaries: full.boundaries.map((b) => ({
      title: b.title,
      description: b.description,
      domain: b.domain,
      position: b.position,
    })),
  };

  return prisma.constitutionVersion.create({
    data: {
      constitutionId,
      versionNumber: nextVersion,
      snapshot: snapshot as unknown as Prisma.InputJsonValue,
      note: note?.trim() || null,
    },
  });
}

export async function restoreConstitutionFromVersion(
  userId: string,
  constitutionId: string,
  versionId: string
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  const version = await prisma.constitutionVersion.findFirst({
    where: { id: versionId, constitutionId },
  });

  if (!version) {
    throw new NotFoundError("Version snapshot not found");
  }

  interface SnapshotData {
    title: string;
    subtitle: string | null;
    preamble: string | null;
    missionStatement: string | null;
    values?: { valueId: string; personalNote?: string | null; position: number }[];
    principles?: { title: string; statement: string; category: string; position: number }[];
    boundaries?: { title: string; description: string; domain: string; position: number }[];
  }

  const data = version.snapshot as unknown as SnapshotData;

  return prisma.$transaction(async (tx) => {
    // Update constitution meta
    await tx.constitution.update({
      where: { id: constitutionId },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        preamble: data.preamble,
        missionStatement: data.missionStatement,
      },
    });

    // Replace values
    if (data.values) {
      await tx.constitutionValue.deleteMany({ where: { constitutionId } });
      await tx.constitutionValue.createMany({
        data: data.values.map((v, idx) => ({
          constitutionId,
          valueId: v.valueId,
          personalNote: v.personalNote || null,
          position: v.position ?? idx,
        })),
        skipDuplicates: true,
      });
    }

    // Replace principles
    if (data.principles) {
      await tx.principle.deleteMany({ where: { constitutionId } });
      await tx.principle.createMany({
        data: data.principles.map((p, idx) => ({
          constitutionId,
          title: p.title,
          statement: p.statement,
          category: p.category || "General",
          position: p.position ?? idx,
        })),
      });
    }

    // Replace boundaries
    if (data.boundaries) {
      await tx.boundary.deleteMany({ where: { constitutionId } });
      await tx.boundary.createMany({
        data: data.boundaries.map((b, idx) => ({
          constitutionId,
          title: b.title,
          description: b.description,
          domain: b.domain || "General",
          position: b.position ?? idx,
        })),
      });
    }

    // Auto-create an immutable record documenting the restore
    const latestVersion = await tx.constitutionVersion.findFirst({
      where: { constitutionId },
      orderBy: { versionNumber: "desc" },
      select: { versionNumber: true },
    });
    const nextVer = (latestVersion?.versionNumber || 0) + 1;

    return tx.constitutionVersion.create({
      data: {
        constitutionId,
        versionNumber: nextVer,
        snapshot: version.snapshot as Prisma.InputJsonValue,
        note: `Restored from version ${version.versionNumber}`,
      },
    });
  });
}

