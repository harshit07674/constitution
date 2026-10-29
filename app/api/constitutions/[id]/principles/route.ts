import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { createPrinciple } from "@/lib/services/principles-service";
import { principleSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const json = await req.json();
    const data = principleSchema.parse(json);

    const principle = await createPrinciple(user.userId, id, data);
    return apiSuccess({ principle }, 201);
  } catch (err) {
    return apiError(err);
  }
}

