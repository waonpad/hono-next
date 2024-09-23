import { errorResponse } from "@/lib/errors";
import { customHono } from "@/lib/hono/custom";
import { prisma } from "@/lib/prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getUserByIdRouteConfig, getUsersConfig, meRouteConfig, updateUserConfig } from "./routes";

export default customHono()
  .openapi(meRouteConfig, async (c) => {
    const user = await prisma.user.findUnique({
      where: { id: c.get("user")!.id },
    });

    if (!user) {
      return errorResponse(c, {
        type: "NOT_FOUND",
        message: "ユーザーが見つかりませんでした。",
      });
    }

    return c.json(user, 200);
  })
  .openapi(updateUserConfig, async (c) => {
    const reqBody = c.req.valid("json");

    try {
      const updatedUser = await prisma.user.update({
        where: { id: c.req.valid("param").id },
        data: {
          name: reqBody.name,
        },
      });

      return c.json(updatedUser, 200);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        return errorResponse(c, {
          type: "NOT_FOUND",
          message: "更新対象のユーザーが見つかりませんでした。",
        });
      }

      throw e;
    }
  })
  .openapi(getUsersConfig, async (c) => {
    const query = c.req.valid("query");

    const users = await prisma.user.findMany({
      skip: query.offset,
      take: query.limit,
      orderBy: {
        [query.sort ?? "createdAt"]: query.order ?? "asc",
      },
      ...(query.q && {
        where: {
          OR: [{ name: { contains: query.q } }],
        },
      }),
    });

    return c.json(
      {
        data: {
          items: users,
          total: await prisma.user.count(),
        },
      },
      200,
    );
  })
  .openapi(getUserByIdRouteConfig, async (c) => {
    const user = await prisma.user.findUnique({
      where: { id: c.req.valid("param").id },
    });

    if (!user) {
      return errorResponse(c, {
        type: "NOT_FOUND",
        message: "ユーザーが見つかりませんでした。",
      });
    }

    return c.json(user, 200);
  });
