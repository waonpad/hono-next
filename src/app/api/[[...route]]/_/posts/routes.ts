import { authGuard } from "@/lib/hono/middlewares/guard/auth";
import { errorResponses, jsonBody } from "@/lib/hono/openapi";
import { responseWithPaginationSchema } from "@/utils/schemas";
import { createRoute } from "@hono/zod-openapi";
import { createPostRequest, getPostsQuery, postParam, postSchema, updatePostRequest } from "./schemas";

const basePostsConfig = {
  path: "/posts" as const,
  tags: ["posts"],
};

/**
 * 投稿一覧を取得するルート設定
 */
export const getPostsConfig = createRoute({
  ...basePostsConfig,
  method: "get",
  summary: "Get list of posts",
  request: {
    query: getPostsQuery.schema,
  },
  responses: {
    200: {
      description: "Posts",
      content: jsonBody(responseWithPaginationSchema(postSchema)),
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [getPostsQuery.vErr()],
    }),
  },
});

/**
 * 投稿を作成するルート設定
 */
export const createPostConfig = createRoute({
  ...basePostsConfig,
  method: "post",
  middleware: [authGuard()],
  security: [{ authSession: [] }],
  summary: "Create a post",
  request: {
    body: {
      content: jsonBody(createPostRequest.schema),
    },
  },
  responses: {
    201: {
      description: "Post",
      content: jsonBody(postSchema),
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [createPostRequest.vErr()],
    }),
  },
});

/**
 * 投稿情報を更新するルート設定
 */
export const updatePostConfig = createRoute({
  ...basePostsConfig,
  method: "put",
  path: `${basePostsConfig.path}/{id}`,
  middleware: [authGuard()],
  security: [{ authSession: [] }],
  summary: "Update a post",
  request: {
    params: postParam.schema,
    body: {
      content: jsonBody(updatePostRequest.schema),
    },
  },
  responses: {
    200: {
      description: "Post",
      content: jsonBody(postSchema),
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [postParam.vErr(), updatePostRequest.vErr()],
    }),
  },
});

/**
 * 投稿の詳細情報を取得するルート設定
 */
export const getPostByIdConfig = createRoute({
  ...basePostsConfig,
  method: "get",
  path: `${basePostsConfig.path}/{id}`,
  request: {
    params: postParam.schema,
  },
  responses: {
    200: {
      description: "Post",
      content: jsonBody(postSchema),
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [postParam.vErr()],
    }),
  },
});

/**
 * 投稿を削除するルート設定
 */
export const deletePostConfig = createRoute({
  ...basePostsConfig,
  method: "delete",
  path: `${basePostsConfig.path}/{id}`,
  middleware: [authGuard()],
  security: [{ authSession: [] }],
  summary: "Delete a post",
  request: {
    params: postParam.schema,
  },
  responses: {
    204: { description: "No content" },
    ...errorResponses({
      validationErrorResnponseSchemas: [postParam.vErr()],
    }),
  },
});
