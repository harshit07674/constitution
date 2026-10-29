import React from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getConstitutionDetails } from "@/lib/services/constitution-service";
import { getAllAvailableValues } from "@/lib/services/values-service";
import { ConstitutionEditor } from "./ConstitutionEditor";

export default async function EditConstitutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  let constitution;
  try {
    constitution = await getConstitutionDetails(user.userId, id);
  } catch {
    notFound();
  }

  const availableValues = await getAllAvailableValues(user.userId);

  return (
    <ConstitutionEditor
      initialConstitution={constitution}
      availableValues={availableValues}
      userId={user.userId}
    />
  );
}

