import { customHono } from "@/lib/hono/custom";
import { createPostConfig, deletePostConfig, getPostByIdConfig, getPostsConfig, updatePostConfig } from "./routes";

export default customHono()
  .openapi(createPostConfig, async (c) => {
    const reqBody = c.req.valid("json");

    return c.json(
      {
        id: "1",
        title: reqBody.title,
        body: reqBody.body,
        public: reqBody.public,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      201,
    );
  })
  .openapi(updatePostConfig, async (c) => {
    const reqBody = c.req.valid("json");

    return c.json(
      {
        id: c.req.valid("param").id,
        title: reqBody.title,
        body: reqBody.body,
        public: reqBody.public,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      200,
    );
  })
  .openapi(getPostsConfig, async (c) => {
    return c.json(
      {
        data: {
          items: Array.from({ length: 10 }, (_, i) => ({
            id: String(i),
            title: "Hello, World!",
            body: "This is a post.",
            public: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
          total: 10,
        },
      },
      200,
    );
  })
  .openapi(getPostByIdConfig, async (c) => {
    return c.json(
      {
        id: c.req.valid("param").id,
        title: "Hello, World!",
        body: "This is a post.",
        public: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      200,
    );
  })
  .openapi(deletePostConfig, async (c) => {
    return c.json(null, 204);
  });
