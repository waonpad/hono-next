import { z } from "@/lib/zod";
import { NextResponse } from "next/server";

export const GET = () => {
  const validateResult = z
    .object({
      foo: z.string(),
    })
    .safeParse({ foo: 1 });

  console.log(validateResult.error);

  if (validateResult.success === false) {
    return NextResponse.json(validateResult.error, { status: 400 });
  }

  return NextResponse.json({ foo: "bar" });
};
