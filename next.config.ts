import type { NextConfig } from "next/types";
import "./src/config/env/client";
import "./src/config/env/server";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (
  phase: string,
  {
    defaultConfig,
  }: {
    defaultConfig: NextConfig;
  },
): NextConfig => ({
  ...defaultConfig,
  typescript: {
    tsconfigPath: "./tsconfig.build.json",
  },
  experimental: {
    typedRoutes: true,
    reactCompiler: true,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx"].flatMap((extension) => {
    const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;
    return isDevServer ? [`dev.${extension}`, extension] : extension;
  }),
});

export default nextConfig;
