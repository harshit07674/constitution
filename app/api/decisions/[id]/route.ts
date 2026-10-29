import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import {
  getDecisionById,
  updateDecision,
  deleteDecision,
} from "@/lib/services/decisions-service";
import { decisionSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const decision = await getDecisionById(user.userId, id);
    return apiSuccess({ decision });
  } catch (err) {
    return apiError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const json = await req.json();
    const data = decisionSchema.partial().parse(json);

    const decision = await updateDecision(user.userId, id, data);
    return apiSuccess({ decision });
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await deleteDecision(user.userId, id);
    return apiSuccess({ message: "Decision deleted successfully" });
  } catch (err) {
    return apiError(err);
  }
}

