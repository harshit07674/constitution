import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { updatePrinciple, deletePrinciple } from "@/lib/services/principles-service";
import { principleSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; principleId: string }> }
) {
  try {
    const user = await requireUser();
    const { id, principleId } = await params;
    const json = await req.json();
    const data = principleSchema.partial().parse(json);

    const principle = await updatePrinciple(user.userId, id, principleId, data);
    return apiSuccess({ principle });
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; principleId: string }> }
) {
  try {
    const user = await requireUser();
    const { id, principleId } = await params;
    await deletePrinciple(user.userId, id, principleId);
    return apiSuccess({ message: "Principle deleted successfully" });
  } catch (err) {
    return apiError(err);
  }
}

