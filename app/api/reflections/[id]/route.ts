import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { deleteReflection } from "@/lib/services/reflections-service";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await deleteReflection(user.userId, id);
    return apiSuccess({ message: "Reflection deleted successfully" });
  } catch (err) {
    return apiError(err);
  }
}

