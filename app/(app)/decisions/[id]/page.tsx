import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getDecisionById } from "@/lib/services/decisions-service";
import { ArrowLeft, Calendar, Shield, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DecisionDetailClient } from "./DecisionDetailClient";

export default async function DecisionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  let decision;
  try {
    decision = await getDecisionById(user.userId, id);
  } catch {
    notFound();
  }

  return (
    <DecisionDetailClient decision={decision} />
  );
}

