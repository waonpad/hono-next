import { swaggerUI } from "@hono/swagger-ui";
import type { OpenAPIHono } from "@hono/zod-openapi";

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
