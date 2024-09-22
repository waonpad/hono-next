import {
  AppErrorStatusCode,
  ErrorTypeMap,
  type HttpErrorStatusCode,
  formatToHttpStatusCode,
} from "@/config/status-code";
import type { errorSchema, errorTypeSchema } from "@/schemas/common";
import type { z } from "@hono/zod-openapi";
import type { Context } from "hono";

/**
 * エラーレスポンスをjson形式に詰め替えて返す関数
 */
export const errorResponse = (
  c: Context,
  {
    message,
    type,
    status,
    err,
  }: {
    message: string;
    err?: Error;
  } & (
    | {
        type: z.infer<typeof errorTypeSchema>;
        status?: never;
      }
    | {
        type?: never;
        status: AppErrorStatusCode | HttpErrorStatusCode;
      }
  ),
) => {
  if (err) console.error(err);

  const { isAppErrorStatusCode, status: typedStatusCode } = status
    ? Object.values(AppErrorStatusCode).some((v) => v === status)
      ? ({
          isAppErrorStatusCode: true,
          status: status as AppErrorStatusCode,
        } as const)
      : ({
          isAppErrorStatusCode: false,
          status: status as HttpErrorStatusCode,
        } as const)
    : ({
        isAppErrorStatusCode: true,
        status: AppErrorStatusCode[type],
      } as const);

  const statusCode = isAppErrorStatusCode ? typedStatusCode : 500;
  const httpStatusCode = formatToHttpStatusCode(
    status ? (isAppErrorStatusCode ? typedStatusCode : 500) : AppErrorStatusCode[type],
  );

  const error: (typeof errorSchema)["_type"] = {
    message,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    type: type || ErrorTypeMap.get(statusCode)!,
    status: httpStatusCode,
  };

  return c.json({ error }, httpStatusCode);
};
