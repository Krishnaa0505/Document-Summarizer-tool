import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server action / API payload size configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
