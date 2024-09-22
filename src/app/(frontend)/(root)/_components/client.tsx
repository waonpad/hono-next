"use client";

import { z } from "@/lib/zod";
import { useEffect, useState } from "react";

export const ClientComponent = () => {
  const [error, setError] = useState<z.ZodError | null>(null);

  useEffect(() => {
    const validateResult = z
      .object({
        foo: z.string(),
      })
      .safeParse({ foo: 1 });

    console.log(validateResult.error);

    if (validateResult.success === false) {
      setError(validateResult.error);
    }
  }, []);

  return (
    <div>
      <h1>Client Component</h1>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
};
