import { prisma } from "@/lib/db/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/errors/api-error";
import { ConstitutionStatus, Prisma } from "@prisma/client";

export async function ensureConstitutionOwnership(userId: string, constitutionId: string) {
  const constitution = await prisma.constitution.findUnique({
    where: { id: constitutionId },
    select: { id: true, userId: true },
  });

  if (!constitution) {
    throw new NotFoundError("Constitution not found");
  }

  if (constitution.userId !== userId) {
    throw new ForbiddenError("You do not have access to this constitution");
  }

  return constitution;
}

export async function getUserConstitutions(userId: string) {
  return prisma.constitution.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
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
      _count: {
        select: {
          values: true,
          principles: true,
          boundaries: true,
          decisions: true,
          versions: true,
        },
      },
    },
  });
}

export async function getConstitutionDetails(userId: string, constitutionId: string) {
  await ensureConstitutionOwnership(userId, constitutionId);

  const constitution = await prisma.constitution.findUnique({
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
      decisions: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          values: {
            include: { value: true },
          },
        },
      },
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 5,
      },
    },
  });

  if (!constitution) {
    throw new NotFoundError("Constitution not found");
  }

  return constitution;
}

export async function getActiveOrFirstConstitution(userId: string) {
  const active = await prisma.constitution.findFirst({
    where: { userId, status: ConstitutionStatus.ACTIVE },
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
      _count: {
        select: {
          values: true,
          principles: true,
          boundaries: true,
          decisions: true,
        },
      },
    },
  });

  if (active) return active;

  return prisma.constitution.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
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
      _count: {
        select: {
          values: true,
          principles: true,
          boundaries: true,
          decisions: true,
        },
      },
    },
  });
}

export async function createConstitution(
  userId: string,
  data: {
    title: string;
    subtitle?: string | null;
    preamble?: string | null;
    missionStatement?: string | null;
    status?: ConstitutionStatus;
    establishedAt?: string | null;
    initialValues?: string[]; // array of valueIds
  }
) {
  return prisma.$transaction(async (tx) => {
    // If setting to active, set existing ones to draft
    if (data.status === ConstitutionStatus.ACTIVE) {
      await tx.constitution.updateMany({
        where: { userId, status: ConstitutionStatus.ACTIVE },
        data: { status: ConstitutionStatus.DRAFT },
      });
    }

    const constitution = await tx.constitution.create({
      data: {
        userId,
        title: data.title,
        subtitle: data.subtitle || null,
        preamble: data.preamble || null,
        missionStatement: data.missionStatement || null,
        status: data.status || ConstitutionStatus.ACTIVE,
        establishedAt: data.establishedAt ? new Date(data.establishedAt) : new Date(),
      },
    });

    if (data.initialValues && data.initialValues.length > 0) {
      await tx.constitutionValue.createMany({
        data: data.initialValues.map((valueId, index) => ({
          constitutionId: constitution.id,
          valueId,
          position: index,
        })),
        skipDuplicates: true,
      });
    }

    return constitution;
  });
}

export async function updateConstitution(
  userId: string,
  constitutionId: string,
  data: {
    title?: string;
    subtitle?: string | null;
    preamble?: string | null;
    missionStatement?: string | null;
    status?: ConstitutionStatus;
    establishedAt?: string | null;
  }
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  return prisma.$transaction(async (tx) => {
    if (data.status === ConstitutionStatus.ACTIVE) {
      await tx.constitution.updateMany({
        where: { userId, status: ConstitutionStatus.ACTIVE, id: { not: constitutionId } },
        data: { status: ConstitutionStatus.DRAFT },
      });
    }

    const updateData: Prisma.ConstitutionUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.preamble !== undefined) updateData.preamble = data.preamble;
    if (data.missionStatement !== undefined) updateData.missionStatement = data.missionStatement;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.establishedAt !== undefined) {
      updateData.establishedAt = data.establishedAt ? new Date(data.establishedAt) : null;
    }

    return tx.constitution.update({
      where: { id: constitutionId },
      data: updateData,
    });
  });
}

export async function deleteConstitution(userId: string, constitutionId: string) {
  await ensureConstitutionOwnership(userId, constitutionId);

  return prisma.constitution.delete({
    where: { id: constitutionId },
  });
}

