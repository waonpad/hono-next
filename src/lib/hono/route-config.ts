import { createRoute } from "@hono/zod-openapi";

export type RouteOptions = Parameters<typeof createRoute>[0];

export type RouteConfig = {
  route: ReturnType<typeof createRoute>;
};

export type Route<
  P extends string,
  R extends Omit<RouteOptions, "path"> & {
    path: P;
  },
> = ReturnType<typeof createRoute<P, R>>;

/**
 * RouteConfigを拡張して設定しやすくするための関数
 * @see https://github.com/cellajs/cella/blob/development/backend/src/lib/route-config.ts
 */
export const createRouteConfig = <
  P extends string,
  R extends Omit<RouteOptions, "path"> & {
    path: P;
  },
>(
  routeConfig: R,
): Route<P, R> => {
  return createRoute({
    ...routeConfig,
  });
};
