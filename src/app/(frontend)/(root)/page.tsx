import { z } from "@/lib/zod";
import type { Metadata } from "next";
import { ClientComponent } from "./_components/client";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
  const validateResult = z
    .object({
      foo: z.string(),
    })
    .safeParse({ foo: 1 });

  console.log(validateResult.error);

  return (
    <div>
      <h1>/</h1>
      <ClientComponent />
    </div>
  );
}
