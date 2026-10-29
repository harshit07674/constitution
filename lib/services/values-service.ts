import { prisma } from "@/lib/db/prisma";
import { ensureConstitutionOwnership } from "./constitution-service";
import { ConflictError, NotFoundError, ForbiddenError } from "@/lib/errors/api-error";

export async function getAllAvailableValues(userId: string) {
  return prisma.value.findMany({
    where: {
      OR: [{ isSystem: true }, { userId }],
    },
    orderBy: [{ isSystem: "desc" }, { name: "asc" }],
  });
}

export async function createCustomValue(
  userId: string,
  data: { name: string; description?: string | null }
) {
  const slug = data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Check if system value or user's custom value already exists with this slug
  const existing = await prisma.value.findFirst({
    where: {
      slug,
      OR: [{ isSystem: true }, { userId }],
    },
  });

  if (existing) {
    throw new ConflictError(`A value named "${data.name}" already exists`);
  }

  return prisma.value.create({
    data: {
      name: data.name.trim(),
      slug: `${slug}-${userId.slice(0, 8)}`,
      description: data.description?.trim() || null,
      isSystem: false,
      userId,
    },
  });
}

export async function updateCustomValue(
  userId: string,
  valueId: string,
  data: { name?: string; description?: string | null }
) {
  const val = await prisma.value.findUnique({
    where: { id: valueId },
  });

  if (!val) {
    throw new NotFoundError("Value not found");
  }

  if (val.isSystem || val.userId !== userId) {
    throw new ForbiddenError("You cannot modify curated system values or other users' values");
  }

  return prisma.value.update({
    where: { id: valueId },
    data: {
      ...(data.name ? { name: data.name.trim() } : {}),
      ...(data.description !== undefined ? { description: data.description?.trim() || null } : {}),
    },
  });
}

export async function addValueToConstitution(
  userId: string,
  constitutionId: string,
  data: { valueId: string; personalNote?: string | null; position?: number }
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  // Check value exists and is accessible
  const val = await prisma.value.findUnique({
    where: { id: data.valueId },
  });

  if (!val || (!val.isSystem && val.userId !== userId)) {
    throw new NotFoundError("Value not found or inaccessible");
  }

  // Check for duplicate assignment
  const existing = await prisma.constitutionValue.findUnique({
    where: {
      constitutionId_valueId: {
        constitutionId,
        valueId: data.valueId,
      },
    },
  });

  if (existing) {
    throw new ConflictError("This value has already been added to your constitution");
  }

  let position = data.position;
  if (position === undefined) {
    const count = await prisma.constitutionValue.count({
      where: { constitutionId },
    });
    position = count;
  }

  return prisma.constitutionValue.create({
    data: {
      constitutionId,
      valueId: data.valueId,
      personalNote: data.personalNote || null,
      position,
    },
    include: {
      value: true,
    },
  });
}

export async function removeValueFromConstitution(
  userId: string,
  constitutionId: string,
  valueId: string
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  return prisma.constitutionValue.deleteMany({
    where: {
      constitutionId,
      valueId,
    },
  });
}

