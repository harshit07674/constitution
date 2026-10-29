import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getConstitutionDetails } from "@/lib/services/constitution-service";
import { DocumentPrintView } from "./DocumentPrintView";

export default async function ConstitutionDocumentPage({
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

  return (
    <DocumentPrintView constitution={constitution} userName={user.name} />
  );
}

