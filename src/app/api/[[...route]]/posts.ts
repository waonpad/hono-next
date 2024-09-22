import { z } from "@/lib/zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updatePostSchema = z.object({
  content: z.string(),
});

const app = new Hono()
  .get("/", async (c) => {
    const posts: (typeof postSchema._type)[] = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      title: "Hello, World!",
      content: "This is a post.",
    }));

    return c.json(posts);
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const data = c.req.valid("json");

    const post = {
      id: String(Math.random()),
      title: data.title,
      content: data.content,
    };

    return c.json(post, 201);
  })
  .get("/:id", async (c) => {
    const post = {
      id: c.req.param("id"),
      text: "Hello, World!",
    };

    return c.json(post);
  })
  .put("/:id", zValidator("json", updatePostSchema), async (c) => {
    const data = c.req.valid("json");

    const post = {
      id: c.req.param("id"),
      title: "Hello, World!",
      content: data.content,
    };

    return c.json(post);
  })
  .delete("/:id", async (c) => {
    return c.json(null, 204);
  });

export default app;
