import { AppErrorStatusCode, type ErrorType, formatToHttpStatusCode } from "@/config/status-code";
import { errorResponseSchema } from "@/schemas/common";
import { z } from "@hono/zod-openapi";
import "@/lib/zod/i18n/ja";
import { getKeys } from "@/utils";
// biome-ignore lint/nursery/noRestrictedImports: <explanation>
import type { AnyZodObject } from "zod";

export const createValidationErrorResponseSchema = <T extends AnyZodObject>(schema: T) => {
  const keys = getKeys(schema.shape);

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
