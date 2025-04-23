import { errorResponse } from "@/lib/errors";
import { customHono } from "@/lib/hono/custom";
import { prisma } from "@/lib/prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createPostConfig, deletePostConfig, getPostByIdConfig, getPostsConfig, updatePostConfig } from "./routes";

export default customHono()
  .openapi(createPostConfig, async (c) => {
    const reqBody = c.req.valid("json");

    const createdPost = await prisma.post.create({
      data: {
        title: reqBody.title,
        body: reqBody.body,
        public: reqBody.public,
        authorId: c.get("user")!.id,
      },
    });

    return c.json(createdPost, 201);
  })
  .openapi(updatePostConfig, async (c) => {
    const reqBody = c.req.valid("json");

    try {
      const updatedPost = await prisma.post.update({
        where: { id: c.req.valid("param").id, authorId: c.get("user")!.id },
        data: {
          title: reqBody.title,
          body: reqBody.body,
          public: reqBody.public,
        },
      });

      return c.json(updatedPost, 200);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        return errorResponse(c, {
          type: "NOT_FOUND",
          message: "更新対象の投稿が見つかりませんでした。",
        });
      }

      throw e;
    }
  })
  .openapi(getPostsConfig, async (c) => {
    const query = c.req.valid("query");

    const posts = await prisma.post.findMany({
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
          total: await prisma.post.count(),
        },
      },
      200,
    );
  })
  .openapi(getPostByIdConfig, async (c) => {
    const post = await prisma.post.findUnique({
      where: { id: c.req.valid("param").id },
    });

    if (!post) {
      return errorResponse(c, {
        type: "NOT_FOUND",
        message: "投稿が見つかりませんでした。",
      });
    }

    return c.json(post, 200);
  })
  .openapi(deletePostConfig, async (c) => {
    try {
      await prisma.post.delete({
        where: { id: c.req.valid("param").id, authorId: c.get("user")!.id },
      });

      // nextがステータスコード204を返すとエラーになるのでResponseを返す
      return new Response(null, { status: 204 });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        return errorResponse(c, {
          type: "NOT_FOUND",
          message: "削除対象の投稿が見つかりませんでした。",
        });
      }

      throw e;
    }
  });
