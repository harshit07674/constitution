import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { createBoundary } from "@/lib/services/boundaries-service";
import { boundarySchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const json = await req.json();
    const data = boundarySchema.parse(json);

    const boundary = await createBoundary(user.userId, id, data);
    return apiSuccess({ boundary }, 201);
  } catch (err) {
    return apiError(err);
  }
}

