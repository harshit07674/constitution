import { prisma } from "@/lib/db/prisma";
import { ensureConstitutionOwnership } from "./constitution-service";
import { NotFoundError } from "@/lib/errors/api-error";

export async function createPrinciple(
  userId: string,
  constitutionId: string,
  data: {
    title: string;
    statement: string;
    category?: string;
    position?: number;
  }
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  let position = data.position;
  if (position === undefined) {
    const count = await prisma.principle.count({
      where: {
        constitutionId,
        category: data.category || "General",
      },
    });
    position = count;
  }

  return prisma.principle.create({
    data: {
      constitutionId,
      title: data.title.trim(),
      statement: data.statement.trim(),
      category: data.category?.trim() || "General",
      position,
    },
  });
}

export async function updatePrinciple(
  userId: string,
  constitutionId: string,
  principleId: string,
  data: {
    title?: string;
    statement?: string;
    category?: string;
    position?: number;
  }
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  const principle = await prisma.principle.findFirst({
    where: { id: principleId, constitutionId },
  });

  if (!principle) {
    throw new NotFoundError("Principle not found");
  }

  return prisma.principle.update({
    where: { id: principleId },
    data: {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.statement !== undefined ? { statement: data.statement.trim() } : {}),
      ...(data.category !== undefined ? { category: data.category.trim() } : {}),
      ...(data.position !== undefined ? { position: data.position } : {}),
    },
  });
}

export async function deletePrinciple(
  userId: string,
  constitutionId: string,
  principleId: string
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  const principle = await prisma.principle.findFirst({
    where: { id: principleId, constitutionId },
  });

  if (!principle) {
    throw new NotFoundError("Principle not found");
  }

  return prisma.principle.delete({
    where: { id: principleId },
  });
}

export async function reorderPrinciples(
  userId: string,
  constitutionId: string,
  items: { id: string; position: number }[]
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  return prisma.$transaction(
    items.map((item) =>
      prisma.principle.updateMany({
        where: { id: item.id, constitutionId },
        data: { position: item.position },
      })
    )
  );
}

