import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getUserDecisions, createDecision } from "@/lib/services/decisions-service";
import { decisionSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const constitutionId = req.nextUrl.searchParams.get("constitutionId") || undefined;
    const decisions = await getUserDecisions(user.userId, constitutionId);
    return apiSuccess({ decisions });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const json = await req.json();
    const data = decisionSchema.parse(json);

    const decision = await createDecision(user.userId, data);
    return apiSuccess({ decision }, 201);
  } catch (err) {
    return apiError(err);
  }
}

