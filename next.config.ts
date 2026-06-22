import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the pg driver out of the server bundle.
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
};

export default nextConfig;
