import { handle } from "hono/vercel"; // Edge 用

import { customHono } from "@/lib/hono/custom";
import { docs } from "@/lib/hono/openapi";
import posts from "./_/posts";

export const runtime = "edge"; // Edge 用

const app = customHono().basePath("/api");
const route = app.route("/", posts);

docs(app);

export type AppType = typeof route;

// Route Handlers 用のexport
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export const OPTIONS = handle(app);
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
