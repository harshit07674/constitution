import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { updateBoundary, deleteBoundary } from "@/lib/services/boundaries-service";
import { boundarySchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; boundaryId: string }> }
) {
  try {
    const user = await requireUser();
    const { id, boundaryId } = await params;
    const json = await req.json();
    const data = boundarySchema.partial().parse(json);

    const boundary = await updateBoundary(user.userId, id, boundaryId, data);
    return apiSuccess({ boundary });
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; boundaryId: string }> }
) {
  try {
    const user = await requireUser();
    const { id, boundaryId } = await params;
    await deleteBoundary(user.userId, id, boundaryId);
    return apiSuccess({ message: "Boundary deleted successfully" });
  } catch (err) {
    return apiError(err);
  }
}

