import React from "react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const user = await requireUser();

  const userStats = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: {
          constitutions: true,
          decisions: true,
          reflections: true,
        },
      },
    },
  });

  return (
    <SettingsClient userStats={userStats} />
  );
}

