import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken, SessionPayload } from "./jwt";
import { UnauthorizedError } from "@/lib/errors/api-error";
import { prisma } from "@/lib/db/prisma";

export async function getSessionUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export async function requireUser(): Promise<SessionPayload> {
  const user = await getSessionUser();
  if (!user) {
    throw new UnauthorizedError("You must be signed in to perform this action");
  }

  // Verify that the user still exists in the database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { id: true, email: true, name: true },
  });

  if (!dbUser) {
    throw new UnauthorizedError("User account no longer exists");
  }

  return {
    userId: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
  };
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

