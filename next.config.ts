import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // This will ignore all ESLint errors during build
  },
};

export default nextConfig;
