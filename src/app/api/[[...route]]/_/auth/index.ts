/**
 * LuciaとGitHub OAuthを使った認証
 * [examples/hono/github-oauth at main · lucia-auth/examples](https://github.com/lucia-auth/examples/tree/main/hono/github-oauth)
 *
 * Open APIドキュメントは今は必要ないので通常のHonoインスタンスで生やす
 */
import { serverEnv } from "@/config/env/server";
import { github, lucia } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";
import type { Env } from "@/lib/hono/custom";
import { prisma } from "@/lib/prisma/client";
import { OAuth2RequestError, generateState } from "arctic";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

type GitHubUser = {
  id: string;
  login: string;
};

export default new Hono<Env>()
  /**
   * GitHubでのログインURLにリダイレクトするエンドポイント
   */
  .get("/auth/login/github", async (c) => {
    const state = generateState();

    const url = await github.createAuthorizationURL(state);

    setCookie(c, "github_oauth_state", state, {
      path: "/",
      secure: serverEnv.APP_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "Lax",
    });

    return c.redirect(url.toString());
  })
  /**
   * GitHubでのログイン後のコールバックエンドポイント
   */
  .get("/auth/login/github/callback", async (c) => {
    const code = c.req.query("code")?.toString() ?? null;
    const state = c.req.query("state")?.toString() ?? null;

    const storedState = getCookie(c).github_oauth_state ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return errorResponse(c, {
        type: "BAD_REQUEST",
        message: "Invalid Code or State",
      });
    }

    try {
      const tokens = await github.validateAuthorizationCode(code);

      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      const githubUser: GitHubUser = await githubUserResponse.json();

      const existingUser = await prisma.user.findUnique({
        where: { githubId: Number(githubUser.id) },
      });

      if (existingUser) {
        const session = await lucia.createSession(existingUser.id, {});
        c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });

        return c.redirect("/");
      }

      const createdUser = await prisma.user.create({
        data: {
          githubId: Number(githubUser.id),
          name: githubUser.login,
        },
      });

      const userId = createdUser.id;

      const session = await lucia.createSession(userId, {});
      c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });

      return c.redirect("/");
    } catch (e) {
      if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
        // invalid code
        return errorResponse(c, {
          type: "BAD_REQUEST",
          message: "Invalid Code",
        });
      }
      return errorResponse(c, {
        type: "SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  })
  /**
   * ログアウト
   */
  .post("/auth/logout", async (c) => {
    const session = c.get("session");

    if (!session) {
      return errorResponse(c, {
        type: "UNAUTHORIZED",
        message: "Not logged in",
      });
    }

    await lucia.invalidateSession(session.id);
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), { append: true });

    return c.redirect("/");
  });
