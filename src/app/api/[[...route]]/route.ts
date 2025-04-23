import { errorResponse } from "@/lib/errors";
import { customHono } from "@/lib/hono/custom";
import { middlewares } from "@/lib/hono/middlewares";
import { docs } from "@/lib/hono/openapi";
import { handle } from "hono/vercel";
import auth from "./_/auth";
import posts from "./_/posts";
import users from "./_/users";

const app = customHono().basePath("/api");

/**
 * 全てのルートに共通のミドルウェアを適用
 */
app.route("", middlewares);

const route = app.route("/", posts).route("/", users).route("/", auth);

/**
 * Open APIドキュメントのエンドポイントを登録
 */
docs(app);

/**
 * 404エラー時の共通処理
 */
app.notFound((c) => {
  return errorResponse(c, {
    type: "NOT_FOUND",
    message: "Route not found",
  });
});

/**
 * サーバーエラー時の共通処理
 */
app.onError((err, c) => {
  return errorResponse(c, {
    type: "SERVER_ERROR",
    message: "Unexpected error",
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
