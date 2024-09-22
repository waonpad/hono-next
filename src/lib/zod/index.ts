// biome-ignore lint/nursery/noRestrictedImports: <explanation>
import { type Primitive, z } from "zod";

export { z } from "./i18n/ja";

export const isValidZodLiteralUnion = <T extends z.ZodLiteral<unknown>>(literals: T[]): literals is [T, T, ...T[]] =>
  literals.length >= 2;

export function constructZodLiteralUnionType<T extends Primitive>(constArray: readonly T[]) {
  const literalsArray = (constArray.length === 1 ? [constArray[0], constArray[0]] : constArray).map((literal) =>
    z.literal(literal),
  );

  if (!isValidZodLiteralUnion(literalsArray)) {
    throw new Error(
      "Literals passed do not meet the criteria for constructing a union schema, the minimum length is 2",
    );
  }

  return z.union(literalsArray);
}
