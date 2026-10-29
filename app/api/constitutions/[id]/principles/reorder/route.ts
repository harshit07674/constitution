import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { reorderPrinciples } from "@/lib/services/principles-service";
import { reorderPrinciplesSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const json = await req.json();
    const data = reorderPrinciplesSchema.parse(json);

    await reorderPrinciples(user.userId, id, data.items);
    return apiSuccess({ message: "Principles reordered successfully" });
  } catch (err) {
    return apiError(err);
  }
}

