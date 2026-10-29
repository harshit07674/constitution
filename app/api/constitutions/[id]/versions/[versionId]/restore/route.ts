import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { restoreConstitutionFromVersion } from "@/lib/services/versions-service";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const user = await requireUser();
    const { id, versionId } = await params;
    const restored = await restoreConstitutionFromVersion(user.userId, id, versionId);
    return apiSuccess({ version: restored, message: "Constitution restored successfully" });
  } catch (err) {
    return apiError(err);
  }
}

