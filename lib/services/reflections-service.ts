import { prisma } from "@/lib/db/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/errors/api-error";
import { ensureConstitutionOwnership } from "./constitution-service";

export async function getUserReflections(userId: string) {
  return prisma.weeklyReflection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      constitution: {
        select: { id: true, title: true },
      },
    },
  });
}

export async function createReflection(
  userId: string,
  data: {
    constitutionId?: string | null;
    wentWell: string;
    principlesFollowed: string;
    improvementNotes: string;
  }
) {
  if (data.constitutionId) {
    await ensureConstitutionOwnership(userId, data.constitutionId);
  }

  return prisma.weeklyReflection.create({
    data: {
      userId,
      constitutionId: data.constitutionId || null,
      wentWell: data.wentWell.trim(),
      principlesFollowed: data.principlesFollowed.trim(),
      improvementNotes: data.improvementNotes.trim(),
    },
  });
}

export async function deleteReflection(userId: string, reflectionId: string) {
  const ref = await prisma.weeklyReflection.findUnique({
    where: { id: reflectionId },
  });

  if (!ref) {
    throw new NotFoundError("Reflection not found");
  }

  if (ref.userId !== userId) {
    throw new ForbiddenError("You do not have access to this reflection");
  }

  return prisma.weeklyReflection.delete({
    where: { id: reflectionId },
  });
}

