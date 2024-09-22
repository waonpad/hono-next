import { createEnv } from "@t3-oss/env-nextjs";
// biome-ignore lint/nursery/noRestrictedImports: <explanation>
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    APP_ENV: z.enum(["development", "production", "test"]),
    DB_PRISMA_URL: z.string().min(1),
    DB_URL_NON_POOLING: z.string().min(1),
  },
  experimental__runtimeEnv: {},
});
