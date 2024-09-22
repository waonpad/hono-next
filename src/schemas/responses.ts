import { AppErrorStatusCode } from "@/config/status-code";
import type { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { createErrorResponseSchema } from "./common";
import type { createValidationErrorResponseSchema } from "./validation-error";
import "@/lib/zod/i18n/ja";

type Responses = Parameters<typeof createRoute>[0]["responses"];

/**
 * ページネーション情報を含むレスポンスのスキーマ
 */
export const responseWithPaginationSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: z.object({
      items: schema.array().openapi({ description: "アイテムの配列" }),
      total: z.number().openapi({ description: "アイテムの総数", example: 1 }),
    }),
  });

/**
 * エラーレスポンスのOpen API用の定義
 */
export const errorResponses = ({
  validationErrorResnponseSchemas,
}: {
  validationErrorResnponseSchemas?: [
    ReturnType<typeof createValidationErrorResponseSchema>,
    ...ReturnType<typeof createValidationErrorResponseSchema>[],
  ];
}) =>
  ({
    [AppErrorStatusCode.BAD_REQUEST]: {
      description: "Bad request: problem processing request.",
      content: {
        "application/json": {
          schema: (() => {
            const schemas = validationErrorResnponseSchemas;

            return schemas
              ? z.union([createErrorResponseSchema("BAD_REQUEST").openapi("BadRequestErrorResponse"), ...schemas])
              : createErrorResponseSchema("BAD_REQUEST").openapi("BadRequestErrorResponse");
          })(),
        },
      },
    },
    [AppErrorStatusCode.UNAUTHORIZED]: {
      description: "Unauthorized: authentication required.",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("UNAUTHORIZED").openapi("UnauthorizedErrorResponse"),
        },
      },
    },
    [AppErrorStatusCode.FORBIDDEN]: {
      description: "Forbidden: insufficient permissions.",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("FORBIDDEN").openapi("ForbiddenErrorResponse"),
        },
      },
    },
    [AppErrorStatusCode.NOT_FOUND]: {
      description: "Not found: resource does not exist.",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("NOT_FOUND").openapi("NotFoundErrorResponse"),
        },
      },
    },
    [AppErrorStatusCode.SERVER_ERROR]: {
      description: "Server error: something went wrong.",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("SERVER_ERROR").openapi("ServerErrorResponse"),
        },
      },
    },
  }) satisfies Responses;
