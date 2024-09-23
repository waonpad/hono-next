import { AppErrorStatusCode } from "@/config/status-code";
import { swaggerUI } from "@hono/swagger-ui";
import type { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import "@/lib/zod/i18n/ja";
import { createErrorResponseSchema } from "../errors/schemas";
import type { createValidationErrorResponseSchema } from "../errors/schemas";

const SPEC_PATH = "/spec" as const;

/**
 * Open APIドキュメント関連の設定
 */
export const docs = (app: OpenAPIHono) => {
  app
    /**
     * ドキュメントそのもの
     */
    .doc31(SPEC_PATH, (c) => ({
      openapi: "3.1.0",
      info: {
        title: "API",
        version: "1.0.0",
      },
      servers: [{ url: new URL(c.req.url).origin }],
    }))
    /**
     * Swagger UI
     */
    .get("/doc", swaggerUI({ url: `/api${SPEC_PATH}` }));
};

/**
 * application/json形式のスキーマは頻出なため、毎回書かなくてもいいようにする関数
 */
export const jsonBody = <
  T extends
    | NonNullable<
        NonNullable<Parameters<typeof createRoute>[0]["responses"][number]["content"]>["application/json"]
      >["schema"]
    | NonNullable<
        NonNullable<
          NonNullable<NonNullable<Parameters<typeof createRoute>[0]["request"]>["body"]>["content"]
        >["application/json"]
      >["schema"],
>(
  schema: T,
) => {
  return {
    "application/json": {
      schema: schema,
    },
  };
};

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
      content: jsonBody(
        (() => {
          const baseSchema = createErrorResponseSchema("BAD_REQUEST").openapi("BadRequestErrorResponse");

          const schemas = validationErrorResnponseSchemas;

          return schemas ? z.union([baseSchema, ...schemas]) : baseSchema;
        })(),
      ),
    },
    [AppErrorStatusCode.UNAUTHORIZED]: {
      description: "Unauthorized: authentication required.",
      content: jsonBody(createErrorResponseSchema("UNAUTHORIZED").openapi("UnauthorizedErrorResponse")),
    },
    [AppErrorStatusCode.FORBIDDEN]: {
      description: "Forbidden: insufficient permissions.",
      content: jsonBody(createErrorResponseSchema("FORBIDDEN").openapi("ForbiddenErrorResponse")),
    },
    [AppErrorStatusCode.NOT_FOUND]: {
      description: "Not found: resource does not exist.",
      content: jsonBody(createErrorResponseSchema("NOT_FOUND").openapi("NotFoundErrorResponse")),
    },
    [AppErrorStatusCode.SERVER_ERROR]: {
      description: "Server error: something went wrong.",
      content: jsonBody(createErrorResponseSchema("SERVER_ERROR").openapi("ServerErrorResponse")),
    },
  }) satisfies Parameters<typeof createRoute>[0]["responses"];
