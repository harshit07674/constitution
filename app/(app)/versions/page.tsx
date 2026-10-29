import React from "react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getActiveOrFirstConstitution } from "@/lib/services/constitution-service";
import { getConstitutionVersions } from "@/lib/services/versions-service";
import { VersionsClient } from "./VersionsClient";

export default async function VersionHistoryPage() {
  const user = await requireUser();
  const constitution = await getActiveOrFirstConstitution(user.userId);

  if (!constitution) {
    redirect("/onboarding");
  }

  const versions = await getConstitutionVersions(user.userId, constitution.id);

  return (
    <VersionsClient
      constitutionId={constitution.id}
      constitutionTitle={constitution.title}
      initialVersions={versions}
    />
  );
}

