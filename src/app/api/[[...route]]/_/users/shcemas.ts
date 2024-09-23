import { createValidationErrorResponseSchema } from "@/lib/errors/schemas";
import { paginationQuerySchema, timestampSchema } from "@/utils/schemas";
import { z } from "@hono/zod-openapi";

/**
 * ユーザーのスキーマ
 */
export const userSchema = z
  .object({
    id: z.string().openapi({ example: "hOn012drizZle34aP1" }),
    name: z.string().min(2).max(100).openapi({ example: "John Doe" }),
  })
  .merge(timestampSchema)
  .openapi("User");

/**
 * ユーザー一覧のクエリパラメータのスキーマ
 */
export const getUsersQuery = {
  schema: paginationQuerySchema
    .merge(
      z.object({
        sort: z
          .enum(["id", "name", "createdAt", "updatedAt"] as const satisfies (keyof typeof userSchema._type)[])
          .default("createdAt")
          .optional()
          .openapi({ example: "createdAt" }),
      }),
    )
    .openapi("GetUsersQuery"),
  vErr: () => createValidationErrorResponseSchema(getUsersQuery.schema).openapi("GetUsersQueryValidationErrorResponse"),
};

/**
 * ユーザーの更新リクエストボディのスキーマ
 */
export const updateUserRequest = {
  schema: userSchema.pick({ name: true }),
  vErr: () =>
    createValidationErrorResponseSchema(updateUserRequest.schema).openapi("UpdateUserValidationErrorResponse"),
};

/**
 * ユーザーに関連するパスパラメータのスキーマ
 */
export const userParam = {
  schema: z.object({ id: userSchema.shape.id }).openapi("UserParam"),
  vErr: () => createValidationErrorResponseSchema(userParam.schema).openapi("UserParamValidationErrorResponse"),
};

export const userPasswordSchema = z
  .string()
  .min(8)
  .max(100)
  .openapi({ example: "password123" })
  .openapi("UserPassword");
