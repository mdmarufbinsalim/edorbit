import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace packages ship TypeScript source; Next compiles them.
  transpilePackages: [
    "@edorbit/core",
    "@edorbit/physics",
    "@edorbit/history",
    "@edorbit/rendering",
    "@edorbit/ui",
    "@edorbit/concepts",
  ],
};

export default nextConfig;
