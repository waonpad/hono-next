import { AppErrorStatusCode, type AppErrorType } from "@/config/status-code";
import type { Hook } from "@hono/zod-openapi";
import type { createValidationErrorResponseSchema } from "../errors/schemas";
import type { Env } from "./custom";

/**
 * バリデーションエラーが発生した時のデフォルト処理
 */
export const defaultHook: Hook<unknown, Env, "", unknown> = (result, c) => {
  if (result.success) return;

  // エラーをfflatenして取得
  const { formErrors, fieldErrors } = result.error.flatten();

  // アプリケーション内でエラーの種類を識別するための文字列
  const errorType = "VALIDATION_ERROR" satisfies AppErrorType;

  const status = AppErrorStatusCode[errorType];

  return c.json(
    {
      error: {
        message: "バリデーションエラーが発生しました",
        type: errorType,
        status,
        // フォーム全体に関するエラーメッセージ
        formErrors: formErrors[0],
        // flattenしたフィールド名とエラーメッセージのキーバリュー
        fieldErrors: Object.fromEntries(Object.entries(fieldErrors).map(([key, value]) => [key, (value ?? [])[0]])),
      },
    } satisfies ReturnType<typeof createValidationErrorResponseSchema>["_type"],
    status,
  );
};
