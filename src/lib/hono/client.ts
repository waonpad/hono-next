import { hc } from "hono/client";

import type { AppType } from "@/app/api/[[...route]]/route";
import { clientEnv } from "@/config/env/client";

export const client = hc<AppType>(clientEnv.NEXT_PUBLIC_HOST_URL);
