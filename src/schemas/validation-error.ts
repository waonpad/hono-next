import { AppErrorStatusCode, type ErrorType, formatToHttpStatusCode } from "@/config/status-code";
import { errorResponseSchema } from "@/schemas/common";
import { z } from "@hono/zod-openapi";
import "@/lib/zod/i18n/ja";

export const createValidationErrorResponseSchema = <Keys extends string[]>({ keys }: { keys: Keys }) => {
  const fieldErrorSchemas = Object.fromEntries(keys.map((k) => [k, z.string().optional()]));

  const errorType = "VALIDATION_ERROR" satisfies ErrorType;

  return errorResponseSchema.merge(
    z.object({
      error: errorResponseSchema.shape.error.merge(
        z.object({
          type: z.literal(errorType),
          status: z.literal(formatToHttpStatusCode(AppErrorStatusCode[errorType])),
          formErrors: z.string(),
          fieldErrors: z.object(fieldErrorSchemas),
        }),
      ),
    }),
  );
};
