import { customHono } from "@/lib/hono/custom";
import { prisma } from "@/lib/prisma/client";
import { HTTPException } from "hono/http-exception";
import { createPostConfig, deletePostConfig, getPostByIdConfig, getPostsConfig, updatePostConfig } from "./routes";

export default customHono()
  .openapi(createPostConfig, async (c) => {
    const reqBody = c.req.valid("json");

    const createdPost = await prisma().post.create({
      data: {
        title: reqBody.title,
        body: reqBody.body,
        public: reqBody.public,
      },
    });

    return c.json(createdPost, 201);
  })
  .openapi(updatePostConfig, async (c) => {
    const reqBody = c.req.valid("json");

    const updatedPost = await prisma().post.update({
      where: { id: c.req.valid("param").id },
      data: {
        title: reqBody.title,
        body: reqBody.body,
        public: reqBody.public,
      },
    });

    return c.json(updatedPost, 200);
  })
  .openapi(getPostsConfig, async (c) => {
    const query = c.req.valid("query");

    const posts = await prisma().post.findMany({
      skip: query.offset,
      take: query.limit,
      orderBy: {
        [query.sort ?? "createdAt"]: query.order ?? "asc",
      },
      ...(query.q && {
        where: {
          OR: [{ title: { contains: query.q } }, { body: { contains: query.q } }],
        },
      }),
    });

    return c.json(
      {
        data: {
          items: posts,
          total: await prisma().post.count(),
        },
      },
      200,
    );
  })
  .openapi(getPostByIdConfig, async (c) => {
    const post = await prisma().post.findUnique({
      where: { id: c.req.valid("param").id },
    });

    if (!post) {
      throw new HTTPException(404, {
        message: "後で対応する",
      });
    }

    return c.json(post, 200);
  })
  .openapi(deletePostConfig, async (c) => {
    await prisma().post.delete({
      where: { id: c.req.valid("param").id },
    });

    return c.json(null, 204);
  });
