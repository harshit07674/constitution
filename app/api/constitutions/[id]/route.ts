import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import {
  getConstitutionDetails,
  updateConstitution,
  deleteConstitution,
} from "@/lib/services/constitution-service";
import { constitutionSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const constitution = await getConstitutionDetails(user.userId, id);
    return apiSuccess({ constitution });
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
    const data = constitutionSchema.partial().parse(json);

    const constitution = await updateConstitution(user.userId, id, data);
    return apiSuccess({ constitution });
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
    await deleteConstitution(user.userId, id);
    return apiSuccess({ message: "Constitution deleted successfully" });
  } catch (err) {
    return apiError(err);
  }
}

