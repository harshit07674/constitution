import React from "react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getActiveOrFirstConstitution } from "@/lib/services/constitution-service";
import { NewDecisionForm } from "./NewDecisionForm";

export default async function NewDecisionPage() {
  const user = await requireUser();
  const constitution = await getActiveOrFirstConstitution(user.userId);

  if (!constitution) {
    redirect("/onboarding");
  }

  return (
    <NewDecisionForm constitution={constitution} />
  );
}

