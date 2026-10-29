import { prisma } from "@/lib/db/prisma";
import { ensureConstitutionOwnership } from "./constitution-service";
import { NotFoundError, ForbiddenError } from "@/lib/errors/api-error";

export async function getUserDecisions(userId: string, constitutionId?: string) {
  return prisma.decisionEntry.findMany({
    where: {
      userId,
      ...(constitutionId ? { constitutionId } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      values: {
        include: { value: true },
      },
      constitution: {
        select: { id: true, title: true },
      },
    },
  });
}

export async function getDecisionById(userId: string, decisionId: string) {
  const decision = await prisma.decisionEntry.findUnique({
    where: { id: decisionId },
    include: {
      values: {
        include: { value: true },
      },
      constitution: {
        select: { id: true, title: true },
      },
    },
  });

  if (!decision) {
    throw new NotFoundError("Decision entry not found");
  }

  if (decision.userId !== userId) {
    throw new ForbiddenError("You do not have access to this decision entry");
  }

  return decision;
}

export async function createDecision(
  userId: string,
  data: {
    constitutionId: string;
    title: string;
    context: string;
    domain: string;
    reflection?: string | null;
    valueIds?: string[];
  }
) {
  // Ensure the constitution belongs to this user
  await ensureConstitutionOwnership(userId, data.constitutionId);

  return prisma.decisionEntry.create({
    data: {
      userId,
      constitutionId: data.constitutionId,
      title: data.title.trim(),
      context: data.context.trim(),
      domain: data.domain.trim(),
      reflection: data.reflection?.trim() || null,
      values: data.valueIds && data.valueIds.length > 0
        ? {
            create: data.valueIds.map((valId) => ({
              valueId: valId,
            })),
          }
        : undefined,
    },
    include: {
      values: {
        include: { value: true },
      },
    },
  });
}

export async function updateDecision(
  userId: string,
  decisionId: string,
  data: {
    title?: string;
    context?: string;
    domain?: string;
    reflection?: string | null;
    valueIds?: string[];
  }
) {
  const decision = await prisma.decisionEntry.findUnique({
    where: { id: decisionId },
  });

  if (!decision) {
    throw new NotFoundError("Decision entry not found");
  }

  if (decision.userId !== userId) {
    throw new ForbiddenError("You do not have access to this decision entry");
  }

  return prisma.$transaction(async (tx) => {
    if (data.valueIds) {
      await tx.decisionValue.deleteMany({
        where: { decisionId },
      });

      if (data.valueIds.length > 0) {
        await tx.decisionValue.createMany({
          data: data.valueIds.map((valId) => ({
            decisionId,
            valueId: valId,
          })),
        });
      }
    }

    return tx.decisionEntry.update({
      where: { id: decisionId },
      data: {
        ...(data.title !== undefined ? { title: data.title.trim() } : {}),
        ...(data.context !== undefined ? { context: data.context.trim() } : {}),
        ...(data.domain !== undefined ? { domain: data.domain.trim() } : {}),
        ...(data.reflection !== undefined ? { reflection: data.reflection?.trim() || null } : {}),
      },
      include: {
        values: {
          include: { value: true },
        },
      },
    });
  });
}

export async function deleteDecision(userId: string, decisionId: string) {
  const decision = await prisma.decisionEntry.findUnique({
    where: { id: decisionId },
  });

  if (!decision) {
    throw new NotFoundError("Decision entry not found");
  }

  if (decision.userId !== userId) {
    throw new ForbiddenError("You do not have access to this decision entry");
  }

  return prisma.decisionEntry.delete({
    where: { id: decisionId },
  });
}

