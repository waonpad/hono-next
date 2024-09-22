import { createEnv } from "@t3-oss/env-nextjs";
// biome-ignore lint/nursery/noRestrictedImports: <explanation>
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    APP_ENV: z.enum(["development", "production", "test"]),
  },
  experimental__runtimeEnv: {},
});
