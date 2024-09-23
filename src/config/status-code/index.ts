import type { ClientErrorStatusCode, ServerErrorStatusCode } from "hono/utils/http-status";

export const ErrorType = [
  "BAD_REQUEST",
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "SERVER_ERROR",
] as const;

export type ErrorType = (typeof ErrorType)[number];

export type HttpErrorStatusCode = ClientErrorStatusCode | ServerErrorStatusCode;

/**
 * アプリケーション内で扱うエラータイプとそれに対応するステータスコードを管理する
 */
export const AppErrorStatusCode = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  // 他のステータスコードも必要に応じて追加
} as const satisfies Record<ErrorType, HttpErrorStatusCode>;
