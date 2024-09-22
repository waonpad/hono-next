import { OpenAPIHono } from "@hono/zod-openapi";
import type { Schema } from "hono";
import { defaultHook } from "./default-hook";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type Env = {};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export class CustomHono<E extends Env = Env, S extends Schema = {}, BasePath extends string = "/"> extends OpenAPIHono<
  E,
  S,
  BasePath
> {}

/**
 * defaultHook等を毎回設定しなくていいよう、共通設定を持つOpenAPIHonoインスタンスを返す
 */
export const customHono = () => new CustomHono({ defaultHook });
