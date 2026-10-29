import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import {
  getConstitutionVersions,
  createConstitutionSnapshot,
} from "@/lib/services/versions-service";
import { createVersionSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const versions = await getConstitutionVersions(user.userId, id);
    return apiSuccess({ versions });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    let note: string | undefined;
    try {
      const json = await req.json();
      const data = createVersionSchema.parse(json);
      note = data.note || undefined;
    } catch {
      // note is optional
    }

    const version = await createConstitutionSnapshot(user.userId, id, note);
    return apiSuccess({ version }, 201);
  } catch (err) {
    return apiError(err);
  }
}

