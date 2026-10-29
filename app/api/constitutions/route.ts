import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getUserConstitutions, createConstitution } from "@/lib/services/constitution-service";
import { constitutionSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";
import { z } from "zod";

const createWithValuesSchema = constitutionSchema.extend({
  initialValues: z.array(z.string().uuid()).optional(),
});

export async function GET() {
  try {
    const user = await requireUser();
    const constitutions = await getUserConstitutions(user.userId);
    return apiSuccess({ constitutions });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const json = await req.json();
    const data = createWithValuesSchema.parse(json);

    const constitution = await createConstitution(user.userId, data);
    return apiSuccess({ constitution }, 201);
  } catch (err) {
    return apiError(err);
  }
}

