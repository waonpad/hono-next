import { clientEnv } from "@/config/env/client";
import { lucia } from "@/lib/auth";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { customHono } from "../custom";

const app = customHono();

// Secure headers
app.use("*", secureHeaders());

// CORS
app.use(
  "*",
  cors({
    // origin: "*",
    origin: clientEnv.NEXT_PUBLIC_HOST_URL,
    credentials: true,
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: [],
  }),
);

// CSRF protection
app.use(
  "*",
  csrf({
    // origin: "*",
    origin: clientEnv.NEXT_PUBLIC_HOST_URL,
  }),
);

/**
 * セッションの処理
 */
app.use("*", async (c, next) => {
  // lucia.sessionCookieNameの値を取得
  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");

  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);

    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session?.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
  }
  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), { append: true });
  }

  c.set("user", user);
  c.set("session", session);

  return next();
});

/**
 * 全てのルートに共通のミドルウェア
 */
export const middlewares = app;
