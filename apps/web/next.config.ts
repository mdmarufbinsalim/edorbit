import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace packages ship TypeScript source; Next compiles them.
  transpilePackages: [
    "@orbital/core",
    "@orbital/physics",
    "@orbital/rendering",
    "@orbital/ui",
    "@orbital/concepts",
  ],
};

export default nextConfig;
