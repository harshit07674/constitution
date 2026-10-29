import { prisma } from "@/lib/db/prisma";
import { ensureConstitutionOwnership } from "./constitution-service";
import { NotFoundError } from "@/lib/errors/api-error";

export async function createBoundary(
  userId: string,
  constitutionId: string,
  data: {
    title: string;
    description: string;
    domain?: string;
    position?: number;
  }
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  let position = data.position;
  if (position === undefined) {
    const count = await prisma.boundary.count({
      where: {
        constitutionId,
        domain: data.domain || "General",
      },
    });
    position = count;
  }

  return prisma.boundary.create({
    data: {
      constitutionId,
      title: data.title.trim(),
      description: data.description.trim(),
      domain: data.domain?.trim() || "General",
      position,
    },
  });
}

export async function updateBoundary(
  userId: string,
  constitutionId: string,
  boundaryId: string,
  data: {
    title?: string;
    description?: string;
    domain?: string;
    position?: number;
  }
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  const boundary = await prisma.boundary.findFirst({
    where: { id: boundaryId, constitutionId },
  });

  if (!boundary) {
    throw new NotFoundError("Boundary not found");
  }

  return prisma.boundary.update({
    where: { id: boundaryId },
    data: {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.description !== undefined ? { description: data.description.trim() } : {}),
      ...(data.domain !== undefined ? { domain: data.domain.trim() } : {}),
      ...(data.position !== undefined ? { position: data.position } : {}),
    },
  });
}

export async function deleteBoundary(
  userId: string,
  constitutionId: string,
  boundaryId: string
) {
  await ensureConstitutionOwnership(userId, constitutionId);

  const boundary = await prisma.boundary.findFirst({
    where: { id: boundaryId, constitutionId },
  });

  if (!boundary) {
    throw new NotFoundError("Boundary not found");
  }

  return prisma.boundary.delete({
    where: { id: boundaryId },
  });
}

