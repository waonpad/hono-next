import { paginationQuerySchema, timestampSchema } from "@/schemas/common";
import { createValidationErrorResponseSchema } from "@/schemas/validation-error";
import { getKeys } from "@/utils";
import { z } from "@hono/zod-openapi";
import "@/lib/zod/i18n/ja";

/**
 * 投稿のスキーマ
 */
export const postSchema = z
  .object({
    id: z.string().openapi({
      example: "hOn012drizZle34aP1",
    }),
    title: z.string().min(1).max(100).openapi({
      example: "HonoDrizzle",
    }),
    body: z.string().min(1).openapi({
      example: "Post body",
    }),
    public: z.boolean().openapi({
      example: true,
    }),
    // authorId: userSchema.shape.id,
  })
  .merge(timestampSchema)
  .openapi("Post");

/**
 * 投稿一覧のクエリパラメータのスキーマ
 */
export const getPostsQuery = {
  schema: paginationQuerySchema
    .merge(
      z.object({
        sort: z
          .enum(["id", "createdAt", "updatedAt"] as const satisfies (keyof typeof postSchema._type)[])
          .default("createdAt")
          .optional()
          .openapi({
            example: "createdAt",
          }),
      }),
    )
    .openapi("GetPostsQuery"),
  validationErrorResponseSchema: () =>
    createValidationErrorResponseSchema({
      keys: getKeys(getPostsQuery.schema.shape),
    }).openapi("GetPostsQueryValidationErrorResponse"),
};

/**
 * 投稿の作成リクエストボディのスキーマ
 */
export const createPostRequest = {
  schema: postSchema
    .pick({
      title: true,
      body: true,
      public: true,
    })
    .openapi("CreatePostRequest"),
  validationErrorResponseSchema: () =>
    createValidationErrorResponseSchema({
      keys: getKeys(createPostRequest.schema.shape),
    }).openapi("CreatePostValidationErrorResponse"),
};

/**
 * 投稿の更新リクエストボディのスキーマ
 */
export const updatePostRequest = {
  schema: postSchema
    .pick({
      title: true,
      body: true,
      public: true,
    })
    .openapi("UpdatePostRequest"),
  validationErrorResponseSchema: () =>
    createValidationErrorResponseSchema({
      keys: getKeys(updatePostRequest.schema.shape),
    }).openapi("UpdatePostValidationErrorResponse"),
};

/**
 * 投稿に関連するパスパラメータのスキーマ
 */
export const postParam = {
  schema: z
    .object({
      id: postSchema.shape.id,
    })
    .openapi("PostParam"),
  validationErrorResponseSchema: () =>
    createValidationErrorResponseSchema({
      keys: getKeys(postParam.schema.shape),
    }).openapi("PostParamValidationErrorResponse"),
};
