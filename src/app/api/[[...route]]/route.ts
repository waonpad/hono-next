import { handle } from "hono/vercel";

import { AppErrorStatusCode, type HttpErrorStatusCode } from "@/config/status-code";
import { errorResponse } from "@/lib/errors";
import { customHono } from "@/lib/hono/custom";
import { docs } from "@/lib/hono/openapi";
import { HTTPException } from "hono/http-exception";
import posts from "./_/posts";

const app = customHono().basePath("/api");
const route = app.route("/", posts);

docs(app);

/**
 * 404エラー時の共通処理
 */
app.notFound((c) => {
  return errorResponse(c, {
    message: "Route not found",
    status: AppErrorStatusCode.NOT_FOUND,
  });
});

/**
 * サーバーエラー時の共通処理
 */
app.onError((err, c) => {
  return errorResponse(c, {
    message: "Unexpected error",
    status: err instanceof HTTPException ? (err.status as HttpErrorStatusCode) : AppErrorStatusCode.SERVER_ERROR,
    err,
  });
});

export type AppType = typeof route;

// Route Handlers 用のexport
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export const OPTIONS = handle(app);
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
