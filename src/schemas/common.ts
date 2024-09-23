import { AppErrorStatusCode, AppErrorType } from "@/config/status-code";
import { zodLiteralUnionType } from "@/lib/zod";
import { z } from "@hono/zod-openapi";
import "@/lib/zod/i18n/ja";

/**
 * エラーレスポンスのスキーマ
 */
export const errorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    type: z.enum(AppErrorType),
    /**
     * アプリ内で明示的に使用しているHttpエラーのステータスコードだけを許容する
     */
    status: zodLiteralUnionType(Object.values(AppErrorStatusCode)),
  }),
});

/**
 * エラーレスポンスのスキーマを生成する
 */
export const createErrorResponseSchema = (type: typeof errorResponseSchema.shape.error._type.type) => {
  return errorResponseSchema.merge(
    z.object({
      error: errorResponseSchema.shape.error.merge(
        z.object({
          status: z.literal(AppErrorStatusCode[type]),
          type: z.literal(type),
        }),
      ),
    }),
  );
};

/**
 * ページネーションのあるエンドポイントのクエリパラメータのスキーマ
 */
export const paginationQuerySchema = z.object({
  q: z.string().optional().openapi({ description: "検索クエリ" }),
  sort: z.enum(["createdAt"]).default("createdAt").optional().openapi({
    description: "ソートするフィールド",
  }),
  order: z.enum(["asc", "desc"]).default("asc").optional().openapi({
    description: "ソート順",
  }),
  offset: z.coerce.number().default(0).openapi({
    description: "取得するアイテムのオフセット",
  }),
  limit: z.coerce.number().default(50).openapi({
    description: "取得するアイテムの数",
  }),
});

/**
 * ページネーション情報を含むレスポンスのスキーマ
 */
export const responseWithPaginationSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: z.object({
      items: schema.array().openapi({ description: "アイテムの配列" }),
      total: z.number().openapi({ description: "アイテムの総数", example: 1 }),
    }),
  });

export const timestampSchema = z.object({
  createdAt: z.string().datetime().openapi({
    example: "2024-05-22 13:51:19",
  }),
  updatedAt: z.string().datetime().openapi({
    example: "2024-05-22 13:51:19",
  }),
});
