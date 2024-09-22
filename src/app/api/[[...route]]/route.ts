import { Hono } from "hono";
import { handle } from "hono/vercel"; // Edge 用

import posts from "./posts";

export const runtime = "edge"; // Edge 用

const app = new Hono().basePath("/api");
const route = app.route("/posts", posts);

export type AppType = typeof route;

// Route Handlers 用のexport
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
