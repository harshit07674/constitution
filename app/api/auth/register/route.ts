import { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validation/schemas";
import { hashPassword, createSessionToken } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { apiSuccess, apiError } from "@/lib/utils/response";
import { ConflictError } from "@/lib/errors/api-error";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = registerSchema.parse(json);

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictError("An account with this email address already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    });

    // Generate JWT and set secure cookie
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    await setSessionCookie(token);

    return apiSuccess({ user }, 201);
  } catch (err) {
    return apiError(err);
  }
}

