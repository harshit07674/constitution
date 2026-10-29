import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { removeValueFromConstitution } from "@/lib/services/values-service";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; valueId: string }> }
) {
  try {
    const user = await requireUser();
    const { id, valueId } = await params;
    await removeValueFromConstitution(user.userId, id, valueId);
    return apiSuccess({ message: "Value removed from constitution" });
  } catch (err) {
    return apiError(err);
  }
}

