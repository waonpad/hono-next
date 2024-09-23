import { jsonBody } from "@/lib/hono/openapi";
import { errorResponses, responseWithPaginationSchema } from "@/schemas/responses";
import { createRoute } from "@hono/zod-openapi";
import { createPostRequest, getPostsQuery, postParam, postSchema, updatePostRequest } from "./schemas";
/**
 * 投稿一覧を取得するルート設定
 */
export const getPostsConfig = createRoute({
  method: "get",
  path: "/posts",
  tags: ["posts"],
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
  method: "post",
  path: "/posts",
  tags: ["posts"],
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
  method: "put",
  path: "/posts/{id}",
  tags: ["posts"],
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
  method: "get",
  path: "/posts/{id}",
  tags: ["posts"],
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
  method: "delete",
  path: "/posts/{id}",
  tags: ["posts"],
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
