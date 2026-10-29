import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return apiSuccess({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    });

    return apiSuccess({ user });
  } catch (err) {
    return apiError(err);
  }
}

