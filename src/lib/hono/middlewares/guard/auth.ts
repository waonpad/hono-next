import { errorResponse } from "@/lib/errors";
import type { Env } from "@/lib/hono/custom";
import type { Context, Next } from "hono";

export const authGuard = () => async (c: Context<Env>, next: Next) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    return errorResponse(c, {
      message: "Unauthorized",
      type: "UNAUTHORIZED",
    });
  }

  return next();
};
