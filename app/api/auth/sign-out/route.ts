import { clearSessionCookie } from "@/lib/auth/session";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function POST() {
  try {
    await clearSessionCookie();
    return apiSuccess({ message: "Successfully signed out" });
  } catch (err) {
    return apiError(err);
  }
}

