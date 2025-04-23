import { authGuard } from "@/lib/hono/middlewares/guard/auth";
import { errorResponses, jsonBody } from "@/lib/hono/openapi";
import { responseWithPaginationSchema } from "@/utils/schemas";
import { createRoute } from "@hono/zod-openapi";
import { getUsersQuery, updateUserRequest, userParam, userSchema } from "./shcemas";

const baseUsersConfig = {
  path: "/users" as const,
  tags: ["users"],
};

/**
 * 自身のユーザー情報を取得するルート設定
 */
export const meRouteConfig = createRoute({
  ...baseUsersConfig,
  method: "get",
  path: "/me",
  middleware: [authGuard()],
  security: [{ authSession: [] }],
  responses: {
    200: {
      description: "User",
      content: jsonBody(userSchema),
    },
    ...errorResponses({}),
  },
});

/**
 * ユーザー一覧を取得するルート設定
 */
export const getUsersConfig = createRoute({
  ...baseUsersConfig,
  method: "get",
  summary: "Get list of users",
  request: {
    query: getUsersQuery.schema,
  },
  responses: {
    200: {
      description: "Users",
      content: jsonBody(responseWithPaginationSchema(userSchema)),
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [getUsersQuery.vErr()],
    }),
  },
});

/**
 * ユーザー情報を更新するルート設定
 */
export const updateUserConfig = createRoute({
  ...baseUsersConfig,
  method: "put",
  path: `${baseUsersConfig.path}/{id}`,
  middleware: [authGuard()],
  security: [{ authSession: [] }],
  summary: "Update a user",
  request: {
    params: userParam.schema,
    body: {
      content: jsonBody(updateUserRequest.schema),
    },
  },
  responses: {
    200: {
      description: "User",
      content: jsonBody(userSchema),
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [userParam.vErr(), updateUserRequest.vErr()],
    }),
  },
});

/**
 * ユーザーの詳細情報を取得するルート設定
 */
export const getUserByIdRouteConfig = createRoute({
  ...baseUsersConfig,
  method: "get",
  path: `${baseUsersConfig.path}/{id}`,
  request: {
    params: userParam.schema,
  },
  responses: {
    200: {
      description: "User",
      content: jsonBody(userSchema),
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [userParam.vErr()],
    }),
  },
});
