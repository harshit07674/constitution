import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getActiveOrFirstConstitution } from "@/lib/services/constitution-service";

export default async function ConstitutionIndexPage() {
  const user = await requireUser();
  const constitution = await getActiveOrFirstConstitution(user.userId);

  if (constitution) {
    redirect(`/constitution/${constitution.id}`);
  } else {
    redirect("/onboarding");
  }
}

