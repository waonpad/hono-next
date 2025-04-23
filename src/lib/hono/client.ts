import { hc } from "hono/client";

import { clientEnv } from "@/config/env/client";
import type { AppType } from "@hono-rpc/route";

export const client = hc<AppType>(clientEnv.NEXT_PUBLIC_HOST_URL);
