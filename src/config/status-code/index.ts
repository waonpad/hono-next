import { getEntries } from "@/utils";
import type { StatusCode as HttpStatusCode } from "hono/utils/http-status";

export const ErrorType = [
  "BAD_REQUEST",
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "SERVER_ERROR",
] as const;

export type ErrorType = (typeof ErrorType)[number];

export const HttpErrorStatusCode = [
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424,
  425, 426, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511,
] as const;

export type HttpErrorStatusCode = (typeof HttpErrorStatusCode)[number];

/**
 * アプリケーション内で扱うエラータイプとそれに対応するステータスコードを管理する
 *
 * 1つのHttpステータスコードに対応するエラータイプが複数ある場合は、ステータスコードの後ろに適当な数字を付与する
 *
 * @example
 * AppErrorStatusCode.BAD_REQUEST // 400
 */
export const AppErrorStatusCode = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 4001,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  // 他のステータスコードも必要に応じて追加
} as const satisfies Record<ErrorType, number>;

export type AppErrorStatusCode = (typeof AppErrorStatusCode)[keyof typeof AppErrorStatusCode];
export type UsedHttpStatusCode = Extract<HttpStatusCode, AppErrorStatusCode>;
export type UsedHttpErrorStatusCode = Extract<HttpErrorStatusCode, AppErrorStatusCode>;

/**
 * アプリ内で扱うステータスコードとそれに対応するエラータイプを管理する
 *
 * @example
 * ErrorTypeMap.get(400) // "BAD_REQUEST"
 */
export const ErrorTypeMap = new Map(getEntries(AppErrorStatusCode).map(([key, value]) => [value, key]));

/**
 * AppErrorStatusCodeをHttpStatusCodeに変換する
 *
 * statusの先頭3桁を取得し、数値に変換して返す
 * @example
 * formatToHttpStatusCode(4001) // 400
 */
export const formatToHttpStatusCode = (status: AppErrorStatusCode): HttpStatusCode => {
  return Number.parseInt(status.toString().substring(0, 3)) as HttpStatusCode;
};
