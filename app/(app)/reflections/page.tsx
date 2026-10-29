import React from "react";
import { requireUser } from "@/lib/auth/session";
import { getUserReflections } from "@/lib/services/reflections-service";
import { getActiveOrFirstConstitution } from "@/lib/services/constitution-service";
import { ReflectionsClient } from "./ReflectionsClient";

export default async function WeeklyReflectionsPage() {
  const user = await requireUser();
  const reflections = await getUserReflections(user.userId);
  const constitution = await getActiveOrFirstConstitution(user.userId);

  return (
    <ReflectionsClient
      initialReflections={reflections}
      constitutionId={constitution?.id || null}
    />
  );
}

