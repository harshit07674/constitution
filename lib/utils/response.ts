import { NextResponse } from "next/server";
import { ApiError } from "@/lib/errors/api-error";
import { ZodError } from "zod";

export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiResponseError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function apiSuccess<T>(data: T, status = 200, meta?: Record<string, unknown>) {
  const body: ApiResponseSuccess<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
  return NextResponse.json(body, { status });
}

export function apiError(error: unknown) {
  if (error instanceof ApiError) {
    const body: ApiResponseError = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
    return NextResponse.json(body, { status: error.statusCode });
  }

  if (error instanceof ZodError) {
    const body: ApiResponseError = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input fields",
        details: error.flatten().fieldErrors,
      },
    };
    return NextResponse.json(body, { status: 400 });
  }

  console.error("Unhandled API error:", error);
  const body: ApiResponseError = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred. Please try again.",
    },
  };
  return NextResponse.json(body, { status: 500 });
}

