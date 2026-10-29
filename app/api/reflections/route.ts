import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getUserReflections, createReflection } from "@/lib/services/reflections-service";
import { reflectionSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function GET() {
  try {
    const user = await requireUser();
    const reflections = await getUserReflections(user.userId);
    return apiSuccess({ reflections });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const json = await req.json();
    const data = reflectionSchema.parse(json);

    const reflection = await createReflection(user.userId, data);
    return apiSuccess({ reflection }, 201);
  } catch (err) {
    return apiError(err);
  }
}

