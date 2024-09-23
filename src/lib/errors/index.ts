import { AppErrorStatusCode, type AppErrorType } from "@/config/status-code";
import type { Context } from "hono";

export const errorResponse = <ErrorType extends AppErrorType>(
  c: Context,
  {
    message,
    type,
    err,
  }: {
    message: string;
    type: ErrorType;
    err?: Error;
  },
) => {
  if (err) console.error(err);

  const statusCode = AppErrorStatusCode[type];

  const error = {
    message,
    type,
    status: statusCode,
  };

  return c.json({ error }, statusCode);
};
