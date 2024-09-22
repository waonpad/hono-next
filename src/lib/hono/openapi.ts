import { swaggerUI } from "@hono/swagger-ui";
import type { OpenAPIHono } from "@hono/zod-openapi";

/**
 * Open APIドキュメント関連の設定
 */
export const docs = (app: OpenAPIHono) => {
  app
    /**
     * openapiドキュメントそのもの
     */
    .doc31("/specification", (c) => ({
      openapi: "3.1.0",
      info: {
        title: "API",
        version: "1.0.0",
      },
      servers: [
        {
          url: new URL(c.req.url).origin,
          description: "Current environment",
        },
      ],
    }))
    /**
     * swagger-ui \
     */
    .get(
      "/doc",
      swaggerUI({
        url: "/api/specification",
      }),
    );
};
