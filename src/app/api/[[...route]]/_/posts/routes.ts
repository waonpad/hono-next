import { createRouteConfig } from "@/lib/hono/route-config";
import { errorResponses, responseWithPaginationSchema } from "@/schemas/responses";
import { createPostRequest, getPostsQuery, postParam, postSchema, updatePostRequest } from "./schemas";
/**
 * 投稿一覧を取得するルート設定
 */
export const getPostsConfig = createRouteConfig({
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
      content: {
        "application/json": {
          schema: responseWithPaginationSchema(postSchema),
        },
      },
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [getPostsQuery.vErr()],
    }),
  },
});

/**
 * 投稿を作成するルート設定
 */
export const createPostConfig = createRouteConfig({
  method: "post",
  path: "/posts",
  tags: ["posts"],
  summary: "Create a post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createPostRequest.schema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Post",
      content: {
        "application/json": {
          schema: postSchema,
        },
      },
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [createPostRequest.vErr()],
    }),
  },
});

/**
 * 投稿情報を更新するルート設定
 */
export const updatePostConfig = createRouteConfig({
  method: "put",
  path: "/posts/{id}",
  tags: ["posts"],
  summary: "Update a post",
  request: {
    params: postParam.schema,
    body: {
      content: {
        "application/json": {
          schema: updatePostRequest.schema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Post",
      content: {
        "application/json": {
          schema: postSchema,
        },
      },
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [postParam.vErr(), updatePostRequest.vErr()],
    }),
  },
});

/**
 * 投稿の詳細情報を取得するルート設定
 */
export const getPostByIdConfig = createRouteConfig({
  method: "get",
  path: "/posts/{id}",
  tags: ["posts"],
  request: {
    params: postParam.schema,
  },
  responses: {
    200: {
      description: "Post",
      content: {
        "application/json": {
          schema: postSchema,
        },
      },
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [postParam.vErr()],
    }),
  },
});

/**
 * 投稿を削除するルート設定
 */
export const deletePostConfig = createRouteConfig({
  method: "delete",
  path: "/posts/{id}",
  tags: ["posts"],
  summary: "Delete a post",
  request: {
    params: postParam.schema,
  },
  responses: {
    204: {
      description: "No content",
    },
    ...errorResponses({
      validationErrorResnponseSchemas: [postParam.vErr()],
    }),
  },
});
