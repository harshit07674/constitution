import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getAllAvailableValues, createCustomValue } from "@/lib/services/values-service";
import { createCustomValueSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function GET() {
  try {
    const user = await requireUser();
    const values = await getAllAvailableValues(user.userId);
    return apiSuccess({ values });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const json = await req.json();
    const data = createCustomValueSchema.parse(json);

    const value = await createCustomValue(user.userId, data);
    return apiSuccess({ value }, 201);
  } catch (err) {
    return apiError(err);
  }
}

