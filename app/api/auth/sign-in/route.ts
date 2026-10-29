import { NextRequest } from "next/server";
import { loginSchema } from "@/lib/validation/schemas";
import { verifyPassword, createSessionToken } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { apiSuccess, apiError } from "@/lib/utils/response";
import { UnauthorizedError } from "@/lib/errors/api-error";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = loginSchema.parse(json);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValid = await verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    await setSessionCookie(token);

    return apiSuccess({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (err) {
    return apiError(err);
  }
}

