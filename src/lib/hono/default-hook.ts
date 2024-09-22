import { AppErrorStatusCode, type ErrorType, formatToHttpStatusCode } from "@/config/status-code";
import type { createValidationErrorResponseSchema } from "@/schemas/validation-error";
import type { Hook } from "@hono/zod-openapi";
// biome-ignore lint/nursery/noRestrictedImports: <explanation>
import { ZodError } from "zod";
import type { Env } from "./custom";

/**
 * バリデーションエラーが発生した時のデフォルト処理
 */
export const defaultHook: Hook<unknown, Env, "", unknown> = (result, c) => {
  if (!result.success && result.error instanceof ZodError) {
    const error = result.error;

    const { formErrors, fieldErrors } = error.flatten();

    const errorType = "VALIDATION_ERROR" satisfies ErrorType;

    return c.json(
      {
        error: {
          message: "バリデーションエラーが発生しました",
          type: errorType,
          status: formatToHttpStatusCode(AppErrorStatusCode[errorType]),
          formErrors: formErrors[0],
          fieldErrors: Object.fromEntries(Object.entries(fieldErrors).map(([key, value]) => [key, (value ?? [])[0]])),
        },
      } satisfies ReturnType<typeof createValidationErrorResponseSchema>["_type"],
      400,
    );
  }
};
