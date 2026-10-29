import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { addValueToConstitution } from "@/lib/services/values-service";
import { addConstitutionValueSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const json = await req.json();
    const data = addConstitutionValueSchema.parse(json);

    const constitutionValue = await addValueToConstitution(user.userId, id, data);
    return apiSuccess({ constitutionValue }, 201);
  } catch (err) {
    return apiError(err);
  }
}

