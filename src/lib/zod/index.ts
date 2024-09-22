// biome-ignore lint/nursery/noRestrictedImports: <explanation>
import { type Primitive, z } from "zod";

export { z } from "./i18n/ja";

/**
 * ZodLiteralのユニオン型を構築する
 *
 * リテラルを1つしか渡さなかった場合は、そのリテラルを2つのリテラルを持つ配列にしてユニオン型を構築する
 */
export function zodLiteralUnionType<T extends Primitive>(constArray: readonly T[]) {
  if (constArray.length === 0) throw new Error("最低1つのリテラルが必要です");

  const literalsArray = (constArray.length === 1 ? [constArray[0], constArray[0]] : constArray).map((literal) =>
    z.literal(literal),
  ) as [z.ZodLiteral<T>, z.ZodLiteral<T>, ...z.ZodLiteral<T>[]];

  return z.union(literalsArray);
}
