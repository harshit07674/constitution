import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function POST() {
  try {
    const user = await requireUser();
    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: { onboardingCompleted: true },
      select: { id: true, name: true, email: true, onboardingCompleted: true },
    });
    return apiSuccess({ user: updated });
  } catch (err) {
    return apiError(err);
  }
}

